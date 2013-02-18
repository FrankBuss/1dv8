# Ustream.py

import formatter
import htmllib
import json
import re
import urlparse

import VidType
from Download import Download


class Ustream(Download):

	def __init__(self, phenny):
		Download.__init__(self)
		self.re_title = re.compile('ustream\.vars\.channelTitle\=\"(.*?)\"\;ustream\.vars\.')
		self.re_channel = re.compile('ustream\.vars\.channelId\=(\d*?)\;ustream\.vars\.')
		self.apikey = phenny.config.ustreamdevapikey
		self.urltype = None
		self.h = {}

	def extract_id(self, html):
		m = self.re_channel.search(html)
		if m:
			return m.group(1)
		return None

	def extract_title(self, html):
		m = self.re_title.search(html)
		if m:
			return m.group(1)
		return ''

	def get_metadata(self, url):
		r = urlparse.urlparse(url)
		pathlist = r.path[1:].split('/')
		self.h['urltype'] = None
		self.h['url'] = None
		self.h['vid'] = None
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		if pathlist[0] == 'recorded' and pathlist[1].isdigit():
			self.h['urltype'] = VidType.USTREAMR
			self.h['vid'] = pathlist[1]
			self.h['url'] = "http://www.ustream.tv/recorded/%s" % self.h['vid']
			h_json = json.loads(self.fetch_content("http://api.ustream.tv/json/video/%s/getInfo?key=%s" % (self.h['vid'], self.apikey)))
			if h_json['error'] != None or h_json['results'] == None:
				return None
			self.h['title'] = h_json['results']['title']
			if h_json['results']['imageUrl'] != None:
				self.h['imgurl'] = h_json['results']['imageUrl']['medium']
			return self.h
		elif len(pathlist) == 1:
			self.h['urltype'] = VidType.USTREAML
			channelname = pathlist[0]
			newurl = "http://www.ustream.tv/%s" % channelname
			self.h['url'] = newurl
			html = self.fetch_content(newurl)
			vid = self.extract_id(html)
			if vid == None:
				return None
			self.h['vid'] = vid
			self.h['title'] = self.extract_title(html)
			return self.h
		elif len(pathlist) == 2 and pathlist[0] == 'channel':
			self.h['urltype'] = VidType.USTREAML
			channelname = pathlist[1]
			newurl = "http://www.ustream.tv/channel/%s" % channelname
			self.h['url'] = newurl
			h_json = json.loads(self.fetch_content("http://api.ustream.tv/json/channel/%s/getInfo?key=%s" % (channelname, self.apikey)))
			if h_json['error'] != None or h_json['results'] == None:
				html = self.fetch_content(newurl)
				vid = self.extract_id(html)
				if vid == None:
					return None
				title = self.extract_title(html)
				self.h['vid'] = vid
				self.h['title'] = title
				return self.h
			self.h['vid'] = h_json['results']['id']
			self.h['title'] = h_json['results']['title']
			if h_json['results']['imageUrl'] != None:
				self.h['imgurl'] = h_json['results']['imageUrl']['medium']
			return self.h
		return None
