# MITOpenCourseWare.py

import re

import VidType
from YouTube import YouTube


class MITOpenCourseWare(YouTube):

	def __init__(self):
		YouTube.__init__(self)
		self.re_youtube = re.compile("'http://www.youtube.com/v/(.+?)',")
		self.urltype = VidType.MITOCW

	def extract_id(self, html):
		m = self.re_youtube.search(html)
		if m == None:
			return None
		return m.group(1)

	def get_metadata(self, url):
		html = self.fetch_content(url)
		vid = self.extract_id(html)
		r = urlparse.urlparse(url)
		url = "http://www.youtube.com/watch?v=%s#%s" % (vid, r.fragment)
		h = YouTube.get_metadata(self, url)
		h['urltype'] = self.urltype
		self.h = h
		return self.h
