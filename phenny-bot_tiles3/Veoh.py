# Veoh.py

import re

import VidType
from Download import Download


#veoh.com/watch/v15920289YYcT3qqt/

class Veoh(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_id = re.compile("<meta\s+name\=\"item\-id\"\s+content\=\"(.*?)\"")
		self.re_title = re.compile("<meta\s+name\=\"title\"\s+content\=\"(.*?)\"")
		self.urltype = VidType.VEOH
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