# Revision3.py

import re

import VidType
from Download import Download


class Revision3(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_id = re.compile('revision3\.com\/player-v(\d+?)\"')
		self.re_title = re.compile('<title>(.*?)</title>')
		self.urltype = VidType.REVISION3
		self.h = {}

	def extract_id(self, html):
		m = self.re_id.search(html)
		if not m:
			return None
		return m.group(1)

	def extract_title(self, html):
		m = self.re_title.search(html)
		if not m:
			return None
		return m.group(1)

	def get_metadata(self, url):
		self.h['urltype'] = self.urltype
		self.h['url'] = url
		html = self.fetch_content(url)
		self.h['vid'] = self.extract_id(html)
		self.h['title'] = self.extract_title(html)
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h