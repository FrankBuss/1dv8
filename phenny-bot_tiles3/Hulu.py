# Hulu.py

import re

import VidType
from Download import Download

#<link rel="media:video" href="http://www.hulu.com/embed/5X45_QdvHjkp4NkQ4XLIXA" />

#<meta property="og:title" content="ABC Nightline: Wed, Oct 5, 2011"/>


class Hulu(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_id = re.compile('<link rel="media:video" href="http:\/\/www\.hulu\.com\/embed\/(.*?)"')
		self.re_title = re.compile('<meta property="og:title" content="(.*?)"')
		self.urltype = VidType.HULU
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
		html = self.fetch_content(url)
		self.h['urltype'] = self.urltype
		self.h['url'] = url
		self.h['vid'] = self.extract_id(html)
		self.h['title'] = self.extract_title(html)
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h