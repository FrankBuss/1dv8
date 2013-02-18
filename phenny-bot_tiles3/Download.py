# Download.py

import urllib


class Download:

	def __init__(self):
		pass

	def fetch_content(self, url):
		sock = urllib.urlopen(url)
		html = sock.read()
		sock.close()
		return html