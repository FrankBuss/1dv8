# YouTube.py

import httplib
import re
import urlparse
import xml.dom.minidom


import VidError
import VidType
from Download import Download


# Not a valid YouTube video
# Private video
# Embed disbled
# Age restricted video

class YouTube(Download):

	def __init__(self, phenny):
		Download.__init__(self)
		self.re_id = re.compile("^[a-zA-Z0-9\_\-]{11}$")
		self.re_fragment = re.compile("^t\=((\d+)h)?((\d+)m)?((\d+)s)?$")
		self.urltype = VidType.YOUTUBE
		self.h = {}
		self.gdatahost = 'gdata.youtube.com'
		self.developer_key = phenny.config.youtubedevapikey
		self.gdataxml = None

	def get_metadata(self, url):
		if url.find('/verify_age?') > -1:
			self.h['urltype'] = self.urltype
			self.h['url'] = None
			self.h['vid'] = None
			self.h['title'] = ''
			self.h['imgurl'] = ''
			self.h['stime'] = 0
			self.h['error'] = VidError.RESTRICTED
			return self.h
		vid, newurl, stime = self.parse_url(url)
		self.h['urltype'] = self.urltype
		self.h['url'] = newurl
		self.h['vid'] = vid
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = stime
		self.h['error'] = None
		self.gdataxml, status = self.retrieve_gdata(vid)
		if self.gdataxml == None:
			self.h['error'] = VidError.INVALID
			return self.h
		self.h_meta = self.parse_gdata()
		self.h['title'] = self.h_meta['title']
		if self.h_meta['noembed']:
			self.h['error'] = VidError.EMBED_DISABLED
			return self.h
		if self.h_meta['private']:
			self.h['error'] = VidError.PRIVATE
			return self.h
		#if self.is_restricted(vid):
			#self.h['error'] = VidError.RESTRICTED
			#return self.h
		return self.h

	#def is_restricted(self, vid):
		#conn = httplib.HTTPConnection("%s:%s" % ('www.youtube.com', 80))
		#conn.request("HEAD", "/watch?v=%s" % vid)
		#response = conn.getresponse()
		#location = response.getheader('location')
		#conn.close()
		#if location != None and location.index('/verify_age?') > -1:
			#return True
		#return False

	def parse_fragment(self, fragment):
		m = self.re_fragment.search(fragment)
		if m == None:
			return [None, None, None]
		if m.group(2) == None:
			starthour = 0
		else:
			starthour = int(m.group(2))
		if m.group(4) == None:
			startmin = 0
		else:
			startmin = int(m.group(4))
		if m.group(6) == None:
			startsec = 0
		else:
			startsec = int(m.group(6))
		if startsec > 59:
			startmin += startsec / 60
			startsec %= 60
		if startmin > 59:
			starthour += startmin / 60
			startmin %= 60
		return [starthour, startmin, startsec]

	def parse_gdata(self):
		dom = xml.dom.minidom.parseString(self.gdataxml)
		h = {}
		h['title'] = dom.getElementsByTagName('title')[0].firstChild.data
		h['author'] = dom.getElementsByTagName('author')[0].getElementsByTagName('name')[0].firstChild.data
		h['length'] = dom.getElementsByTagName('yt:duration')[0].getAttribute('seconds')
		h['published'] = dom.getElementsByTagName('published')[0].firstChild.data
		h['updated'] = dom.getElementsByTagName('updated')[0].firstChild.data
		if len(dom.getElementsByTagName('gd:feedLink')) > 0:
			h['commentcount'] = dom.getElementsByTagName('gd:feedLink')[0].getAttribute('countHint')
		else:
			h['commentcount'] = 0
		if len(dom.getElementsByTagName('yt:statistics')) > 0:
			h['favoritecount'] = dom.getElementsByTagName('yt:statistics')[0].getAttribute('favoriteCount')
		else:
			h['favoritecount'] = 0
		if len(dom.getElementsByTagName('yt:statistics')) > 0:
			h['viewcount'] = dom.getElementsByTagName('yt:statistics')[0].getAttribute('viewCount')
		else:
			h['viewcount'] = 0
		if len(dom.getElementsByTagName('gd:rating')) > 0:
			h['ratingaverage'] = dom.getElementsByTagName('gd:rating')[0].getAttribute('average')
		else:
			h['ratingaverage'] = None
		if len(dom.getElementsByTagName('gd:rating')) > 0:
			h['ratingcount'] = dom.getElementsByTagName('gd:rating')[0].getAttribute('numRaters')
		else:
			h['ratingcount'] = None
		if len(dom.getElementsByTagName('yt:noembed')) > 0:
			h['noembed'] = True
		else:
			h['noembed'] = False
		if len(dom.getElementsByTagName('yt:private')) > 0:
			h['private'] = True
		else:
			h['private'] = False
		h['mediarestriction'] = None
		for item in dom.getElementsByTagName('media:restriction'):
			if item.getAttribute('type') == 'country' and item.getAttribute('relationship') == 'deny':
				h['mediarestriction'] = sorted(item.firstChild.data.split(' '))
		return h

	def parse_url(self, url):
		r = urlparse.urlparse(url)
		qs = urlparse.parse_qs(r.query)
		if not qs.has_key('v'):
			return None, None, None
		vid = qs['v'][0]
		if not self.re_id.search(vid):
			return None, None, None
		# google does this "nice" thing where if user puts t=XmYs video start param into the query string instead,
		# of url fragment it will treat it as though it was put into url fragment.  I'll try to duplicate this effect
		# with the caveat that if user also puts this into the url fragment, that will override the query string
		# values.  It looks like I'm doing this twice but it's merly trying to duplicate youtube's behavior
		# as faithfully as I can.
		f_starttime = False
		stime = 0
		if qs.has_key('t'):
			starthour, startmin, startsec = self.parse_fragment("t=%s" % qs['t'][0])
			if not (starthour == None and startmin == None and startsec == None):
				stime = (starthour * 3600) + (startmin * 60) + startsec
				if starthour == 0 and startmin == 0 and startsec == 0:
					f_starttime = False
				else:
					f_starttime = True
		if r.fragment:
			starthour, startmin, startsec = self.parse_fragment(r.fragment)
			if not (starthour == None and startmin == None and startsec == None):
				stime = (starthour * 3600) + (startmin * 60) + startsec
				if starthour == 0 and startmin == 0 and startsec == 0:
					f_starttime = False
				else:
					f_starttime = True
		if f_starttime:
			if starthour == 0:
				if startmin == 0:
					newurl = "http://www.youtube.com/watch?v=%s#t=%ss" % (vid, startsec)
				else:
					newurl = "http://www.youtube.com/watch?v=%s#t=%sm%ss" % (vid, startmin, startsec)
			else:
				newurl = "http://www.youtube.com/watch?v=%s#t=%sh%sm%ss" % (vid, starthour, startmin, startsec)
		else:
			newurl = "http://www.youtube.com/watch?v=%s" % vid
		return vid, newurl, stime

	def retrieve_gdata(self, vid):
		headers = {"X-GData-Key": "key=%s" % self.developer_key}
		conn = httplib.HTTPConnection(self.gdatahost)
		conn.request("GET", "/feeds/api/videos/%s" % vid, None, headers)
		response = conn.getresponse()
		if int(response.status) != 200:
			conn.close()
			print "ERROR  Status: %s, Reason: %s" % (response.status, response.reason)
			return None, response.status
		gdataxml = response.read()
		conn.close()
		return gdataxml, response.status
