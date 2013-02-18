# JustinTV.py

import urlparse

import VidType
from Download import Download


class JustinTV(Download):

	def __init__(self, phenny):
		Download.__init__(self)
		self.urltype = None	# 50 - JUSTINTV
		self.type = None
		self.consumerkey = phenny.config.justintvkey
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
		if len(pathlist) == 1:
			self.type = 'live'
			self.urltype = VidType.JUSTINTVL
			vid = "%s\t%s" % (pathlist[0], self.consumerkey)
		elif len(pathlist) == 3 and pathlist[1] == 'b':
			self.type = 'recorded'
			self.urltype = VidType.JUSTINTVR
			vid = "%s\t%s\t%s" % (pathlist[0], pathlist[2], self.consumerkey)
		else:
			return None, None
		return vid, "http://www.justin.tv%s" % r.path