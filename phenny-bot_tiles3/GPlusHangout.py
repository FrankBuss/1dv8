# GPlusHangout.py

import re

import VidType
from Download import Download



class GPlusHangout(Download):

	def __init__(self):
		Download.__init__(self)
		#self.re_id = re.compile('","(http://.*?)"\]')
		self.re_id = re.compile(',"\d+",\d?,\["([a-zA-Z0-9_]{11})"\]')
		self.urltype = VidType.GPLUSHANGOUT
		self.h = {}

	def extract_id(self, html):
		l = self.re_id.findall(html)
		if l == None or len(l) == 0:
			return None
		return l[0]

	def get_metadata(self, url):
		html = self.fetch_content(url)
		self.h['urltype'] = self.urltype
		vid = self.extract_id(html)
		self.h['vid'] = vid
		self.h['url'] = "http://www.youtube.com/watch?v=%s" % vid
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h