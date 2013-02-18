/*
socket.io server part of 1dv8

Following changes are necessary to get this working:

1.  Line 17: port -> port of the socket.io server

1.  Line 18: dbfn -> path to sqlite3 database that holds backend database

2.  Line 19: ircbotip -> IP address the machine running the tilebot

3.  line 20: aliaslistfn -> path to output text file which should be within web server document root.
				This generated file served up as http://1dv8.com/aliaslist.txt
*/

var config = {
	port: 8001,
	dbfn: 'gs.db',
	ircbotip: '10.0.0.5',
	aliaslistfn: 'aliaslist.txt'
};


var fs = require('fs');


var http = require('http').createServer(handle_http_request);
var io = require('socket.io').listen(http);

io.configure('prod', function(){
	io.enable('browser client etag');
	io.set('log level', 1);
	io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
});

io.configure('dev', function(){
  io.set('transports', ['websocket']);
});

String.prototype.times = function(n) {
	return Array.prototype.join.call({length:n+1}, this);
};


var path = require('path');
var querystring = require('querystring');
var sqlite3 = require('sqlite3').verbose();
var url = require('url');

var db;

var ccodearray = ['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'in', 'io', 'iq', 'ir', 'is', 'it', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'st', 'sv', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw'];

var _CMD = {};
_CMD['NULL'] = 0;
_CMD['CLOSE'] = 100;
_CMD['MODE'] = 900;
_CMD['MOVE'] = 1000;
_CMD['MUTE'] = 1100;
_CMD['OPEN'] = 1200;
_CMD['PAUSE'] = 1300;
_CMD['PLAY'] = 1400;
_CMD['QUERYSTAT'] = 1450;
_CMD['REFRESHPAGE'] = 9999;
_CMD['REPLAY'] = 1500;
_CMD['SBOFF'] = 1600;
_CMD['SBON'] = 1700;
_CMD['SBOPEN'] = 1800;
_CMD['SBRELOAD'] = 1900;
_CMD['SETMETA'] = 2000;
_CMD['SWAP'] = 2100;
_CMD['UNMUTE'] = 2200;

var CIDSEED = 0;
var CIDOFFSET = 133683284623;
;
var client_count = 0;

// db table mirrors
var t_alias = {};
var t_sbbl = {};
var t_tilemode = {};
var t_tilestate = {};
var t_ttsvoice = {};

var f_alias = false;
var f_sbbl = false;
var f_tilemode = false;
var f_tilestate = false;
var f_ttsvoice = false;


var lastcid = 0;
var lastid = 0;
// var maxid = 0;

// stat about connected users
var t_stat = {};





function db_create() {
	db = new sqlite3.Database(config.dbfn);
	db.serialize(function() {
		db.run("CREATE TABLE alias (alias VARCHAR(255) PRIMARY KEY ASC, urltype INTEGER, url TEXT, vid TEXT, title TEXT, imgurl TEXT, stime INTEGER, param TEXT, ccode TEXT, timeoffset INTEGER)");
		db.run("CREATE TABLE sbbl (nick VARCHAR(255) PRIMARY KEY ASC)");
		db.run("CREATE TABLE tilemode (k VARCHAR(255) PRIMARY KEY ASC, v VARCHAR(255))");
		db.run("CREATE TABLE tilestate (ti INTEGER PRIMARY KEY ASC, state INTEGER, cid INTEGER, alias VARCHAR(255), urltype INTEGER, url TEXT, vid TEXT, title TEXT, imgurl TEXT, stime INTEGER, param TEXT, ccode TEXT, timeoffset INTEGER, vol VARCHAR(255))");
		db.run("CREATE TABLE ttsvoice (nick VARCHAR(255) PRIMARY KEY ASC, voice VARCHAR(255))");
		db.run("INSERT INTO tilemode VALUES ('mode', '6')");
		db.run("INSERT INTO tilemode VALUES ('sbalias', NULL)");
		db.run("INSERT INTO tilemode VALUES ('sbstate', '0')");
		var stmt = db.prepare("INSERT INTO tilestate VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)");
		for (var i = 0; i < 9; i++) {
			stmt.run(i);
		}
		stmt.finalize();
	});
}

function db_load() {
	console.log('db_load()')
	if (db == undefined)
		db = new sqlite3.Database(config.dbfn);

	db.serialize(function() {
		db.all("SELECT alias, urltype, url, vid, title, imgurl, stime, param, ccode, timeoffset FROM alias", function(err, rows) {
			for (var i = 0; i < rows.length; i++) {
				t_alias[rows[i].alias] = {
					alias: rows[i].alias,
					urltype: rows[i].urltype,
					url: rows[i].url,
					vid: rows[i].vid ? rows[i].vid : undefined,
					title: rows[i].title ? rows[i].title : undefined,
					imgurl: rows[i].imgurl ? rows[i].imgurl : undefined,
					stime: rows[i].stime ? rows[i].stime : 0,
					param: rows[i].param ? rows[i].param : undefined,
					ccode: rows[i].ccode ? rows[i].ccode : undefined,
					timeoffset: rows[i].timeoffset ? rows[i].timeoffset : undefined };
			}
			dump(t_alias);
			f_alias = true;
			write_aliaslist();
		});

		db.all("SELECT nick FROM sbbl", function(err, rows) {
			for (var i = 0; i < rows.length; i++) {
				t_sbbl[rows[i].nick] = true;
			}
			f_sbbl = true;
		});

		db.all("SELECT k, v FROM tilemode", function(err, rows) {
			for (var i = 0; i < rows.length; i++) {
				t_tilemode[rows[i].k] = rows[i].v;
			}
			f_tilemode = true;
		});

		db.all("SELECT ti, state, cid, alias, urltype, url, vid, title, imgurl, stime, param, ccode, timeoffset, vol FROM tilestate", function(err, rows) {
			for (var i = 0; i < rows.length; i++) {
				t_tilestate[rows[i].ti] = {
					ti: rows[i].ti,
					state: rows[i].state ? rows[i].state : undefined,
					cid: rows[i].cid ? rows[i].cid : undefined,
					alias: rows[i].alias ? rows[i].alias : undefined,
					urltype: rows[i].urltype ? rows[i].urltype : undefined,
					url: rows[i].url ? rows[i].url : undefined,
					vid: rows[i].vid ? rows[i].vid : undefined,
					title: rows[i].title ? rows[i].title : undefined,
					imgurl: rows[i].imgurl ? rows[i].imgurl : undefined,
					stime: rows[i].stime ? rows[i].stime : undefined,
					param: rows[i].param ? rows[i].param : undefined,
					ccode: rows[i].ccode ? rows[i].ccode : undefined,
					timeoffset: rows[i].timeoffset ? rows[i].timeoffset : undefined,
					vol: rows[i].vol ? rows[i].vol : undefined};
			}
			f_tilestate = true;
		});

		db.all("SELECT nick, voice FROM ttsvoice", function(err, rows) {
			for (var i = 0; i < rows.length; i++) {
				t_ttsvoice[rows[i].nick] = rows[i].voice;
			}
			f_ttsvoice = true;
		});

		console.log('db_load() :: inside serialize :: f_alias = ' + f_alias);
		console.log('db_load() :: inside serialize :: f_sbbl = ' + f_sbbl);
		console.log('db_load() :: inside serialize :: f_tilemode = ' + f_tilemode);
		console.log('db_load() :: inside serialize :: f_tilestate = ' + f_tilestate);
		console.log('db_load() :: inside serialize :: f_ttsvoice = ' + f_ttsvoice);
	});
	console.log('db_load() :: outside serialize :: f_alias = ' + f_alias);
	console.log('db_load() :: outside serialize :: f_sbbl = ' + f_sbbl);
	console.log('db_load() :: outside serialize :: f_tilemode = ' + f_tilemode);
	console.log('db_load() :: outside serialize :: f_tilestate = ' + f_tilestate);
	console.log('db_load() :: outside serialize :: f_ttsvoice = ' + f_ttsvoice);
}

