# LiveLeak.py

import re
import urlparse

import VidType
from Download import Download


class LiveLeak(Download):

	def __init__(self):
		Download.__init__(self)
		self.urltype = VidType.LIVELEAK
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
		r = urlparse.urlparse(url)
		qs = urlparse.parse_qs(r.query)
		return qs['i'][0], "http://www.liveleak.com/view?i=%s" % qs['i'][0]