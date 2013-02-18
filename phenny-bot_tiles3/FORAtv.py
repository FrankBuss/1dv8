# FORAtv.py

import re
import urlparse

import VidType
from Download import Download


class FORAtv(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_live_id = re.compile('stream_id \= (\d+?)\;')
		self.re_recorded_id = re.compile('full_program_clipid \= (\d+?)\;')
		self.re_live_title = re.compile('stream_title \= "(.+?)"\;')
		self.re_recorded_title = re.compile('full_program_title \= "(.+?)"\;')
		self.type = None
		self.urltype = None
		self.h = {}

	def extract_id(self, html):
		if self.type == 'live':
			m = self.re_live_id.search(html)
			if not m:
				return None
			return m.group(1)
		elif self.type == 'recorded':
			m = self.re_recorded_id.search(html)
			if not m:
				return None
			return m.group(1)
		return None

	def extract_title(self, html):
		if self.type == 'live':
			m = self.re_live_title.search(html)
			if not m:
				return None
			return m.group(1)
		elif self.type == 'recorded':
			m = self.re_recorded_title.search(html)
			if not m:
				return None
			return m.group(1)
		return None

	def get_metadata(self, url):
		newurl = self.parse_url(url)
		html = self.fetch_content(newurl)
		self.h['urltype'] = self.urltype
		self.h['url'] = newurl
		self.h['vid'] = self.extract_id(html)
		self.h['title'] = self.extract_title(html)
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h

	def parse_url(self, url):
		r = urlparse.urlparse(url)
		pathlist = r.path[1:].split('/')
		if pathlist[0] == 'live':
			self.type = 'live'
			self.urltype = 26	# FORATVL
		else:
			self.type = 'recorded'
			self.urltype = 27	# FORATVR
		return url