if (!path.existsSync(config.dbfn)) {
	// db file doesn't exist.
	console.log(':: creating ' + config.dbfn);
	db_create();
}
db_load();


function is_datareadcomplete() {
	return (f_alias && f_sbbl && f_tilemode && f_tilestate && f_ttsvoice);
}

if (!is_datareadcomplete()) {
	console.log('data read is not complete');
}

console.log(':: f_alias = ' + f_alias);
console.log(':: f_sbbl = ' + f_sbbl);
console.log(':: f_tilemode = ' + f_tilemode);
console.log(':: f_tilestate = ' + f_tilestate);
console.log(':: f_ttsvoice = ' + f_ttsvoice);



console.log(':: client_count = ' + client_count);

if (!is_datareadcomplete) {
	console.log('data read is not complete');
}




var ws = io.sockets.on('connection', function(socket) {
	socket.on('pull', function(msg) {
		console.log(':: pull request');
		if (is_datareadcomplete()) {
			console.log(':: pull request :: msg[cid] = ' + msg['cid']);
			console.log(':: pull request :: lastcid = ' + lastcid);
			if (msg['cid'] == 0) {
				socket_pull_tilestate(socket);
			} else if (msg['cid'] != lastcid) {
				console.log(':: pull request :: msg[cid] != lastcid');
				var cmd = {
					id: 0,
					cid: 0,
					type: _CMD['REFRESHPAGE']
				};
				socket.emit('cmd', [cmd]);
			}
		} else {
			console.log(':: data is not ready.  replying to pull request with notready message.')
			socket.emit('notready', 1000);
		}
	});

	socket.on('stat', function(msg) {
		t_stat[socket.handshake.address.address] = {
			'w': msg['w'],
			'h': msg['h'],
			'vv': msg['vv'],
			'ua': msg['ua']
		};
		console.log(':: ip = ' + socket.handshake.address.address + ', h = ' + msg['h'] + ', w = ' + msg['w'] + ', vv = ' + msg['vv'] + ', ua = ' + msg['ua']);
	});

	client_count += 1;
	console.log(':: connection event :: client_count = ' + client_count);
	socket.emit('cc', client_count);
	socket.broadcast.emit('cc', client_count);
	console.log(':: connection event :: broadcasting cc');

	socket.on('message', function(msg) {
		socket.emit('message', msg);
	});

	socket.on('disconnect', function() {
		client_count -= 1;
		console.log(':: disconnect event :: client_count = ' + client_count);
		if (client_count > 0) {
			socket.emit('cc', client_count);
			socket.broadcast.emit('cc', client_count);
			console.log(':: disconnect event :: broadcasting cc');
		}
	});

});

var intid = setInterval(function() {
	if (is_datareadcomplete()) {
		clearInterval(intid);
		http.listen(config.port);
		console.log(':: listening to port ' + config.port);
	} else {
		console.log(':: data is not ready.  delaying http listening.')
	}
}, 500);



function socket_pull_tilestate(socket) {
	console.log('socket_pull_tilestate()')
	// TODO: investigate potential concurrency issue with data loading and socket reconnect response
	var l = [];
	var cmd;
	if (t_tilemode['sbstate'] == '1' && t_tilemode['sbalias'] in t_alias) {
		cmd = { id: 0, cid: 0, type: _CMD['SBOPEN'], alias: t_tilemode['sbalias'], urltype: t_alias[t_tilemode['sbalias']]['urltype'], url: t_alias[t_tilemode['sbalias']]['url'], vid: t_alias[t_tilemode['sbalias']]['vid'] };
		if (t_alias[t_tilemode['sbalias']]['param'] != undefined)
			cmd['param'] = t_alias[t_tilemode['sbalias']]['param'];
		l.push(cmd);
	}
	cmd = { id: 0, cid: 0, type: _CMD['MODE'], mode: parseInt(t_tilemode['mode']) };
	l.push(cmd);
	for (var i = 0; i < parseInt(t_tilemode['mode']); i++) {
		console.log('socket_pull_tilestate() :: t_tilestate[' + i + '][ti] = ' + t_tilestate[i]['ti'] );
		if (t_tilestate[i]['urltype'] == undefined)
			continue;
		console.log('socket_pull_tilestate() :: t_tilestate[' + i + '][urltype] = ' + t_tilestate[i]['urltype'] );
		var cmd = {
			id: 0,
			cid: t_tilestate[i]['cid'],
			type: _CMD['OPEN'],
			ti1: t_tilestate[i]['ti'],
			urltype: t_tilestate[i]['urltype'],
			url: t_tilestate[i]['url'],
			vid: t_tilestate[i]['vid'] };
		cmd['alias'] = (t_tilestate[i]['alias'] != undefined) ? t_tilestate[i]['alias'] : '';
		cmd['title'] = (t_tilestate[i]['title'] != undefined) ? t_tilestate[i]['title'] : '';
		cmd['imgurl'] = (t_tilestate[i]['imgurl'] != undefined) ? t_tilestate[i]['imgurl'] : '';
		cmd['stime'] = (t_tilestate[i]['stime'] != undefined) ? t_tilestate[i]['stime'] : 0;
		cmd['param'] = (t_tilestate[i]['param'] != undefined) ? t_tilestate[i]['param'] : '';
		cmd['ccode'] = (t_tilestate[i]['ccode'] != undefined) ? t_tilestate[i]['ccode'] : '';
		cmd['timeoffset'] = (t_tilestate[i]['timeoffset'] != undefined) ? t_tilestate[i]['timeoffset'] : -1440;
		cmd['vol'] = (t_tilestate[i]['vol'] != undefined) ? t_tilestate[i]['vol'] : '';
		l.push(cmd);
	}
	if (lastcid == 0) {
		cmd = { id: 0, cid: generate_cid(), type: 0 };
	} else {
		cmd = { id: 0, cid: lastcid, type: 0 };
	}
	l.push(cmd);
	socket.emit('cmd', l);
}


