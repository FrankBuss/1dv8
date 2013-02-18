#!/usr/bin/env python
"""
irc.py - A Utility IRC Bot
Copyright 2008, Sean B. Palmer, inamidst.com
Licensed under the Eiffel Forum License 2.

http://inamidst.com/phenny/
"""

import sys, re, time, traceback
import socket, asyncore, asynchat

import time
import threading

class Origin(object):
	source = re.compile(r'([^!]*)!?([^@]*)@?(.*)')

	def __init__(self, bot, source, args):
		match = Origin.source.match(source or '')
		self.nick, self.user, self.host = match.groups()

		if len(args) > 1:
			target = args[1]
		else: target = None

		mappings = {bot.nick: self.nick, None: None}
		self.sender = mappings.get(target, target)

class Bot(asynchat.async_chat):
	def __init__(self, nick, name, channels, password=None):
		asynchat.async_chat.__init__(self)
		self.set_terminator('\n')
		self.buffer = ''

		self.nick = nick
		self.user = nick
		self.name = name
		self.password = password

		self.verbose = True
		self.channels = channels or []
		self.stack = []

		import threading
		self.sending = threading.RLock()

		self.host = None
		self.port = None

		self.pingtimeoutsec = 300.0
		self.lastpingtime = None
		self.pingtimer = None
		self.retrycount = 0

		self.logfn = '/tmp/tiles_log.txt'
		self.logfh = open(self.logfn, 'a', 0600)

	def debug(self, func, s):
		print "%s: %s :: %s" % (self.now(), func, s)
		self.logfh.write("%s: %s :: %s\n" % (self.now(), func, s))
		self.logfh.flush()

	def pingcheck(self):
		self.debug("pingcheck", "started")
		self.debug("pingcheck", "self.pingtimer = %s" % self.pingtimer)
		self.debug("pingcheck", "self.lastpingtime = %s" % self.lastpingtime)
		self.debug("pingcheck", "time.time() = %s" % time.time())

		if self.retrycount > 5:
			print >>sys.stderr, "tried to reconnect and failed multiple times"
			self.debug("pingheck", "tried to reconnect and failed multiple times")
			sys.exit()
		if (time.time() - self.lastpingtime) > self.pingtimeoutsec:
			self.debug("pingcheck", "timeout detected, reconnecting")
			self.retrycount += 1
			self.debug("pingcheck", "self.retrycount = %s" % self.retrycount)
			self.msg('tilebot1', '.')
			self.debug("pingcheck", "sending self msg")
			self.debug("pingcheck", "sleeping for 10 sec")
			time.sleep(10)
			self.handle_close()
			self.debug("pingcheck", "calling handle_close()")
			self.initiate_connect(self.host, self.port)
			self.debug("pingcheck", "calling initiate_connect()")

	def __write(self, args, text=None):
		# print '%r %r %r' % (self, args, text)
		try:
			if text is not None:
				self.push(' '.join(args) + ' :' + text + '\r\n')
			else: self.push(' '.join(args) + '\r\n')
		except IndexError:
			pass

	def write(self, args, text=None):
		# This is a safe version of __write
		def safe(input):
			input = input.replace('\n', '')
			input = input.replace('\r', '')
			return input.encode('utf-8')
		try:
			args = [safe(arg) for arg in args]
			if text is not None:
				text = safe(text)
			self.__write(args, text)
		#except Exception, e: pass
		except Exception, e:
			print "Exception caught during write"
			print "%s: %s" % (self.now(), e.__class__ + ': ' + str(e))
			self.debug("write", "Exception caught during write")
			self.debug("write", "%s" % (e.__class__ + ': ' + str(e)))
			#print >> sys.stderr, e

	def run(self, host, port=6667):
		self.initiate_connect(host, port)

	def initiate_connect(self, host, port):
		self.host = host
		self.port = port
		if self.verbose:
			message = 'Connecting to %s:%s...' % (host, port)
			print >> sys.stderr, message,
		self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
		self.connect((host, port))
		try:
			asyncore.loop()
		except KeyboardInterrupt:
			sys.exit()
		except Exception, e:
			print "Exception caught during asyncore.loop()"
			print "%s: %s" % (self.now(), e.__class__ + ': ' + str(e))
			self.debug("initiate_connect", "Exception caught during asyncore.loop()")
			self.debug("initiate_connect", "%s" % (e.__class__ + ': ' + str(e)))
			#sys.exit()

	def handle_connect(self):
		if self.verbose:
			print >> sys.stderr, 'connected!'
		if self.password:
			self.write(('PASS', self.password))
		self.write(('NICK', self.nick))
		self.write(('USER', self.user, '+iw', self.nick), self.name)
		#if self.password:
			#self.msg('nickserv', 'identify %s' % self.password)

	def handle_close(self):
		self.close()
		print >> sys.stderr, 'Closed!'

	def handle_read(self):
		try:
			return asynchat.async_chat.handle_read(self)
		except:
			self.debug("handle_read", "exception handling")
			self.handle_error()
			return

	def now(self):
		return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

	def collect_incoming_data(self, data):
		#print "%s: %s" % (self.now(), data)
		self.debug("collect_incoming_data", "data = %s" % data)
		self.buffer += data

	def found_terminator(self):
		line = self.buffer
		if line.endswith('\r'):
			line = line[:-1]
		self.buffer = ''

		# print line
		if line.startswith(':'):
			source, line = line[1:].split(' ', 1)
		else: source = None

		if ' :' in line:
			argstr, text = line.split(' :', 1)
		else: argstr, text = line, ''
		args = argstr.split()

		origin = Origin(self, source, args)
		self.dispatch(origin, tuple([text] + args))

		if args[0] == 'PING':
			self.debug("found_terminator", "ping received")
			self.write(('PONG', text))
			self.debug("found_terminator", "pong sent, text = %s" % text)
			#self.msg('tilebot1', '.')

			self.debug("found_terminator", "self.pingtimer = %s" % self.pingtimer)
			if self.pingtimer != None:
				self.debug("found_terminator", "resetting pingtimer")
				self.pingtimer.cancel()
				self.debug("found_terminator", "calling self.pingtimer.cancel()")
				self.pingtimer = None
			self.retrycount = 0
			self.lastpingtime = time.time()
			self.debug("found_terminator", "self.lastpingtime = %s" % self.lastpingtime)
			self.debug("found_terminator", "self.pingtimeoutsec = %s" % self.pingtimeoutsec)
			self.pingtimer = threading.Timer(self.pingtimeoutsec, self.pingcheck)
			self.debug("found_terminator", "self.pingtimer = %s" % self.pingtimer)
			self.pingtimer.start()
			self.debug("found_terminator", "calling self.pingtimer.start()")
			self.debug("found_terminator", "self.pingtimer = %s" % self.pingtimer)

	def dispatch(self, origin, args):
		pass

	def msg(self, recipient, text):
		self.sending.acquire()

		# Cf. http://swhack.com/logs/2006-03-01#T19-43-25
		if isinstance(text, unicode):
			try: text = text.encode('utf-8')
			except UnicodeEncodeError, e:
				text = e.__class__ + ': ' + str(e)
		if isinstance(recipient, unicode):
			try: recipient = recipient.encode('utf-8')
			except UnicodeEncodeError, e:
				return

		# No messages within the last 3 seconds? Go ahead!
		# Otherwise, wait so it's been at least 0.8 seconds + penalty
		if self.stack:
			elapsed = time.time() - self.stack[-1][0]
			if elapsed < 3:
				penalty = float(max(0, len(text) - 50)) / 70
				wait = 0.8 + penalty
				if elapsed < wait:
					time.sleep(wait - elapsed)

		# Loop detection
		messages = [m[1] for m in self.stack[-8:]]
		if messages.count(text) >= 5:
			text = '...'
			if messages.count('...') >= 3:
				self.sending.release()
				return

		self.__write(('PRIVMSG', recipient), text)
		self.stack.append((time.time(), text))
		self.stack = self.stack[-10:]

		self.sending.release()

	def notice(self, dest, text):
		self.write(('NOTICE', dest), text)

	def error(self, origin):
		try:
			import traceback
			trace = traceback.format_exc()
			print trace
			lines = list(reversed(trace.splitlines()))

			report = [lines[0].strip()]
			for line in lines:
				line = line.strip()
				if line.startswith('File "/'):
					report.append(line[0].lower() + line[1:])
					break
			else: report.append('source unknown')

			self.msg(origin.sender, report[0] + ' (' + report[1] + ')')
		except: self.msg(origin.sender, "Got an error.")

class TestBot(Bot):
	def f_ping(self, origin, match, args):
		delay = m.group(1)
		if delay is not None:
			import time
			time.sleep(int(delay))
			self.msg(origin.sender, 'pong (%s)' % delay)
		else: self.msg(origin.sender, 'pong')
	f_ping.rule = r'^\.ping(?:[ \t]+(\d+))?$'

def main():
	# bot = TestBot('testbot', ['#d8uv.com'])
	# bot.run('irc.freenode.net')
	print __doc__

if __name__=="__main__":
	main()
