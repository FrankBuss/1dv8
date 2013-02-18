# GoogleVideo.py

import re
import urlparse

import VidType
from Download import Download


class GoogleVideo(Download):

	def __init__(self):
		Download.__init__(self)
		self.re_fragment = re.compile("^(t\=)?((\d+)h)?((\d+)m)?((\d+)s)?$")
		self.urltype = VidType.GOOGLEVIDEO
		self.h = {}

	def get_metadata(self, url):
		vid, newurl, stime = self.parse_url(url)
		self.h['urltype'] = self.urltype
		self.h['url'] = newurl
		self.h['vid'] = vid
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = stime
		self.h['error'] = None
		return self.h

	def parse_fragment(self, fragment):
		m = self.re_fragment.search(fragment)
		if m == None:
			return [None, None, None]
		if m.group(3) == None:
			starthour = 0
		else:
			starthour = int(m.group(3))
		if m.group(5) == None:
			startmin = 0
		else:
			startmin = int(m.group(5))
		if m.group(7) == None:
			startsec = 0
		else:
			startsec = int(m.group(7))
		if startsec > 59:
			startmin += startsec / 60
			startsec %= 60
		if startmin > 59:
			starthour += startmin / 60
			startmin %= 60
		return [starthour, startmin, startsec]

	def parse_url(self, url):
		r = urlparse.urlparse(url)
		qs = urlparse.parse_qs(r.query)
		vid = qs['docid'][0]
		# google does this "nice" thing where if user puts t=XmYs video start param into the query string instead,
		# of fragment it will treat it as though it was put into url fragment.  I'll try to duplicate this effect
		# with the caveat that if user also puts this into the url fragment, that will override the query string
		# values.  It looks like I'm doing this twice but it's merly trying to duplicate youtube's behavior
		# as faithfully as I can.
		f_starttime = False
		stime = 0
		if qs.has_key('t'):
			starthour, startmin, startsec = self.parse_fragment(qs['t'][0])
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
					newurl = "http://video.google.com/videoplay?docid=%s#t=%ss" % (vid, startsec)
				else:
					newurl = "http://video.google.com/videoplay?docid=%s#t=%sm%ss" % (vid, startmin, startsec)
			else:
				newurl = "http://video.google.com/videoplay?docid=%s#t=%sh%sm%ss" % (vid, starthour, startmin, startsec)
		else:
			newurl = "http://video.google.com/videoplay?docid=%s" % vid
		return vid, newurl, stime