function socket_broadcast_command(cmd) {
	ws.emit('cmd', [cmd]);
}



function handle_http_request(req, res) {
	console.log('handle_http_request() :: req.connection.remoteAddress = ' + req.connection.remoteAddress);
	console.log('handle_http_request() :: req.method = ' + req.method);
	console.log('handle_http_request() :: req.url = ' + req.url);
	console.log('handle_http_request() :: config.ircbotip = ' + config.ircbotip);
	var body = '';
	req.on('data', function(chunk) {
		console.log('handle_http_request() :: chunk = ' + chunk.toString());
		body += chunk.toString();
	});
	req.on('end', function() {
		qs = querystring.parse(body);
		switch (url.parse(req.url, true).pathname) {
			case '/al':
				handle_al(res);
				break;
			case '/cmd':
				if (req.method != 'POST') {
					console.log('handle_http_request() :: 405 :: Method Not Allowed');
					res.writeHead(405, 'Method Not Allowed', {'Content-Type': 'text/html'});
					res.end('<html><head><title>405 - Method Not Allowed</title></head><body><h1>Method Not Allowed.</h1></body></html>');
					return;
				}
				handle_cmd(req, res, qs);
				break;
			case '/favicon.ico':
				console.log('handle_http_request() :: 404 :: Not Found');
				res.writeHead(404, 'Not Found', {'Content-Type': 'text/plain'});
				res.end('');
				break;
			case '/mode':
				handle_mode(res);
				break;
			case '/sbbl':
				handle_sbbl(res);
				break;
			case '/stat':
				handle_stat(res);
				break;
			case '/ttsvoice':
				handle_ttsvoice(res);
				break;
		};
	});
}


function handle_cmd(req, res, qs) {
	console.log('handle_cmd() :: qs = ' + qs);
	console.log('handle_cmd() :: qs.cmd = ' + qs.cmd);
	switch (qs.cmd) {
		case 'alias_clear':
			handle_cmd_alias_clear(res, qs.alias);
			break;
		case 'alias_set':
			handle_cmd_alias_set(res, qs);
			break;
		case 'alias_setmeta':
			handle_cmd_alias_setmeta(res, qs);
			break;
		case 'close':
			handle_cmd_close(res, qs.ti1);
			break;
		case 'closealias':
			handle_cmd_closealias(res, qs.alias);
			break;
		case 'closelist':
			handle_cmd_closelist(res, qs);
			break;
		case 'info':
			handle_cmd_info(res, qs.ti1);
			break;
		case 'infoall':
			handle_cmd_infoall(res);
			break;
		case 'mode':
			handle_cmd_mode(res, qs.mode);
			break;
		case 'move':
			handle_cmd_move(res, qs.ti1, qs.ti2);
			break;
		case 'mute':
			handle_cmd_mute(res, qs.ti1);
			break;
		case 'mutealias':
			handle_cmd_mutealias(res, qs.alias);
			break;
		case 'mutelist':
			handle_cmd_mutelist(res, qs);
			break;
		case 'open':
			handle_cmd_open(res, qs);
			break;
		case 'openalias':
			handle_cmd_openalias(res, qs);
			break;
		case 'querystat':
			handle_cmd_querystat(res);
			break;
		case 'refreshpage':
			handle_cmd_refreshpage(res);
			break;
		case 'replay':
			handle_cmd_replay(res, qs.ti1);
			break;
		case 'replayalias':
			handle_cmd_replayalias(res, qs.alias);
			break;
		case 'sb_off':
			handle_cmd_sb_off(res);
			break;
		case 'sb_on':
			handle_cmd_sb_on(res);
			break;
		case 'sb_reload':
			handle_cmd_sb_reload(res);
			break;
		case 'sb_set':
			handle_cmd_sb_set(res, qs.alias);
			break;
		case 'sb_status':
			handle_cmd_sb_status(res);
			break;
		case 'sbbl_add':
			handle_cmd_sbbl_add(res, qs.nick);
			break;
		case 'sbbl_list':
			handle_cmd_sbbl_list(res);
			break;
		case 'sbbl_remove':
			handle_cmd_sbbl_remove(res, qs.nick);
			break;
		case 'swap':
			handle_cmd_swap(res, qs.ti1, qs.ti2);
			break;
		case 'unmute':
			handle_cmd_unmute(res, qs.ti1);
			break;
		case 'unmutealias':
			handle_cmd_unmutealias(res, qs.alias);
			break;
		case 'unmutelist':
			handle_cmd_unmutelist(res, qs);
			break;
		case 'voice_clear':
			handle_cmd_voice_clear(res, qs.nick);
			break;
		case 'voice_set':
			handle_cmd_voice_set(res, qs.nick, qs.voice);
			break;
		case 'debug_dump':
			handle_debug_dump(res);
			break;
	}
}




function generate_cid() {
	var d = new Date();
	return (Math.floor((d.valueOf() - (CIDOFFSET * 10)) / 10) * 100) + (CIDSEED++ % 100);
}

function isdigit(s) {
        return !isNaN(parseInt(s));
}

