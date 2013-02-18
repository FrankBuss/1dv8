

var f_debug = false;

function now() {
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var out = '';
	out = (h < 10) ? '0' + h : h.toString();
	out += ':';
	out += (m < 10) ? '0' + m : m.toString();
	out += ':';
	out += (s < 10) ? '0' + s : s.toString();
	return out;
}

function init_debug() {
	if (p_debug) {
		$('#sptabdebug').css('visibility', 'visible');
		f_debug = true;
	}
}

function debug_append(s) {
	if (f_debug)
		$('#sptabdebugcontent').append('<div>' + now() + " - " + s + '</div>');
}

function debug_breakpoint() {
	if (f_debug)
		$('#sptabdebugcontent').append('<div>' + now() + " --------------------" + '</div>');
}

function debug_clear() {
	if (f_debug)
		$('#sptabdebugcontent').html('');
}

function debug_q() {
	debug_append('======================');
	for (var i = 0; i < 9; i++) {
// 		debug_append('tile[' + i + '] = ' + tile[i]);
		if (tileinfo[i]['ytobj'])
			debug_append('tileinfo[' + i + '][ytobj][ti] = ' + tileinfo[i]['ytobj'].ti);
		else
			debug_append('tileinfo[' + i + '][ytobj] = ' + tileinfo[i]['ytobj']);
// 		debug_append('tileinfo[' + i + '][ytobj].ti = ' + tileinfo[i]['ytobj'].ti);
	}
	debug_append('======================');
}

function debug_w() {
	debug_append('======================');
	for (var i = 0; i < 9; i++) {
		debug_append('tileinfo[' + i + '][vol] = ' + tileinfo[i]['vol']);
	}
	debug_append('======================');
}

function debug_e() {
	debug_append('======================');
	debug_append('lastcid = ' + lastcid);
	debug_append('======================');
}


function debug_toggle() {
	if (f_debug) {
		$('#sptabdebug').css('visibility', 'hidden');
		$('#sptabdebugcontent').css('visibility', 'hidden');
		debug_clear();
		select_tab('0');
		f_debug = false;
	} else {
		$('#sptabdebug').css('visibility', 'visible');
		f_debug = true;
	}
}

function debug_windowsize(s) {
	if (f_debug)
		debug_append('w = ' + $(window).width() + ', h = ' + $(window).height());
}

function debug_nicklist() {
	if (f_debug) {
		for (var nick in nicklist) {
			debug_append('nick = ' + nick + ', longitude = ' + nicklist[nick]['long'] + ', latitude = ' + nicklist[nick]['lat']);
		}
	}
}

function debug_tileinfo(prefix, ti) {
	debug_append(prefix + ', ti = ' + ti);
	debug_append('.   alias = ' + tileinfo[ti]['alias']);
	debug_append('.   ccode = ' + tileinfo[ti]['ccode']);
	debug_append('.   cid = ' + tileinfo[ti]['cid']);
	debug_append('.   imgurl = ' + tileinfo[ti]['imgurl']);
	debug_append('.   param = ' + tileinfo[ti]['param']);
	debug_append('.   stime = ' + tileinfo[ti]['stime']);
	debug_append('.   timeoffset = ' + tileinfo[ti]['timeoffset']);
	debug_append('.   title = ' + tileinfo[ti]['title']);
	debug_append('.   url = ' + tileinfo[ti]['url']);
	debug_append('.   urltype = ' + tileinfo[ti]['urltype']);
	debug_append('.   vid = ' + tileinfo[ti]['vid']);
	debug_append('.   vol = ' + tileinfo[ti]['vol']);
	debug_append('.   ytobj = ' + tileinfo[ti]['ytobj']);
	debug_append('.   f_ccode = ' + tileinfo[ti]['f_ccode']);
	debug_append('.   f_timeoffset = ' + tileinfo[ti]['f_timeoffset']);
	debug_append('.   f_sync = ' + tileinfo[ti]['f_sync']);
}


