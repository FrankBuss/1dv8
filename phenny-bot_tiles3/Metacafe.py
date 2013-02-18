# Metacafe.py

import urlparse

import VidType
from Download import Download


class Metacafe(Download):

	def __init__(self):
		Download.__init__(self)
		self.urltype = VidType.METACAFE
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
		pathlist = r.path[1:].split('/')
		if len(pathlist) < 3:
			return
		return "%s\t%s" % (pathlist[1], pathlist[2]), "http://www.metacafe.com/watch/%s/%s/" % (pathlist[1], pathlist[2])