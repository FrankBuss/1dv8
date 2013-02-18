# Viddler.py

import formatter
import htmllib
import urlparse

import VidType
from Download import Download


class ExtractViddlerVideoID(htmllib.HTMLParser):

	def __init__(self, formatter):
		htmllib.HTMLParser.__init__(self, formatter)
		self.id = None
		self.f_found = False

	def start_link(self, attriblist):
		if self.id != None:
			return
		if not len(attriblist) > 0:
			return
		for attr in attriblist:
			if attr[0] == 'rel' and attr[1] == 'video_src':
				self.f_found = True
				continue
			if self.f_found == True and attr[0] == 'href':
				url = attr[1]
				r = urlparse.urlparse(url)
				self.id = r.path.split('/')[2]
			else:
				self.f_found = False

	def get_id(self):
		return self.id


class Viddler(Download):

	def __init__(self):
		Download.__init__(self)
		self.urltype = VidType.VIDDLER
		self.h = {}

	def extract_id(self, html):
		parser = ExtractViddlerVideoID(formatter.NullFormatter())
		parser.feed(html)
		parser.close()
		return parser.get_id()

	def get_metadata(self, url):
		self.h['urltype'] = self.urltype
		self.h['url'] = url
		self.h['vid'] = self.extract_id(self.fetch_content(url))
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h