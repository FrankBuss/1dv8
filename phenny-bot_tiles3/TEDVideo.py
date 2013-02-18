# TEDVideo.py

import json
import re
import urllib2

import VidType
from Download import Download


class TEDVideo(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_idblob = re.compile("si:\"(.+?)\",")
		self.re_title = re.compile("<title>(.*?) \|  Video on TED\.com<\/title>")
		self.urltype = VidType.TED
		self.h = {}

	def extract_id(self, html):
		m = self.re_idblob.search(html)
		if not m:
			return None
		blob = urllib2.unquote(m.group(1))
		#print "TED :: extract_id :: blob = %s" % blob
		jsonvar = json.loads(blob)
		for item in jsonvar:
			#print item
			if item.has_key('bitrate') and item['bitrate'] == 320:
				fn = item['file']
				break
		if fn[:4] == 'mp4:':
			fn = fn[4:]
		return fn

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