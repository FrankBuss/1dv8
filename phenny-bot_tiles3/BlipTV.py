# BlipTV.py

import re

import VidType
from Download import Download


class BlipTV(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_vid = re.compile('<meta property="og:video"\s+content="http://blip\.tv/play/(.*?)"/>')
		self.re_title = re.compile('<title>(.*?)</title>')
		self.urltype = VidType.BLIPTV
		self.h = {}

	def extract_id(self, html):
		m = self.re_vid.search(html)
		if not m:
			return None
		return m.group(1)

	def extract_title(self, html):
		m = self.re_title.search(html)
		if not m:
			return ''
		title = m.group(1)
		# need to strip | and everything on the right of |
		return title[0:title.rfind('|') - 1]

	def get_metadata(self, url):
		html = self.fetch_content(url)
		self.h['urltype'] = self.urltype
		self.h['url'] = url
		self.h['vid'] = self.extract_id(html)
		self.h['title'] = self.extract_title(html)
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h