function isnotdigit(s) {
        return isNaN(parseInt(s));
}

function resout(res, param) {
	if (param == undefined) {
		res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
		res.end();
		return;
	}
	if (typeof(param) == 'string') {
		res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
		res.end(param + '\n');
		return;
	}
	else if (typeof(param) == 'object') {
		if (param.length == 0) {
			res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
			res.end();
			return;
		}
		res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
		for (var i = 0; i < param.length - 1; i++) {
			res.write(param[i] + '\n');
		}
		res.end(param[param.length - 1] + '\n');
		return;
	}
}

function get_avail_ti() {
	for (var i = 0; i < t_tilemode['mode']; i++) {
		if (t_tilestate[i]['urltype'] == undefined)
			return i;
	}
	return undefined;
}

function get_ti_byalias(alias) {
	for (var i = 0; i < 9; i++) {
		if (t_tilestate[i]['alias'] == alias)
			return i;
	}
	return undefined;
}

function is_tile_exist(ti) {
	return (t_tilestate[ti]['urltype'] != undefined);
}

function is_url_open(url) {
	for (var i = 0; i < 9; i++)
		if (t_tilestate[i]['url'] == url)
			return true;
	return false;
}







function handle_cmd_alias_clear(res, alias) {
	console.log('handle_cmd_alias_clear() :: alias = ' + alias);
	if (!(alias in t_alias)) {
		resout(res, 'invalid parameter (alias)');
		return;
	}
	resout(res);
	delete t_alias[alias];
	db.run("DELETE FROM alias WHERE alias = ?", alias);
	write_aliaslist();

	if (t_tilemode['sbalias'] == alias) {
		// if the alias being cleared is already assigned to speechbot do the following:
		// 1.  reset speechbot alias setting
		// 2.  turn off speechbot
		db.run("UPDATE tilemode SET v = ? WHERE k = ?", undefined, 'sbalias');
		t_tilemode['sbalias'] = undefined;
		handle_cmd_sb_off();
	}
}

function handle_cmd_alias_set(res, qs) {
	console.log('handle_cmd_alias_set() :: qs = ' + qs);
	if (qs.urltype == undefined || qs.urltype == '' || qs.urltype <= 0) {
		resout(res, 'invalid parameter (urltype)');
		return;
	}
	if (qs.url == undefined || qs.url == '') {
		resout(res, 'invalid parameter (url)');
		return;
	}
	resout(res);
	if (qs.alias in t_alias) {
		db.run("UPDATE alias SET urltype = ?, url = ?, vid = ?, title = ?, imgurl = ?, stime = ?, param = ?, ccode = ?, timeoffset = ? WHERE alias = ?",
			qs.urltype, qs.url, qs.vid, qs.title, qs.imgurl, qs.stime, qs.param, qs.ccode, qs.timeoffset, qs.alias);
	} else {
		db.run("INSERT INTO alias VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			qs.alias, qs.urltype, qs.url, qs.vid, qs.title, qs.imgurl, qs.stime, qs.param, qs.ccode, qs.timeoffset);
	}
	t_alias[qs.alias] = {
		urltype: qs.urltype,
		url: qs.url,
		vid: qs.vid,
		title: qs.title,
		imgurl: qs.imgurl,
		stime: qs.stime,
		param: qs.param,
		ccode: qs.ccode,
		timeoffset: qs.timeoffset };
	write_aliaslist();
}

function handle_cmd_alias_setmeta(res, qs) {
	console.log('handle_cmd_alias_setmeta() :: qs = ' + qs);
	if (!(qs.alias in t_alias)) {
		resout(res, 'invalid parameter (alias)');
		return;
	}
	if (qs.metatype != 'ccode' && qs.metatype != 'param' && qs.metatype != 'timeoffset') {
		resout(res, 'invalid parameter');
		return;
	}
	resout(res);
	switch (qs.metatype) {
		case 'ccode':
			if (!(qs.ccode in ccodearray)) {
				resout(res, 'invalid country code');
				return;
			}
			if (qs.ccode == '--') {
				db.run("UPDATE alias SET ccode = ? WHERE alias = ?", undefined, qs.alias);
				t_alias[qs.alias]['ccode'] = undefined;
			} else {
				db.run("UPDATE alias SET ccode = ? WHERE alias = ?", qs.ccode, qs.alias);
				t_alias[qs.alias]['ccode'] = qs.ccode;
			}
			break;
		case 'param':
			if (qs.param == '--') {
				db.run("UPDATE alias SET param = ? WHERE alias = ?", undefined, qs.alias);
				t_alias[qs.alias]['param'] = undefined;
			} else {
				db.run("UPDATE alias SET param = ? WHERE alias = ?", qs.param, qs.alias);
				t_alias[qs.alias]['param'] = qs.param;
			}
			break;
		case 'timeoffset':
			// DEBUG: need check for timeoffset format
			if (qs.timeoffset == '--') {
				db.run("UPDATE alias SET timeoffset = ? WHERE alias = ?", undefined, qs.alias);
				t_alias[qs.alias]['timeoffset'] = undefined;
			} else {
				db.run("UPDATE alias SET timeoffset = ? WHERE alias = ?", qs.timeoffset, qs.alias);
				t_alias[qs.alias]['timeoffset'] = qs.timeoffset;
			}
			break;
	}
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['SETMETA']};
	if (qs.metatype == 'ccode')
		cmd['ccode'] = qs.ccode;
	else if (qs.metatype == 'param')
		cmd['param'] = qs.param;
	else if (qs.metatype == 'timeoffset')
		cmd['timeoffset'] = qs.timeoffset;
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}


// id, cid, type, mode
// id, cid, type, ti1, ti2, alias, urltype, url, vid, title, imgurl, stime, param, ccode, timeoffset


function handle_cmd_close(res, ti) {
	console.log('handle_cmd_close() :: ti = ' + ti);
	if (ti == undefined || ti == '' || !isdigit(ti)) {
		resout(res, 'invalid parameter');
		return;
	}
	ti = parseInt(ti);
	if (ti > t_tilemode['mode'] - 1) {
		resout(res, 'tile number is outside of range');
		return;
	}
	resout(res);
	t_tilestate[ti] = {
			ti: ti,
			state: undefined,
			cid: undefined,
			alias: undefined,
			urltype: undefined,
			url: undefined,
			vid: undefined,
			title: undefined,
			imgurl: undefined,
			stime: undefined,
			param: undefined,
			ccode: undefined,
			timeoffset: undefined,
			vol: undefined };
	db.run("UPDATE tilestate SET state = NULL, cid = NULL, alias = NULL, urltype = NULL, url = NULL, vid = NULL, title = NULL, imgurl = NULL, stime = NULL, param = NULL, ccode = NULL, timeoffset = NULL, vol = NULL WHERE ti = ?", ti);
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['CLOSE'],
		ti1: ti
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}


