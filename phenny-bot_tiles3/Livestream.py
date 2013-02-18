# Livestream.py

import re
import urlparse

import VidType
from Download import Download


class Livestream(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_title = re.compile('<h1 id="channel-info-title">(.+?)</h1>')
		self.type = None
		self.urltype = None
		self.h = {}

	def extract_title(self, html):
		m = self.re_title.search(html)
		if not m:
			return None
		return m.group(1)

	def get_metadata(self, url):
		vid, newurl = self.parse_url(url)
		html = self.fetch_content(newurl)
		self.h['urltype'] = self.urltype
		self.h['url'] = newurl
		self.h['vid'] = vid
		self.h['title'] = self.extract_title(html)
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h

	def parse_url(self, url):
		r = urlparse.urlparse(url)
		qs = urlparse.parse_qs(r.query)
		pathlist = r.path[1:].split('/')
		if len(pathlist) == 2 and pathlist[1] == 'video' and qs.has_key('clipId'):
			self.type = 'recorded'
			self.urltype = VidType.LIVESTREAMR
			clipid = qs['clipId'][0]
			vid = "%s\t%s" % (pathlist[0], clipid)
			newurl = "http://www.livestream.com/%s/video?clipId=%s" % (pathlist[0], clipid)
		else:
			self.type = 'live'
			self.urltype = VidType.LIVESTREAML
			vid = pathlist[0]
			newurl = "http://www.livestream.com/%s" % pathlist[0]
		return vid, newurl