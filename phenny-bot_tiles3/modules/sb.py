#!/usr/bin/env python

import sys
import time
from threading import Thread
from SimpleXMLRPCServer import SimpleXMLRPCServer

import objc
from Foundation import *
from AppKit import *

# SERVERIP: speechbot server ip
SERVERIP = '10.0.0.10'

# SERVERPORT: speechbot server port
SERVERPORT = 8000

# Agnes - 35
# Alex - 35
# Bruce - 35
# Fred - 30
# Junior - 8
# Kathy - 30
# Princess - 8
# Ralph - 50
# Trinoids - 2001
# Vicki - 35
# Victoria - 35
# Zarvox -


class SynthText:
	def __init__(self, voice, rate, text):
		self.voice = voice
		self.rate = rate
		self.text = text



class AppSB(NSObject):
	def __init__(self):
		NSObject.__init__(self)

	def applicationDidFinishLaunching_(self, app):
		print "AppSB :: applicationDidFinishLaunching_"
		self.synth = NSSpeechSynthesizer.alloc().init()
		print NSSpeechSynthesizer.availableVoices()
		self.setvoice("Alex")
		self.synth.setDelegate_(self)
		self.f_speaking = None
		self.lastrate = None
		self.lastvoice = None

	def is_speaking(self):
		return self.f_speaking

	def setrate(self, rate):
		print "AppSB :: setrate - %s" % rate
		pool = NSAutoreleasePool.alloc().init()
		self.synth.setRate_(rate)
		del pool

	def setvoice(self, voice):
		print "AppSB :: setvoice - %s" % voice
		pool = NSAutoreleasePool.alloc().init()
		self.synth.setVoice_("com.apple.speech.synthesis.voice." + voice)
		print NSSpeechSynthesizer.attributesForVoice_("com.apple.speech.synthesis.voice." + voice)
		del pool

	def setvolume(self, volume):
		print "AppSB :: setvolume - %s" % volume
		pool = NSAutoreleasePool.alloc().init()
		self.synch.setVolume_(volume)
		del pool

	def speak(self, st):
		print "AppSB :: speak - %s, %s, %s" % (st.voice, st.rate, st.text)
		pool = NSAutoreleasePool.alloc().init()
		self.f_speaking = True
		if self.lastvoice != st.voice:
			self.setvoice(st.voice)
			self.lastvoice = st.voice
		if self.lastrate != st.rate:
			self.setrate(st.rate)
			self.lastrate = st.rate
		self.synth.startSpeakingString_(st.text)
		del pool

	def speechSynthesizer_willSpeakWord_ofString_(self, synth, word, string):
		print "\trate:", synth.rate() , ", said:", string[word.location : word.location + word.length]

	def speechSynthesizer_didFinishSpeaking_(self, synth, finishedSpeaking):
		if finishedSpeaking:
			print "finished speaking normally"
		else:
			print "finished speaking abnormally"
		#NSApp().terminate_(self)
		self.f_speaking = False

	def terminate(self):
		print "AppSB :: terminate"
		pool = NSAutoreleasePool.alloc().init()
		NSApp().terminate_(self)
		del pool
		print "AppSB :: terminate - after del pool"



class QueueThread(Thread):

	def __init__(self, sbobj):
		Thread.__init__(self)
		self.sbobj = sbobj
		self.f_quit = False
		self.l = []

	def add(self, voice, rate, text):
		print "QueueThread :: add - text = %s" % text
		st = SynthText(voice, rate, text)
		self.l.append(st)

	def get(self):
		print "QueueThread :: get"
		st = self.l.pop(0)
		print "QueueThread :: get - item = %s, %s, %s" %  (st.voice, st.rate, st.text)
		return st

	def run(self):
		while (1):
			if self.f_quit:
				break
			if len(self.l) > 0:
				if not self.sbobj.is_speaking():
					self.sbobj.speak(self.get())
			time.sleep(0.01)

	def terminate(self):
		self.f_quit = True



class ListenerThread(Thread):

	def __init__(self, sbobj, qobj):
		Thread.__init__(self)
		self.server = SimpleXMLRPCServer((SERVERIP, SERVERPORT), logRequests = False, allow_none = True)
		self.server.register_introspection_functions()
		print "ListenerThread :: __init__"
		self.sbobj = sbobj
		self.qobj = qobj
		self.q = []
		self.server.register_function(self.speak)
		self.server.register_function(self.terminate)

	def speak(self, voice, rate, text):
		print "ListenerThread :: speak - %s, %s, %s" % (voice, rate, text)
		self.qobj.add(voice, rate, text)

	def terminate(self):
		self.qobj.terminate()
		self.sbobj.terminate()
		sys.exit()

	def run(self):
		print "ListenerThread :: run"
		self.server.serve_forever()


if __name__ == '__main__':
	sb = NSApplication.sharedApplication()

	delegate = AppSB.alloc().init()
	sb.setDelegate_(delegate)

	q = QueueThread(delegate)
	q.start()

	lt = ListenerThread(delegate, q)
	lt.start()

	print "before sb.run()"
	sb.run()
	print "after sb.run()"
