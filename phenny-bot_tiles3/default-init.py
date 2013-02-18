# -*- coding: utf-8 -*-

# copy this file to "default.py" and edit all entries

# host: irc server host name
#host = 'irc.freenode.net'
host = 'irc.example.net'

# channels: irc channel that tilebot will operate in
channels = ['#1dv8-dev']

# nick: irc nick of the tilebot
nick = 'tilebot-dev'

#  owner: administrator's nick of the tilebot
owner = 'test'

# password, serverpass: tilebot's nick registration password
# not registered, if not set
# password = 'test'
# serverpass = 'test'

admins = [owner]
enable = ['admin', 'reload', 'startup', 'tile', 'sb']
extra = []

# logfn: path to the log file
logfn = "/var/log/1dv8/tilebot.log"

# googleapikey:  Google API key
googleapikey = 'test.apps.googleusercontent.com'

# justintvkey:  Justin TV API key
justintvkey = 'test'

# ustreamapikey: Ustream API key
ustreamdevapikey = 'test'

# youtubedevapikey: YouTube Developer's API key
youtubedevapikey = 'test'

# hostport: 1dv8 web host and port
hostport = "1dv8.com:80"

# IMPORTANT!  do not modify next five lines
path_aliaslist = "/al"
path_command = "/cmd"
path_mode = "/mode"
path_sbbl = "/sbbl"
path_voice = "/ttsvoice"

# sb_url: url where Mac OS X speechbot is running
sb_url = "http://xxx.xxx.xxx.xxx:8000"

# ttsvoice_nick: default voice name for nick
ttsvoice_nick = "Alex"

# ttsvoice_default: default voice name for comment
ttsvoice_default = "Alex"

# google_safe_browsing_ignorelist: list of irc nicks excluded from Google Safe Browsing check
google_safe_browsing_ignorelist = ['bot_phenny', 'tilesbot1', 'bot_tiles1', 'bot_tiles2', 'bot_tiles3']

# IMPORTANT!  do not remove tilemode line below
tilemode = None
