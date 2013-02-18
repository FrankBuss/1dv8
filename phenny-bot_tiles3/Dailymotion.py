# Dailymotion.py

import re
import urlparse

import VidType
from Download import Download


class Dailymotion(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_url = re.compile("^http\:\/\/(www\.)dailymotion\.com\/video\/([a-z0-9]+?)\_")
		self.urltype = VidType.DAILYMOTION
		self.h = {}

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
		m = self.re_url.search(url)
		if not m:
			return None, None
		r = urlparse.urlparse(url)
		return m.group(2), "http://www.dailymotion.com%s" % r.path