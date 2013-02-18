# Qik.py

import formatter
import htmllib
import re
import urlparse

import VidType
from Download import Download


class ExtractQikStreamID(htmllib.HTMLParser):

	def __init__(self, formatter):
		htmllib.HTMLParser.__init__(self, formatter)
		self.re_streamid = re.compile('streamID\=(.+)\&')
		self.streamid = None

	def start_link(self, attriblist):
		if self.streamid != None:
			return
		if not len(attriblist) > 0:
			return
		for attr in attriblist:
			if attr[0] == 'href':
				m = self.re_streamid.search(attr[1])
				if m:
					self.streamid = m.group(1)

	def get_streamid(self):
		return self.streamid


class ExtractQikUserID(htmllib.HTMLParser):

	def __init__(self, formatter):
		htmllib.HTMLParser.__init__(self, formatter)
		self.re_userid = re.compile('\.css\?(\d+)$')
		self.userid = None

	def start_link(self, attriblist):
		if self.userid != None:
			return
		if not len(attriblist) > 0:
			return
		for attr in attriblist:
			if attr[0] == 'href':
				m = self.re_userid.search(attr[1])
				if m:
					self.userid = m.group(1)

	def get_userid(self):
		return self.userid


class Qik(Download):

	def __init__(self):
		Download.__init__(self)
		self.type = None
		self.urltype = None	# 90 - QIKL, 91 - QIKR
		self.h = {}

	def extract_streamid(self, html):
		parser = ExtractQikStreamID(formatter.NullFormatter())
		parser.feed(html)
		parser.close()
		return parser.get_streamid()

	def extract_userid(self, html):
		parser = ExtractQikUserID(formatter.NullFormatter())
		parser.feed(html)
		parser.close()
		return parser.get_userid()

	def get_metadata(self, url):
		vid, newurl = self.parse_url(url)
		self.h['urltype'] = self.urltype
		self.h['url'] = newurl
		self.h['vid'] = vid
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h

	def parse_url(self, url):
		r = urlparse.urlparse(url)
		pathlist = r.path[1:].split('/')
		if pathlist[0] == 'video' and pathlist[1].isdigit():
			self.type = 'recorded'
			self.urltype = VidType.QIKR
			newurl = "http://qik.com/video/%s" % pathlist[1]
			return self.extract_streamid(self.fetch_content(newurl)), newurl
		elif len(pathlist) == 1:
			self.type = 'live'
			self.urltype = VidType.QIKL
			newurl = "http://qik.com/%s" % pathlist[0]
			return "%s\t%s" % (self.extract_userid(self.fetch_content(newurl)), pathlist[0]), newurl