function handle_cmd_closealias(res, alias) {
	console.log('handle_cmd_closealias() :: alias = ' + alias);
	if (alias == undefined || alias == '') {
		resout(res, 'invalid alias');
		return false;
	}
	console.log('handle_cmd_closealias() :: alias = ' + alias);
	var ti = get_ti_byalias(alias);
	console.log('handle_cmd_closealias() :: ti = ' + ti);
	if (ti == undefined) {
		resout(res, 'invalid alias');
		return false;
	}
	return handle_cmd_close(res, ti);
}

function handle_cmd_closelist(res, qs) {
	console.log('handle_cmd_closelist() :: qs.param = ' + qs.param);
	var paramlist = qs.param.split(',');
	var tilist = new Array();
	for (var i = 0; i < paramlist.length; i++) {
		if (isdigit(paramlist[i]) && is_tile_exist(paramlist[i])) {
			tilist.push(paramlist[i]);
		} else if (paramlist[i] in t_alias) {
			var ti = get_ti_byalias(paramlist[i]);
			if (ti == undefined)
				continue;
			tilist.push(ti)
		}
	}
	var cmdlist = new Array();
	for (var i = 0; i < tilist.length; i++) {
		var ti = parseInt(tilist[i]);
		console.log('handle_cmd_closelist() :: ti = ' + ti);
		t_tilestate[ti] = {
				ti: ti,
				state: undefined,
				cid: undefined,
				alias: undefined,
				urltype: undefined,
				url: undefined,
				vid: undefined,
				title: undefined,
				imgurl: undefined,
				stime: undefined,
				param: undefined,
				ccode: undefined,
				timeoffset: undefined,
				vol: undefined };
		db.run("UPDATE tilestate SET state = NULL, cid = NULL, alias = NULL, urltype = NULL, url = NULL, vid = NULL, title = NULL, imgurl = NULL, stime = NULL, param = NULL, ccode = NULL, timeoffset = NULL, vol = NULL WHERE ti = ?", ti);
		var id = lastid + 1;
		var cid = generate_cid();
		console.log('handle_cmd_closelist() :: i = ' + i + ', cid = ' + cid);
		var cmd = {
			id: id,
			cid: cid,
			type: _CMD['CLOSE'],
			ti1: ti
		};
		cmdlist.push(cmd);
		lastid = id;
		lastcid = cid;
	}
	ws.emit('cmd', cmdlist);
	resout(res);
}







function handle_cmd_info(res, ti) {
	console.log('handle_cmd_info() :: ti = ' + ti);
	if (!isdigit(ti)) {
		resout(res, 'invalid tile index');
		return;
	}
	ti = parseInt(ti);
	if (ti < 0 || ti > (t_tilemode['mode'] - 1)) {
		resout(res, 'invalid tile index');
		return;
	}
	if (!t_tilestate[ti]['urltype']) {
		resout(res, 'specified tile is not occupied');
		return
	}
	var output = (ti + 1) + '  ';
	if (t_tilestate[ti]['alias'])
		output += t_tilestate[ti]['alias'] + '  ';
	output += t_tilestate[ti]['url'];
	resout(res, output);
}

function handle_cmd_infoall(res) {
	console.log('handle_cmd_infoall()');
	var output = '';
	var maxaliaslength = 0;
	for (var i = 0; i < t_tilemode['mode']; i++) {
		if (t_tilestate[i]['urltype'] && t_tilestate[i]['alias'])
			if (t_tilestate[i]['alias'].length > maxaliaslength)
				maxaliaslength = t_tilestate[i]['alias'].length;
	}
	for (var i = 0; i < t_tilemode['mode']; i++) {
		if (t_tilestate[i]['urltype']) {
			output += (i + 1) + '  ';
			if (maxaliaslength > 0) {
				if (t_tilestate[i]['alias'])
					output += t_tilestate[i]['alias'] + ' '.times((maxaliaslength - t_tilestate[i]['alias'].length) + 2);
				else
					output += (' '.times(maxaliaslength + 2));
			}
			output += t_tilestate[i]['url'] + '\n';
		}
	}
	console.log('output = *' + output + '*');
	if (output == '') {
		output = 'none of the tiles are occupied';
	}
	resout(res, output);
}

