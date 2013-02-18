# Image.py


import VidType
from Download import Download



class Image(Download):

	def __init__(self):
		Download.__init__(self)
		self.h = {}


	def get_metadata(self, url):
		self.h['urltype'] = VidType.IMAGE
		self.h['url'] = url
		self.h['vid'] = None
		self.h['title'] = ''
		self.h['imgurl'] = ''
		self.h['stime'] = 0
		self.h['error'] = None
		return self.h