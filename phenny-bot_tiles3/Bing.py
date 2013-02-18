# Bing.py

import re

import VidType
from Download import Download


class Bing(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_id = re.compile('\.swf\?player\.v\=(.+?)\&amp\;')
		self.urltype = VidType.BING
		self.h = {}

	def extract_id(self, html):
		m = self.re_id.search(html)
		if not m:
			return None
		return m.group(1)

	def get_metadata(self, url):
		self.h['urltype'] = self.urltype
		self.h['url'] = url
		self.h['vid'] = self.extract_id(self.fetch_content(url))
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h