function handle_cmd_mode(res, newmode) {
	console.log('handle_cmd_mode() :: newmode = ' + newmode);
	if (newmode == undefined || newmode == '' || isNaN(parseInt(newmode))) {
		resout(res, 'invalid mode');
		return;
	}
	newmode = parseInt(newmode);
	console.log('handle_cmd_mode() :: newmode = ' + newmode);

	if (newmode != 1 && newmode != 4 && newmode != 6 && newmode != 9) {
		resout(res, 'invalid mode parameter');
		return
	}
	var oldmode = parseInt(t_tilemode['mode']);
	console.log('handle_cmd_mode() :: oldmode = ' + oldmode);
	if (newmode == oldmode) {
		resout(res);
		return;
	}
	resout(res);
	if (newmode == 1 || newmode == 4 || newmode == 6) {
		for (var i = newmode; i < 9; i++) {
			t_tilestate[i] = {
					ti: i,
					state: undefined,
					cid: undefined,
					alias: undefined,
					urltype: undefined,
					url: undefined,
					vid: undefined,
					title: undefined,
					imgurl: undefined,
					stime: undefined,
					param: undefined,
					ccode: undefined,
					timeoffset: undefined,
					vol: undefined };
			db.run("UPDATE tilestate SET state = NULL, cid = NULL, alias = NULL, urltype = NULL, url = NULL, vid = NULL, title = NULL, imgurl = NULL, stime = NULL, param = NULL, ccode = NULL, timeoffset = NULL, vol = NULL WHERE ti = ?", i);
		}
	}

	t_tilemode['mode'] = newmode;
	db.run("UPDATE tilemode SET v = ? WHERE k = ?", newmode, 'mode');
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['MODE'],
		mode: newmode
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_move(res, ti1, ti2) {
	console.log('handle_cmd_move() :: ti1 = ' + ti1 + ', ti2 = ' + ti2);
	if (ti1 == undefined || ti1 == '' || isNaN(parseInt(ti1))) {
		resout(res, 'invalid parameter');
		return;
	}
	if (ti2 == undefined || ti2 == '' || isNaN(parseInt(ti2))) {
		resout(res, 'invalid parameter');
		return;
	}
	ti1 = parseInt(ti1);
	ti2 = parseInt(ti2);
	if (ti1 > t_tilemode['mode'] - 1) {
		resout(res, 'tile number is outside of range');
		return;
	}
	if (ti2 > t_tilemode['mode'] - 1) {
		resout(res, 'tile number is outside of range');
		return;
	}
	if (ti1 == ti2) {
		resout(res, 'you\'re doing it wrong');
		return;
	}
	resout(res);

	t_tilestate[ti2] = t_tilestate[ti1];
	t_tilestate[ti2]['ti'] = ti2;
	t_tilestate[ti1] = {
			ti: ti1,
			state: undefined,
			cid: undefined,
			alias: undefined,
			urltype: undefined,
			url: undefined,
			vid: undefined,
			title: undefined,
			imgurl: undefined,
			stime: undefined,
			param: undefined,
			ccode: undefined,
			timeoffset: undefined,
			vol: undefined };
	db.serialize(function() {
		db.run("BEGIN TRANSACTION");
		db.run("UPDATE OR REPLACE tilestate SET ti = ? WHERE ti = ?", ti2, ti1);
// 		db.run("UPDATE OR REPLACE tilestate SET state = NULL, cid = NULL, alias = NULL, urltype = NULL, url = NULL, vid = NULL, title = NULL, imgurl = NULL, stime = NULL, param = NULL, ccode = NULL, timeoffset = NULL, vol = NULL WHERE ti = ?", ti1);
		db.run("INSERT INTO tilestate VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)", ti1);
		db.run("END TRANSACTION");
	});
	console.log('handle_cmd_move() :: after db calls');
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['MOVE'],
		ti1: ti1,
		ti2: ti2
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
	console.log('handle_cmd_move() :: id = ' + id + ', cid = ' + cid);
	console.log('handle_cmd_move() :: ti1 = ' + ti1 + ', ti2 = ' + ti2);
	console.log('handle_cmd_move() :: the very end');
}

function handle_cmd_mute(res, ti) {
	console.log('handle_cmd_mute() :: ti = ' + ti);
	// TODO: need checks to see if tile is youtube tile
	resout(res);
	t_tilestate[ti]['vol'] = 'm';
	db.run("UPDATE tilestate SET vol = ? WHERE ti = ?", 'm', ti);
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['MUTE'],
		ti1: ti
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_mutealias(res, alias) {
	console.log('handle_cmd_mutealias() :: alias = ' + alias);
	if (alias == undefined || alias == '') {
		resout(res, 'invalid alias');
		return;
	}
	var ti = get_ti_byalias(alias);
	if (ti == undefined) {
		resout(res, 'invalid alias');
		return;
	}
	handle_cmd_mute(ti);
}

function handle_cmd_mutelist(res, qs) {
	console.log('handle_cmd_mutelist() :: qs = ' + qs);
	var paramlist = qs.param.split(',');
	for (var i = 0; i < paramlist.length; i++) {
		if (isdigit(paramlist[i]) && is_tile_exist(paramlist[i])) {
			handle_cmd_mute(paramlist[i]);
		} else if (paramlist[i] in t_alias) {
			var ti = get_ti_byalias(paramlist[i]);
			if (ti == undefined)
				continue;
			handle_cmd_mute(ti);
		}
	}
}

function handle_cmd_open(res, qs) {
	console.log('handle_cmd_open() :: qs = ' + qs);
	dump(qs);
	if (is_url_open(qs.url)) {
		resout(res, 'url is already open');
		return;
	}
	if ((parseInt(qs.ti) + 1) > t_tilemode['mode']) {
		resout(res, 'invalid tile number');
		return;
	}
	if (qs.ti1 == undefined) {
		var ti = get_avail_ti();
		console.log('handle_cmd_open() :: ti = ' + ti);
		if (ti == undefined) {
			resout(res, 'no available tile');
			return;
		}
		qs.ti1 = ti;
	}
	resout(res);

	var ti = qs.ti1;
	var id = lastid + 1;
	var cid = generate_cid();

	t_tilestate[ti]['ti'] = ti;
	t_tilestate[ti]['state'] = qs.state;
	t_tilestate[ti]['cid'] = cid;
	t_tilestate[ti]['alias'] = qs.alias;
	t_tilestate[ti]['urltype'] = qs.urltype;
	t_tilestate[ti]['url'] = qs.url;
	t_tilestate[ti]['vid'] = qs.vid;
	t_tilestate[ti]['title'] = qs.title;
	t_tilestate[ti]['imgurl'] = qs.imgurl;
	t_tilestate[ti]['stime'] = qs.stime;
	t_tilestate[ti]['param'] = qs.param;
	t_tilestate[ti]['ccode'] = qs.ccode;
	t_tilestate[ti]['timeoffset'] = qs.timeoffset;
	t_tilestate[ti]['vol'] = qs.vol;

	db.run("UPDATE tilestate SET state = ?, cid = ?, alias = ?, urltype = ?, url = ?, vid = ?, title = ?, imgurl = ?, stime = ?, param = ?, ccode = ?, timeoffset = ?, vol = ? WHERE ti = ?",
	       qs.state, cid, qs.alias, parseInt(qs.urltype), qs.url, qs.vid, qs.title, qs.imgurl, parseInt(qs.stime), qs.param, qs.ccode, parseInt(qs.timeoffset), qs.vol, parseInt(qs.ti1));
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['OPEN'],
		ti1: qs.ti1,
		urltype: qs.urltype,
		url: qs.url,
		vid: qs.vid
	};
	cmd['alias'] = (qs.alias != undefined) ? qs.alias : '';
	cmd['title'] = (qs.title != undefined) ? qs.title : '';
	cmd['imgurl'] = (qs.imgurl != undefined) ? qs.imgurl : '';
	cmd['stime'] = (qs.stime != undefined) ? qs.stime : 0;
	cmd['param'] = (qs.param != undefined) ? qs.param : '';
	cmd['ccode'] = (qs.ccode != undefined) ? qs.ccode : '';
	cmd['timeoffset'] = (qs.timeoffset != undefined) ? qs.timeoffset : -1440;
	cmd['vol'] = (qs.vol != undefined) ? qs.vol : '';
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_openalias(res, qs) {
	console.log('handle_cmd_openalias() :: qs = ' + qs);
	dump(qs);
	if (qs.alias == undefined || qs.alias == '') {
		resout(res, 'invalid alias (1)');
		return;
	}
	if (!(qs.alias in t_alias)) {
		resout(res, 'invalid alias (2)');
		return;
	}
	var ti = get_ti_byalias(qs.alias);
	if (ti != undefined) {
		resout(res, 'tile is already open');
		return;
	}
	qs.urltype = t_alias[qs.alias].urltype;
	qs.url = t_alias[qs.alias].url;
	qs.vid = t_alias[qs.alias].vid;
	qs.title = t_alias[qs.alias].title;
	qs.imgurl = t_alias[qs.alias].imgurl;
	qs.stime = t_alias[qs.alias].stime;
	qs.param = t_alias[qs.alias].param;
	qs.ccode = t_alias[qs.alias].ccode;
	qs.timeoffset = t_alias[qs.alias].timeoffset;
	handle_cmd_open(res, qs);
}


function handle_cmd_querystat(res) {
	console.log('handle_cmd_querystat()');
	resout(res);
	t_stat = {};	// clear out current t_stat array
	ws.emit('stat');
}


function handle_cmd_refreshpage(res) {
	console.log('handle_cmd_refreshpage()');
	resout(res);
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['REFRESHPAGE']
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_replay(res, ti) {
	console.log('handle_cmd_replay() :: ti = ' + ti);
	resout(res);
	var id = lastid + 1;
	var cid = generate_cid();
	t_tilestate[ti]['cid'] = cid;
	db.run("UPDATE tilestate SET cid = ? WHERE ti = ?", cid, ti);
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['REPLAY'],
		ti1: ti
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_replayalias(res, alias) {
	console.log('handle_cmd_replayalias() :: alias = ' + alias);
	if (alias == undefined || alias == '') {
		resout(res, 'invalid alias');
		return;
	}
	var ti = get_ti_byalias(alias);
	if (ti == undefined) {
		resout(res, 'invalid alias');
		return;
	}
	handle_cmd_replay(ti);
}

function handle_cmd_sb_off(res) {
	console.log('handle_cmd_sb_off()');
	resout(res);
	if (t_tilemode['sbstate'] == 0)
		return;
	t_tilemode['sbstate'] = '0';
	db.run("UPDATE tilemode SET v = ? WHERE k = ?", '0', 'sbstate');
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['SBOFF']
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_sb_on(res) {
	console.log('handle_cmd_sb_on()');
	resout(res);
	if (t_tilemode['sbstate'] == 1)
		return;
	t_tilemode['sbstate'] = '1';
	db.run("UPDATE tilemode SET v = ? WHERE k = ?", '1', 'sbstate');
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['SBON']
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_sb_reload(res) {
	console.log('handle_cmd_sb_reload()');
	resout(res);
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['SBRELOAD']
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_sb_set(res, alias) {
	console.log('handle_cmd_sb_set() :: alias = ' + alias);
	if (!(alias in t_alias)) {
		resout(res, 'invalid parameter (alias)');
		return;
	}
	resout(res);
	t_tilemode['sbalias'] = alias;
	db.run("UPDATE tilemode SET v = ? WHERE k = ?", alias, 'sbalias');
}

function handle_cmd_sb_status(res) {
	console.log('handle_cmd_sb_status()');
	var sbalias = t_tilemode['sbalias'];
	console.log('handle_cmd_sb_status() :: sbalias = ' + sbalias);
	if (sbalias == undefined) {
		resout(res, 'speechbot has not been assigned to an alias');
		return;
	}
	if (!(sbalias in t_alias)) {
		resout(res, 'speechbot has been assigned to an alias that does not exist');
		return;
	}
	if (t_tilemode['sbstate'] == '0') {
		resout(res, 'speechbot is offline.  ' + sbalias + '  ' +  t_alias[sbalias]['url']);
		return;
	} else {
		resout(res, 'speechbot is online.  ' + sbalias + '  ' +  t_alias[sbalias]['url']);
		return;
	}
}

function handle_cmd_sbbl_add(res, nick) {
	console.log('handle_cmd_sbbl_add() :: nick = ' + nick);
	resout(res);
	if (nick == undefined)
		return;
	if (nick in t_sbbl)
		return;
	t_sbbl[nick] = true;
	db.run("INSERT INTO sbbl VALUES (?)", nick);
}

function handle_cmd_sbbl_list(res) {
	console.log('handle_cmd_sbbl_list()');
	if (t_sbbl.length == 0) {
		resout(res, 'no speechbot blacklist entry');
		return;
	} else {
		var l = new Array();
		for (var nick in t_sbbl)
			l.push(nick);
		resout(res, l);
	}
}

function handle_cmd_sbbl_remove(res, nick) {
	console.log('handle_cmd_sbbl_remove() :: nick = ' + nick);
	resout(res);
	if (nick == undefined)
		return;
	if (!(nick in t_sbbl))
		return;
	delete t_sbbl[nick];
	db.run("DELETE FROM sbbl WHERE nick = ?", nick);
}

function handle_cmd_swap(res, ti1, ti2) {
	console.log('handle_cmd_swap() :: ti1 = ' + ti1 + ', ti2 = ' + ti2);
	if (ti1 == undefined || ti1 == '' || isNaN(parseInt(ti1))) {
		resout(res, 'invalid parameter');
		return;
	}
	if (ti2 == undefined || ti2 == '' || isNaN(parseInt(ti2))) {
		resout(res, 'invalid parameter');
		return;
	}
	ti1 = parseInt(ti1);
	ti2 = parseInt(ti2);
	if (ti1 > t_tilemode['mode'] - 1) {
		resout(res, 'tile number is outside of range');
		return;
	}
	if (ti2 > t_tilemode['mode'] - 1) {
		resout(res, 'tile number is outside of range');
		return;
	}
	if (ti1 == ti2) {
		resout(res, 'you\'re doing it wrong');
		return;
	}
	resout(res);

	var tmp = t_tilestate[ti2];
	t_tilestate[ti2] = t_tilestate[ti1];
	t_tilestate[ti1] = tmp;
	t_tilestate[ti1]['ti'] = ti1;
	t_tilestate[ti2]['ti'] = ti2;
	db.serialize(function() {
		db.run("BEGIN TRANSACTION");
		db.run("UPDATE tilestate SET ti = ? WHERE ti = ?", 999, ti2);
		db.run("UPDATE tilestate SET ti = ? WHERE ti = ?", ti2, ti1);
		db.run("UPDATE tilestate SET ti = ? WHERE ti = ?", ti1, 999);
		db.run("END TRANSACTION");
	});
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['SWAP'],
		ti1: ti1,
		ti2: ti2
	};
	ws.emit('cmd', [cmd]);

	lastid = id;
	lastcid = cid;
}

function handle_cmd_unmute(res, ti) {
	console.log('handle_cmd_unmute() :: ti = ' + ti);
	resout(res);
	t_tilestate[ti]['vol'] = undefined;
	db.run("UPDATE tilestate SET vol = NULL WHERE ti = ?", ti);
	var id = lastid + 1;
	var cid = generate_cid();
	var cmd = {
		id: id,
		cid: cid,
		type: _CMD['UNMUTE'],
		ti1: ti
	};
	ws.emit('cmd', [cmd]);
	lastid = id;
	lastcid = cid;
}

function handle_cmd_unmutealias(res, alias) {
	console.log('handle_cmd_unmutealias() :: alias = ' + alias);
	if (alias == undefined || alias == '') {
		resout(res, 'invalid alias');
		return;
	}
	var ti = get_ti_byalias(alias);
	if (ti == undefined) {
		resout(res, 'invalid alias');
		return;
	}
	handle_cmd_unmute(res, ti);
}

function handle_cmd_unmutelist(res, qs) {
	console.log('handle_cmd_unmutelist() :: qs = ' + qs);
	var paramlist = qs.param.split(',');
	for (var i = 0; i < paramlist.length; i++) {
		if (isdigit(paramlist[i]) && is_tile_exist(paramlist[i])) {
			handle_cmd_unmute(paramlist[i]);
		} else if (paramlist[i] in t_alias) {
			var ti = get_ti_byalias(paramlist[i]);
			if (ti == undefined)
				continue;
			handle_cmd_unmute(res, ti);
		}
	}
}

function handle_cmd_voice_clear(res, nick) {
	console.log('handle_cmd_voice_clear() :: nick = ' + nick);
	resout(res);
	delete t_ttsvoice[nick];
	db.run("DELETE FROM ttsvoice WHERE nick = ?", nick);
}

function handle_cmd_voice_set(nick, voice) {
	console.log('handle_cmd_voice_set() :: nick = ' + nick + ', voice = ' + voice);
	resout(res);
	t_ttsvoice[nick] = voice;
	if (nick in t_ttsvoice)
		db.run("UPDATE ttsvoice SET voice = ? WHERE nick = ?", voice, nick);
	else
		db.run("INSERT INTO ttsvoice VALUES (?, ?)", nick, voice);
}



function handle_al(res) {
	console.log('handle_al()');
	var l = [];
	for (var alias in t_alias)
		l.push(alias);
	dump(t_alias);
	resout(res, l.join(' '));
	return;
}

function handle_mode(res) {
	console.log('handle_mode()');
	console.log('handle_mode() :: mode = ' + t_tilemode['mode']);
	resout(res, t_tilemode['mode']);
	return;
}

function handle_sbbl(res) {
	console.log('handle_sbbl()');
	var l = [];
	for (var alias in t_sbbl)
		l.push(alias);
	resout(res, l.join(' '));
	return;
}

function handle_stat(res) {
	console.log('handle_stat()');
	var output = '';
	var klist = [];
	var ipmaxlength = 0;
	for (var k in t_stat) {
		klist.push(k);
		if (ipmaxlength < k.length) {
			ipmaxlength = k.length;
		}
	}
	klist.sort();
	for (var i in klist) {
		var ip = klist[i];
		output += ip + ' '.times((ipmaxlength + 3) - ip.length);
		output += t_stat[ip]['w'] + ' x ' + t_stat[ip]['h'];
		output += ' '.times(11 - (t_stat[ip]['w'].toString().length + t_stat[ip]['h'].toString().length));
		output += t_stat[ip]['vv'] + ' '.times(10 - t_stat[ip]['vv'].toString().length);
		output += t_stat[ip]['ua'];
		output += "\n";
	}
	resout(res, output);
	return;
}

function handle_ttsvoice(res) {
	console.log('handle_ttsvoice()');
	var l = [];
	for (var nick in t_ttsvoice)
		l.push(nick + ' ' + t_ttsvoice[nick]);
	resout(res, l);
	return;
}

function handle_debug_dump(res) {
	console.log('handle_debug_dump()');
	console.log('lastcid = ' + lastcid);

	resout(res);

	for (var i = 0; i < 3; i++) {
		console.log('i = ' + i);
		console.log('\tti         = ' + t_tilestate[i]['ti']);
		console.log('\tcid        = ' + t_tilestate[i]['cid']);
		console.log('\talias      = ' + t_tilestate[i]['alias']);
		console.log('\turltype    = ' + t_tilestate[i]['urltype']);
		console.log('\turl        = ' + t_tilestate[i]['url']);
		console.log('\tvol        = ' + t_tilestate[i]['vol']);
	}
}

function write_aliaslist() {
	var output = '';
	var klist = [];
	for (var k in t_alias) {
		klist.push(k);
	}
	klist.sort();
	console.log('write_aliaslist() :: klist = ' + klist);
	for (var i in klist) {
		var alias = klist[i];
		output += alias + ' '.times(19 - alias.length) + t_alias[alias]['url'] + '\n';
	}
	fs.writeFileSync(config.aliaslistfn, output);
}





function dump(obj) {
	for (var item in obj) {
		console.log(item);
		if (typeof(obj[item]) == 'object') {
			for (var item2 in obj[item]) {
				console.log('\t' + item2 + ': ' + obj[item][item2]);
			}
		} else {
			console.log('\t' + obj[item]);
		}
	}
}


