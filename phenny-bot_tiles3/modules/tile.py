#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
tilebot
"""

import httplib
import re
import socket
import sqlite3
import time
import unicodedata
import urllib
import urlparse

import VidError
import VidType

from Atom import Atom
from Bing import Bing
from BlipTV import BlipTV
from Current import Current
from Dailymotion import Dailymotion
from FunnyorDie import FunnyorDie
from FORAtv import FORAtv
from GoogleVideo import GoogleVideo
from GPlusHangout import GPlusHangout
#from Hulu import Hulu
from Image import Image
from JustinTV import JustinTV
from LiveLeak import LiveLeak
from Livestream import Livestream
from MITOpenCourseWare import MITOpenCourseWare
from Metacafe import Metacafe
from MySpace import MySpace
from Qik import Qik
from Revision3 import Revision3
from Revver import Revver
from MITTechTV import MITTechTV
from TEDVideo import TEDVideo
from TwitchTV import TwitchTV
from Viddler import Viddler
from Veoh import Veoh
from Vimeo import Vimeo
from Ustream import Ustream
from YouTube import YouTube


ccodeset = set(['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'in', 'io', 'iq', 'ir', 'is', 'it', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'st', 'sv', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'])

re_atom_url = re.compile("^(http\:\/\/)?(www\.)?atom\.com\/")
re_bing_url = re.compile("^(http\:\/\/)?(www\.)?bing\.com\/videos\/watch\/video\/")
re_bliptv_url = re.compile("^(http\:\/\/)?(www\.)?blip\.tv\/")
re_current_url = re.compile("^(http\:\/\/)?(www\.)?current\.com\/")
re_dailymotion_url = re.compile("^(http\:\/\/)?(www\.)?dailymotion\.com\/video\/")
re_foratv_url = re.compile("^(http\:\/\/)?(www\.)?fora\.tv\/")
re_funnyordie_url = re.compile("^(http\:\/\/)?(www\.)funnyordie\.com\/")
re_googlevideo_url = re.compile("^(http\:\/\/)?video\.google\.com\/videoplay\?docid\=")
re_gplushangout_url = re.compile("^(https\:\/\/)?plus\.google\.com\/(u\/0\/)?\d{21}/posts")
#re_hulu_url = re.compile("^(http\:\/\/)?(www\.)?hulu\.com\/watch\/")
re_justintv_url = re.compile("^(http\:\/\/)?(www\.)?justin\.tv\/")
re_liveleak_url = re.compile("^(http\:\/\/)?(www\.)?liveleak\.com\/view\?i\=")
re_livestream_url = re.compile("^(http\:\/\/)?(www\.)?livestream\.com\/")
re_metacafe_url = re.compile("^(http\:\/\/)?(www\.)metacafe\.com\/")
re_mitocw_url = re.compile("^(http\:\/\/)?ocw\.mit\.edu\/courses\/")
re_mittechtv_url = re.compile("^(http\:\/\/)?techtv\.mit\.edu\/videos\/")
re_myspace_url = re.compile("^(http\:\/\/)?(www\.)?myspace\.com\/")
re_qik_url = re.compile("^(http\:\/\/)?(www\.)?qik\.com\/")
re_revision3_url = re.compile("^(http\:\/\/)?(www\.)?revision3\.com\/")
re_revver_url = re.compile("^(http\:\/\/)?(www\.)?revver\.com\/")
re_ted_url = re.compile("^(http\:\/\/)?(www\.)?ted\.com\/talks\/")
re_twitchtv_url = re.compile("^(http\:\/\/)?(www\.)?twitch\.tv\/")
re_ustream_url = re.compile("^(http\:\/\/)?(www\.)?ustream\.tv\/")
re_veoh_url = re.compile("^(http\:\/\/)?(www\.)?veoh\.com\/watch\/")
re_viddler_url = re.compile("^(http\:\/\/)?(www\.)?viddler\.com\/")
re_vimeo_url = re.compile("^(http\:\/\/)?(www\.)?vimeo\.com\/\d+")
re_youtube_url = re.compile("^(https?\:\/\/)?(www\.)?youtube\.com\/watch\?")
re_youtube_restricted_url = re.compile("^(https?\:\/\/)?(www\.)?youtube\.com\/verify_age\?")

re_ccode = re.compile("^[a-z][a-z]$")
re_timeoffset = re.compile("^\-?\d+$")

h_ttsvoice = {'agnes': 'Agnes', 'alex':'Alex', 'bruce':'Bruce', 'fred':'Fred', 'junior':'Junior', 'kathy':'Kathy', 'princess':'Princess', 'ralph':'Ralph', 'trinoids':'Trinoids', 'vicky':'Vicky', 'victoria':'Victoria', 'zarvox':'Zarvox'}
h_ttsvoice_female = {'agnes': 'Agnes', 'kathy':'Kathy', 'princess':'Princess', 'vicky':'Vicky', 'victoria':'Victoria'}
h_ttsvoice_male = {'alex':'Alex', 'bruce':'Bruce', 'fred':'Fred', 'junior':'Junior', 'ralph':'Ralph'}
h_ttsvoice_robot = {'trinoids':'Trinoids', 'zarvox':'Zarvox'}


debug = None
f_disable_cmdsend = False


class SBBL:
	def __init__(self):
		self.h_sbbl = {}

	def add(self, nick):
		self.h_sbbl[nick] = 1

	def dump(self):
		for nick in sorted(self.h_sbbl.keys()):
			print nick

	def get_list(self):
		return self.h_sbbl.keys()

	def is_exists(self, nick):
		return self.h_sbbl.has_key(nick)

	def remove(self, nick):
		if self.h_sbbl.has_key(nick):
			del self.h_sbbl[nick]


class Voice:
	def __init__(self):
		self.h_voice = {}

	def clear(self, nick):
		if self.h_voice.has_key(nick.lower()):
			del self.h_voice[nick.lower()]

	def dump(self):
		for nick in sorted(self.h_voice.keys()):
			print "%s: %s" % (nick, self.h_voice[nick])

	def exists(self, nick):
		if self.h_voice.has_key(nick.lower()):
			return True
		return False

	def get(self, nick):
		if self.h_voice.has_key(nick.lower()):
			return self.h_voice[nick.lower()]
		return None

	#def get_list(self):
		#return self.h_sbbl.keys()

	def is_exists(self, nick):
		return self.h_voice.has_key(nick.lower())

	def set(self, nick, voice):
		self.h_voice[nick.lower()] = voice.lower()


class Debug:
	def __init__(self, phenny):
		self.phenny = phenny
		#global logfn
		self.logfn = phenny.config.logfn
		self.logfh = open(self.logfn, 'a', 0600)

	def add(self, func, s):
		timestr = self.now()
		print "%s: %s :: %s" % (timestr, func, s.encode('utf-8'))
		self.logfh.write("%s: %s :: %s\n" % (timestr, func, s.encode('utf-8')))
		self.logfh.flush()

	def now(self):
		return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


debug = None



def check_url(phenny, url):
	host = 'sb-ssl.google.com'
	client = '1dv8'
	apikey = phenny.config.googleapikey
	if len(apikey) == 0:
		return ''
	appver = '7'
	pver = '3.0'
	path = "/safebrowsing/api/lookup?client=%s&apikey=%s&appver=%s&pver=%s&url=%s" % (client, apikey, appver, pver, urllib.quote_plus(url))
	conn = httplib.HTTPSConnection(host)
	conn.request("GET", path)
	response = conn.getresponse()
	if response.status == '204' and response.reason == 'No Content':
		conn.close()
		return None
	data = response.read()
	conn.close()
	return data




def cmd_alias(phenny, input):
	global errormsg
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)
	if len(paramlist) == 1:
		phenny.say(".  invalid parameter")
		return

	aliascmd = paramlist[1]
	if aliascmd != 'clear' and aliascmd != 'dbinit' and aliascmd != 'list' and aliascmd != 'set' and aliascmd != 'setmeta':
		phenny.say(".  unknown alias command")
		return

	if aliascmd == 'clear':
		# .alias clear [alias]
		if not is_alias(phenny, paramlist[2]):
			phenny.say(".  invalid alias")
			return
		alias = paramlist[2].lower()
		sendcommand(phenny, {'cmd': 'alias_clear', 'alias': alias})

		if phenny.config.h_alias.has_key(alias):
			del phenny.config.h_alias[alias]
		return

	elif aliascmd == 'dbinit':
		sendcommand(phenny, {'cmd': 'alias_dbinit'})
		phenny.config.h_alias = {}
		return

	elif aliascmd == 'list':
		# .alias list
		phenny.say(".  List is too long.  Please use http://www.1dv8.com/aliaslist.txt instead.")
		return

	elif aliascmd == 'set':
		# .alias set [alias] [url]
		if len(paramlist) < 4:
			phenny.say(".  please specifiy alias and url")
			return
		try:
			if int(paramlist[2]) >= 1 and int(paramlist[2]) <= 9:
				phenny.say(".  numbers between 1 through 9 cannot be an alias")
				return
		except:
			pass
		if is_url(paramlist[3]):
			# hopefully second param is url
			# assume first param is alias
			alias = paramlist[2].lower()
			url = paramlist[3]

			try:
				url, mimetype = resolve_url(url)
			except:
				phenny.say(".  invalid parameter")
				return

			h = get_metadata(phenny, url, mimetype)

			if h == None:
				phenny.say(".  something has gone horribly wrong")
				return

			if h['error']:
				phenny.say(".  %s" % VidError.errormsg[h['error']])
				return

			sendcommand(phenny, {'cmd': 'alias_set', 'alias': alias, 'urltype': h['urltype'], 'url': h['url'], 'vid': h['vid'], 'title': h['title'].encode('utf-8'), 'imgurl': h['imgurl'], 'stime': h['stime']})
			phenny.config.h_alias[alias] = 1
			return
		else:
			phenny.say(".  please specify correct parameter")
			return

	elif aliascmd == 'setmeta':
		# .alias setmeta [alias] [metatype] [value]
		if len(paramlist) < 5:
			phenny.say(".  please specifiy alias and url")
			return
		if not is_alias(phenny, paramlist[2]):
			phenny.say(".  invalid alias")
			return
		alias = paramlist[2].lower()
		metatype = paramlist[3].lower()
		metavalue = paramlist[4].lower()
		if metatype != 'ccode' and metatype != 'param' and metatype != 'timeoffset':
			phenny.say(".  sorry, meta type must be either ccode or timeoffset")
			return
		if metatype == 'ccode':
			if metavalue != '--' and not metavalue in ccodeset:
				phenny.say(".  invalid ccode value")
				return
			sendcommand(phenny, {'cmd': 'alias_setmeta', 'alias': alias, 'metatype': 'ccode', 'ccode': metavalue })
			return
		elif metatype == 'param':
			sendcommand(phenny, {'cmd': 'alias_setmeta', 'alias': alias, 'metatype': 'param', 'param': metavalue })
			return
		elif metatype == 'timeoffset':
			if metavalue != '--' and not re_timeoffset.search(metavalue):
				phenny.say(".  invalid timeoffset value")
				return
			sendcommand(phenny, {'cmd': 'alias_setmeta', 'alias': alias, 'metatype': 'timeoffset', 'timeoffset': metavalue })
			return

def cmd_close(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  please specify tile or alias to close")
		return

	if len(paramlist) > 2:
		# more than one parameter is specified
		l = []
		for param in paramlist[1:]:
			if is_tileindex(phenny, param):
				l.append(int(param) - 1)
			elif is_alias(phenny, param):
				l.append(param)
		if len(l) == 0:
			phenny.say(".  please specify tile or alias to close")
			return
		if len(l) == 1:
			sendcommand(phenny, {'cmd': 'close', 'ti1': l[0]})
			return
		sendcommand(phenny, {'cmd': 'closelist', 'param': ",".join("%s" % (item) for item in l)})
		return

	if is_tileindex(phenny, paramlist[1]):
		sendcommand(phenny, {'cmd': 'close', 'ti1': int(paramlist[1]) - 1})
		return

	alias = paramlist[1].lower()
	if not is_alias(phenny, alias):
		phenny.say(".  invalid parameter")
		return

	sendcommand(phenny, {'cmd': 'closealias', 'alias': alias})



def cmd_dbinit(phenny, input):
	if input.sender[0] != '#':
		return
	sendcommand(phenny, {'cmd': 'dbinit'})


def cmd_info(phenny, input):
	# .info command can be issued via /msg
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		sendcommand(phenny, {'cmd': 'infoall'})
		return

	if is_tileindex(phenny, paramlist[1]):
		tileindex = int(paramlist[1])
		sendcommand(phenny, {'cmd': 'info', 'ti1': tileindex - 1})
		return


# for backward compatibility
# .list command has been deprecated and merged into .info command
def cmd_list(phenny, input):
	sendcommand(phenny, {'cmd': 'infoall'})


def cmd_mode(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  current mode is %s" % phenny.config.tilemode)
		return

	if not paramlist[1].isdigit():
		phenny.say(".  invalid parameter")
		return

	mode = int(paramlist[1])
	if mode != 1 and mode != 4 and mode != 6 and mode != 9:
		phenny.say(".  mode selection has to be either 1, 4, 6 or 9")
		return

	if phenny.config.tilemode == mode:
		phenny.say(".  already in mode %s" % mode)
		return

	sendcommand(phenny, {'cmd': 'mode', 'mode': mode})
	phenny.config.tilemode = mode


def cmd_move(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if phenny.config.tilemode == 1:
		return

	if len(paramlist) < 3:
		phenny.say(".  invalid parameter")
		return

	if not is_tileindex(phenny, paramlist[1]) or not is_tileindex(phenny, paramlist[2]):
		phenny.say(".  invalid tile number")
		return

	ti1 = int(paramlist[1])
	ti2 = int(paramlist[2])

	if ti1 == ti2:
		phenny.say(".  you're doing it wrong")
		return

	sendcommand(phenny, {'cmd': 'move', 'ti1': ti1 - 1, 'ti2': ti2 - 1})


def cmd_mute(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  please specify tile or alias to mute")
		return

	if len(paramlist) > 2:
		# more than one parameter is specified
		l = []
		for param in paramlist[1:]:
			if is_tileindex(phenny, param):
				l.append(int(param) - 1)
			elif is_alias(phenny, param):
				l.append(param)
		if len(l) == 0:
			phenny.say(".  please specify tile or alias to mute")
			return
		if len(l) == 1:
			sendcommand(phenny, {'cmd': 'mute', 'ti1': l[0]})
			return
		sendcommand(phenny, {'cmd': 'mutelist', 'param': ",".join("%s" % (item) for item in l)})
		return

	if is_tileindex(phenny, paramlist[1]):
		sendcommand(phenny, {'cmd': 'mute', 'ti1': int(paramlist[1]) - 1})
		return

	alias = paramlist[1].lower()
	if not is_alias(phenny, alias):
		phenny.say(".  invalid parameter")
		return

	sendcommand(phenny, {'cmd': 'mutealias', 'alias': alias})


def cmd_open(phenny, input):
	global errormsg
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  invalid parameter")
		return

	if len(paramlist) == 2:
		if is_alias(phenny, paramlist[1]):
			# .open alias
			alias = paramlist[1].lower()
			sendcommand(phenny, {'cmd': 'openalias', 'alias': alias})
			return
		elif is_url(paramlist[1]):
			# .open url
			url = paramlist[1]
			try:
				url, mimetype = resolve_url(url)
			except:
				phenny.say(".  invalid parameter")
				return

			h = get_metadata(phenny, url, mimetype)

			if h == None:
				phenny.say(".  something has gone horribly wrong (ERR1)")
				return

			if h['error']:
				phenny.say(".  %s" % VidError.errormsg[h['error']])
				return

			sendcommand(phenny, {'cmd': 'open', 'urltype': h['urltype'], 'url': h['url'], 'vid': h['vid'], 'title': h['title'].encode('utf-8'), 'imgurl': h['imgurl'], 'stime': h['stime']})
			return
		else:
			phenny.say(".  invalid parameter")
			return

	if is_tileindex(phenny, paramlist[1]) and is_alias(phenny, paramlist[2]):
		# .open tileindex alias
		tileindex = int(paramlist[1])
		alias = paramlist[2].lower()
		sendcommand(phenny, {'cmd': 'openalias', 'ti1': tileindex - 1, 'alias': alias})
		return
	elif is_tileindex(phenny, paramlist[1]) and is_url(paramlist[2]):
		# .open tileindex url
		tileindex = int(paramlist[1])
		url = paramlist[2]
		try:
			url, mimetype = resolve_url(url)
		except:
			phenny.say(".  invalid parameter")
			return

		h = get_metadata(phenny, url, mimetype)

		if h == None:
			phenny.say(".  something has gone horribly wrong (ERR2)")
			return

		if h['error']:
			phenny.say(".  %s" % VidError.errormsg[h['error']])
			return

		sendcommand(phenny, {'cmd': 'open', 'ti1': tileindex - 1, 'urltype': h['urltype'], 'url': h['url'], 'vid': h['vid'], 'title': h['title'].encode('utf-8'), 'imgurl': h['imgurl'], 'stime': h['stime']})
		return
	else:
		phenny.say(".  invalid parameter")
		return


def cmd_pause(phenny, input):
	pass

def cmd_play(phenny, input):
	pass


def cmd_purge(phenny, input):
	if input.sender[0] != '#':
		return
	sendcommand(phenny, {'cmd': 'purge'})


def cmd_querystat(phenny, input):
	if input.sender[0] == '#':
		return
	sendcommand(phenny, {'cmd': 'querystat'})


def cmd_refreshpage(phenny, input):
	if input.sender[0] != '#':
		return
	sendcommand(phenny, {'cmd': 'refreshpage'})


def cmd_replay(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  please specify tile or alias to replay")
		return

	if is_tileindex(phenny, paramlist[1]):
		tileindex = int(paramlist[1])
		sendcommand(phenny, {'cmd': 'replay', 'ti1': tileindex - 1})
		return
	alias = paramlist[1].lower()
	sendcommand(phenny, {'cmd': 'replayalias', 'alias': alias})


def cmd_sbbl(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	#print paramlist
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  speechbot blacklist: %s" % ' '.join(sorted(phenny.config.sbbl.get_list())))
		return

	sbblcmd = paramlist[1]
	if sbblcmd != 'add' and sbblcmd != 'dbinit' and sbblcmd != 'list' and sbblcmd != 'remove':
		phenny.say(".  unknown sbbl command.  options: add list remove")
		return

	if sbblcmd == 'add':
		nick = paramlist[2]
		sendcommand(phenny, {'cmd': 'sbbl_add', 'nick': nick})
		phenny.config.sbbl.add(nick)
		return

	elif sbblcmd == 'dbinit':
		if not phenny.nick in phenny.config.admin:
			return
		sendcommand(phenny, {'cmd': 'sbbl_dbinit'})
		phenny.config.sbbl = SBBL()
		return

	elif sbblcmd == 'list':
		phenny.say(".  speechbot blacklist: %s" % ' '.join(sorted(phenny.config.sbbl.get_list())))
		return

	elif sbblcmd == 'remove':
		nick = paramlist[2]
		sendcommand(phenny, {'cmd': 'sbbl_remove', 'nick': nick})
		phenny.config.sbbl.remove(nick)
		return


def cmd_speechbot(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  invalid parameter")
		return

	speechcmd = paramlist[1].lower()
	# off, on, reload, set, status
	if speechcmd != 'off' and speechcmd != 'on' and speechcmd != 'reload' and speechcmd != 'set' and speechcmd != 'status':
		phenny.say(".  unknown alias command")
		return

	if speechcmd == 'off':
		sendcommand(phenny, {'cmd': 'sb_off'})
		return

	elif speechcmd == 'on':
		sendcommand(phenny, {'cmd': 'sb_on'})
		return

	elif speechcmd == 'reload':
		sendcommand(phenny, {'cmd': 'sb_reload'})
		return

	elif speechcmd == 'set':
		if not is_alias(phenny, paramlist[2]):
			phenny.say(".  invalid alias")
			return
		alias = paramlist[2].lower()
		sendcommand(phenny, {'cmd': 'sb_set', 'alias': alias})
		return

	elif speechcmd == 'status':
		sendcommand(phenny, {'cmd': 'sb_status'})
		return


def cmd_swap(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if phenny.config.tilemode == 1:
		return

	if len(paramlist) < 3:
		phenny.say(".  please specify tiles to swap")
		return

	if not is_tileindex(phenny, paramlist[1]) or not is_tileindex(phenny, paramlist[2]):
		phenny.say(".  invalid tile number")
		return

	ti1 = int(paramlist[1])
	ti2 = int(paramlist[2])

	if ti1 == ti2:
		phenny.say(".  you're doing it wrong")
		return

	sendcommand(phenny, {'cmd': 'swap', 'ti1': ti1 - 1, 'ti2': ti2 - 1})


def cmd_sync(phenny, input):
	if input.sender[0] == '#':
		return
	# instead of syncing variables manually, just issue /NAMES and syncing will happen
	# in the handle_names_end handler
	sync_alias(phenny)
	sync_sbbl(phenny)
	sync_tilemode(phenny)
	sync_voice(phenny)

def cmd_unmute(phenny, input):
	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()
	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	if len(paramlist) == 1:
		phenny.say(".  please specify tile or alias to unmute")
		return

	if len(paramlist) > 2:
		# more than one parameter is specified
		l = []
		for param in paramlist[1:]:
			if is_tileindex(phenny, param):
				l.append(int(param) - 1)
			elif is_alias(phenny, param):
				l.append(param)
		if len(l) == 0:
			phenny.say(".  please specify tile or alias to unmute")
			return
		if len(l) == 1:
			sendcommand(phenny, {'cmd': 'unmute', 'ti1': l[0]})
			return
		sendcommand(phenny, {'cmd': 'unmutelist', 'param': ",".join("%s" % (item) for item in l)})
		return

	if is_tileindex(phenny, paramlist[1]):
		sendcommand(phenny, {'cmd': 'unmute', 'ti1': int(paramlist[1]) - 1})
		return

	alias = paramlist[1].lower()
	if not is_alias(phenny, alias):
		phenny.say(".  invalid parameter")
		return

	sendcommand(phenny, {'cmd': 'unmutealias', 'alias': alias})


def cmd_voice(phenny, input):
	global h_ttsvoice
	global h_ttsvoice_female
	global h_ttsvoice_male
	global h_ttsvoice_robot

	if input.sender[0] != '#':
		return
	paramlist = input.strip().split()

	if paramlist[-1] == '!ns':
		paramlist.pop(-1)

	nick = filter_nick(input.nick)

	if len(paramlist) == 1:
		v = phenny.config.voice.get(nick)
		if v ==  None:
			phenny.say(".  your voice is by default set to %s" % phenny.config.ttsvoice_default)
			return
		phenny.say(".  your voice is set to %s" % h_ttsvoice[v])
		return

	voicecmd = paramlist[1]
	if voicecmd != 'set' and voicecmd != 'clear' and voicecmd != 'list':
		phenny.say(".  unknown voice command.  options: set clear list")
		return

	# hidden admin only command handling
	if len(paramlist) == 4:
		# 0 - .voice
		# 1 - set|clear
		# 2 - nick
		# 3 - ttsvoice
		pass


	if voicecmd == 'clear':
		#nick_lower = nick.lower()
		if not phenny.config.voice.exists(nick):
			return
		sendcommand(phenny, {'cmd': 'voice_clear', 'nick': nick})
		phenny.config.voice.clear(nick)
		return

	#if voicecmd == 'dbinit':
		#if not nick in phenny.config.admin:
			#return
		#sendcommand(phenny, {'cmd': 'voice_dbinit'})
		#phenny.config.voice = Voice()
		#return

	if voicecmd == 'list':
		phenny.say(".  Female: %s" % ', '.join(sorted(h_ttsvoice_female.values())))
		phenny.say(".    Male: %s" % ', '.join(sorted(h_ttsvoice_male.values())))
		phenny.say(".   Robot: %s" % ', '.join(sorted(h_ttsvoice_robot.values())))
		return

	if voicecmd == 'set':
		voice = paramlist[2]
		if not h_ttsvoice.has_key(voice.lower()):
			phenny.say(".  invalid voice selection.")
			phenny.say(".  Female: %s" % ', '.join(sorted(h_ttsvoice_female.values())))
			phenny.say(".    Male: %s" % ', '.join(sorted(h_ttsvoice_male.values())))
			phenny.say(".   Robot: %s" % ', '.join(sorted(h_ttsvoice_robot.values())))
			return
		sendcommand(phenny, {'cmd': 'voice_set', 'nick': nick, 'voice': voice})
		phenny.config.voice.set(nick, voice)
		return









def filter_nick(s):
	s = s.lower()
	s = s.replace('|', '')
	while s[-1] == '_':
		s = s[:-1]
	return s


def follow_url(url):
	up = urlparse.urlparse(url)
	if up.scheme == 'http':
		conn = httplib.HTTPConnection(up.netloc)
	elif up.scheme == 'https':
		conn = httplib.HTTPSConnection(up.netloc)
	else:
		return None, None
	pqf = up.path
	if up.query != None and up.query != '':
		pqf += '?' + up.query
	if up.fragment != None and up.fragment != '':
		pqf += '#' + up.fragment
	conn.request("HEAD", pqf)
	response = conn.getresponse()
	conn.close()
	if int(response.status) == 301 or int(response.status) == 302:

		location = response.getheader('location', None)
		if location == None:
			location = response.getheader('Location', None)
			if location == None:
				return None, None, None
		lp = urlparse.urlparse(location)
		if lp.scheme == '' or lp.netloc == '':
			url = up.scheme + '://' + up.netloc
			if lp.path[0] == '/':
				url += lp.path
			else:
				slashpos = up.path.rfind('/')
				if slashpos < 0 or slashpos == 0:
					url += lp.path
				else:
					url += up.path[0:slashpos - 1]
					url += lp.path
			if lp.query != None and lp.query != '':
				url += '?' + lp.query
			if lp.fragment != None and lp.fragment != '':
				url += '#' + lp.fragment
			return response.status, url, response.getheader('content-type').lower()
		return response.status, location, response.getheader('content-type').lower()
	return int(response.status), url, response.getheader('content-type').lower()


def get_metadata(phenny, url, mimetype):
	if is_mimetype_image(mimetype):
		urltype = VidType.IMAGE
		obj = Image()
		return obj.get_metadata(url)
	urltype = get_urltype(url)
	if urltype == None:
		return None
	if urltype == VidType.ATOM:
		obj = Atom()
	elif urltype == VidType.BING:
		obj = Bing()
	elif urltype == VidType.BLIPTV:
		obj = BlipTV()
	elif urltype == VidType.CURRENT:
		obj = Current()
	elif urltype == VidType.DAILYMOTION:
		obj = Dailymotion()
	elif urltype == VidType.FORATV:
		obj = FORAtv()
	elif urltype == VidType.FUNNYORDIE:
		obj = FunnyorDie()
	elif urltype == VidType.GOOGLEVIDEO:
		obj = GoogleVideo()
	elif urltype == VidType.GPLUSHANGOUT:
		obj = GPlusHangout()
	#elif urltype == HULU:
		#obj = Hulu()
	elif urltype == VidType.JUSTINTV:
		obj = JustinTV(phenny)
	elif urltype == VidType.LIVELEAK:
		obj = LiveLeak()
	elif urltype == VidType.LIVESTREAM:
		obj = Livestream()
	elif urltype == VidType.METACAFE:
		obj = Metacafe()
	elif urltype == VidType.MITOCW:
		obj = MITOpenCourseWare()
	elif urltype == VidType.MITTECHTV:
		obj = MITTechTV()
	elif urltype == VidType.MYSPACE:
		obj = MySpace()
	elif urltype == VidType.QIK:
		obj = Qik()
	elif urltype == VidType.REVISION3:
		obj = Revision3()
	elif urltype == VidType.REVVER:
		obj = Revver()
	elif urltype == VidType.TED:
		obj = TEDVideo()
	elif urltype == VidType.TWITCHTV:
		obj = TwitchTV(phenny)
	elif urltype == VidType.USTREAM:
		obj = Ustream(phenny)
	elif urltype == VidType.VIDDLER:
		obj = Viddler()
	elif urltype == VidType.VEOH:
		obj = Veoh()
	elif urltype == VidType.VIMEO:
		obj = Vimeo()
	elif urltype == VidType.YOUTUBE:
		obj = YouTube(phenny)
	return obj.get_metadata(url)


def get_urllist(s):
	if s == None or s.strip() == '':
		return None
	h_url = {}
	for token in s.strip().split():
		if token[:7].lower() == 'http://' or token[:8].lower() == 'https://':
			h_url[token] = 1
	if len(h_url) == 0:
		return None
	return sorted(h_url.keys())


def get_urltype(url):
	if re_atom_url.search(url):
		return VidType.ATOM
	if re_bing_url.search(url):
		return VidType.BING
	if re_bliptv_url.search(url):
		return VidType.BLIPTV
	if re_current_url.search(url):
		return VidType.CURRENT
	if re_dailymotion_url.search(url):
		return VidType.DAILYMOTION
	if re_foratv_url.search(url):
		return VidType.FORATV
	if re_funnyordie_url.search(url):
		return VidType.FUNNYORDIE
	if re_googlevideo_url.search(url):
		return VidType.GOOGLEVIDEO
	if re_gplushangout_url.search(url):
		return VidType.GPLUSHANGOUT
	#if re_hulu_url.search(url):
		#return VidType.HULU
	if re_justintv_url.search(url):
		return VidType.JUSTINTV
	if re_liveleak_url.search(url):
		return VidType.LIVELEAK
	if re_livestream_url.search(url):
		return VidType.LIVESTREAM
	if re_mitocw_url.search(url):
		return VidType.MITOCW
	if re_mittechtv_url.search(url):
		return VidType.MITTECHTV
	if re_metacafe_url.search(url):
		return VidType.METACAFE
	if re_myspace_url.search(url):
		return VidType.MYSPACE
	if re_qik_url.search(url):
		return VidType.QIK
	if re_revision3_url.search(url):
		return VidType.REVISION3
	if re_revver_url.search(url):
		return VidType.REVVER
	if re_ted_url.search(url):
		return VidType.TED
	if re_twitchtv_url.search(url):
		return VidType.TWITCHTV
	if re_ustream_url.search(url):
		return VidType.USTREAM
	if re_veoh_url.search(url):
		return VidType.VEOH
	if re_viddler_url.search(url):
		return VidType.VIDDLER
	if re_vimeo_url.search(url):
		return VidType.VIMEO
	if re_youtube_url.search(url) or re_youtube_restricted_url.search(url):
		return VidType.YOUTUBE
	return None


def handle_comment(phenny, input):
	if input.nick in phenny.config.google_safe_browsing_ignorelist:
		return
	s = input.strip()
	urllist = get_urllist(s)
	if urllist:
		try:
			r = is_malicious(phenny, urllist)
		except:
			return
		if r:
			for url in r.keys():
				if r[url] == 'phishing':
					phenny.say(".  DANGER!!!  DO NOT CLICK!  %s is a phishing site" % url)
				elif r[url] == 'malware':
					phenny.say(".  DANGER!!!  DO NOT CLICK!  %s has malware" % url)
				elif r[url] == 'phishing,malware':
					phenny.say(".  DANGER!!!  DO NOT CLICK!  %s is a phishing site with malware" % url)


def handle_names_end(phenny, input):
	sync_alias(phenny)
	sync_sbbl(phenny)
	sync_tilemode(phenny)
	sync_voice(phenny)


def is_alias(phenny, s):
	return phenny.config.h_alias.has_key(s.lower())


def is_malicious(phenny, urllist):
	result = {}
	for url in urllist:
		u = urlparse.urlparse(url)
		if u.netloc == 'youtube.com' or u.netloc == 'www.youtube.com' or u.netloc == 'ustream.tv' or u.netloc == 'www.ustream.tv':
			continue
		r = check_url(phenny, url)
		if r:
			result[url] = r
	if len(result) == 0:
		return None
	return result


def is_mimetype_image(mimetype):
	if mimetype in ('image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/x-windows-bmp'):
		return True
	return False


def is_tileindex(phenny, s):
	if not s.isdigit():
		return False
	if int(s) >= 1 and int(s) <= phenny.config.tilemode:
		return True
	return False


def is_url(s):
	if s[0:7] == 'http://' or s[0:8] == 'https://':
		return True
	# DEBUG: need more code in case user forgets to enter http://
	return False


def is_youtube_url(s):
	if re_youtube_url.search(s) or re_youtube_short_url.search(s):
		return True
	return False


def normalize(text):
	return unicodedata.normalize('NFKD', u"%s" % text).encode('ascii', 'ignore')


def resolve_url(url):
	count = 1
	while True:
		status, url, mimetype = follow_url(url)
		#print "resolv_url() :: status = %s, url = %s, mimetype = %s" % (status, url, mimetype);
		if status == None and url == None:
			raise Exception('InvalidURL')
		if status == 301 or status == 302:
			count += 1
			if count > 5:
				raise Exception('TooManyRedirects')
			continue
		return url, mimetype


def retrieve_aliaslist(phenny):
	conn = httplib.HTTPConnection(phenny.config.hostport)
	conn.request("GET", phenny.config.path_aliaslist)
	response = conn.getresponse()
	data = response.read()
	conn.close()
	return data.strip().split()


def retrieve_mode(phenny):
	conn = httplib.HTTPConnection(phenny.config.hostport)
	conn.request("GET", phenny.config.path_mode)
	response = conn.getresponse()
	data = response.read()
	conn.close()
	return data.strip()


def retrieve_sbbl(phenny):
	conn = httplib.HTTPConnection(phenny.config.hostport)
	conn.request("GET", phenny.config.path_sbbl)
	response = conn.getresponse()
	data = response.read()
	conn.close()
	return data.strip().split()


def retrieve_voice(phenny):
	conn = httplib.HTTPConnection(phenny.config.hostport)
	conn.request("GET", phenny.config.path_voice)
	response = conn.getresponse()
	data = response.read()
	conn.close()
	h = {}
	for l in data.strip().split("\n"):
		if l == '':
			continue
		nick, voice = l.split(" ")
		h[nick] = voice
	return h


def sendcommand(phenny, paramhash = {}):
	global f_disable_cmdsend
	if f_disable_cmdsend == True:
		return
	paramstring = urllib.urlencode(paramhash)
	headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
	conn = httplib.HTTPConnection(phenny.config.hostport)
	conn.request("POST", phenny.config.path_command, paramstring, headers)
	response = conn.getresponse()
	if int(response.status) != 200:
		conn.close()
		phenny.say(".  Status: %s, Reason: %s" % (response.status, response.reason))
		return
	data = response.read()
	conn.close()
	if data:
		for line in data.strip().split("\n"):
			phenny.say(".  %s" % line)

def sync_alias(phenny):
	h_alias = {}
	for alias in retrieve_aliaslist(phenny):
		h_alias[alias] = 1
	phenny.config.h_alias = h_alias

def sync_sbbl(phenny):
	sbbl = SBBL()
	for nick in retrieve_sbbl(phenny):
		sbbl.add(nick)
	phenny.config.sbbl = sbbl


def sync_tilemode(phenny):
	phenny.config.tilemode = int(retrieve_mode(phenny))


def sync_voice(phenny):
	voice = Voice()
	h = retrieve_voice(phenny)
	for nick in h.keys():
		voice.set(nick, h[nick])
	phenny.config.voice = voice


# specific command handlers

cmd_alias.commands = ['alias', 'a']
cmd_alias.priority = 'low'
cmd_alias.example = '.alias'
cmd_alias.thread = False

cmd_close.commands = ['close', 'c']
cmd_close.priority = 'low'
cmd_close.example = '.close 1'
cmd_close.thread = False

cmd_dbinit.commands = ['dbinit']
cmd_dbinit.priority = 'low'
cmd_dbinit.example = '.dbinit'
cmd_dbinit.thread = False

cmd_info.commands = ['info', 'i']
cmd_info.priority = 'low'
cmd_info.example = '.info 5'
cmd_info.thread = False

cmd_list.commands = ['list']
cmd_list.priority = 'low'
cmd_list.example = '.list'
cmd_list.thread = False

cmd_mode.commands = ['mode', 'mo']
cmd_mode.priority = 'low'
cmd_mode.example = '.mode 6'
cmd_mode.thread = False

cmd_move.commands = ['move', 'm']
cmd_move.priority = 'low'
cmd_move.example = '.move 1 2'
cmd_move.thread = False

cmd_mute.commands = ['mute']
cmd_mute.priority = 'low'
cmd_mute.example = '.mute 1'
cmd_mute.thread = False

cmd_open.commands = ['open', 'o']
cmd_open.priority = 'low'
cmd_open.example = '.open 1 thepackrat'
cmd_open.thread = False

cmd_purge.commands = ['purge']
cmd_purge.priority = 'low'
cmd_purge.example = '.purge'
cmd_purge.thread = False

cmd_querystat.commands = ['querystat']
cmd_querystat.priority = 'low'
cmd_querystat.example = '.querystat'
cmd_querystat.thread = False

cmd_refreshpage.commands = ['refreshpage']
cmd_refreshpage.priority = 'low'
cmd_refreshpage.example = '.refreshpage'
cmd_refreshpage.thread = False

cmd_replay.commands = ['replay']
cmd_replay.priority = 'low'
cmd_replay.example = '.replay 1'
cmd_replay.thread = False


cmd_speechbot.commands = ['sb']
cmd_speechbot.priority = 'low'
cmd_speechbot.example = '.speech on'
cmd_speechbot.thread = False

cmd_sbbl.commands = ['sbbl']
cmd_sbbl.priority = 'low'
cmd_sbbl.example = '.sbbl'
cmd_sbbl.thread = False

cmd_swap.commands = ['swap', 's']
cmd_swap.priority = 'low'
cmd_swap.example = '.swap 1 2'
cmd_swap.thread = False

cmd_sync.commands = ['sync']
cmd_sync.priority = 'low'
cmd_sync.example = '.sync'
cmd_sync.thread = False

cmd_unmute.commands = ['unmute']
cmd_unmute.priority = 'low'
cmd_unmute.example = '.unmute 1'
cmd_unmute.thread = False

cmd_voice.commands = ['voice', 'v']
cmd_voice.priority = 'low'
cmd_voice.example = '.voice'
cmd_voice.thread = False




# event handlers

handle_comment.rule = r'.'
handle_comment.priority = 'high'
handle_comment.thread = True

handle_names_end.rule = r'(.*)'
handle_names_end.priority = 'low'
handle_names_end.event = '366'
handle_names_end.thread = False


if __name__ == '__main__':
	print __doc__.strip()
