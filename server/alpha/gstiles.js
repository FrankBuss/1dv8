// gtiles.js


var flag_img_urlbase = 'http://1dv8.com/flag/';

var mleft = 0;
var mtop = 0;


var tilemode = -1;
var tile = new Array();
var tilestate = new Array();
var tileytobj = new Array();


for (var i = 0; i < 9; i++) {
	tile[i] = i;
	tilestate[i] = false;
}

var tileinfo = new Array();

for (var i = 0; i < 9; i++) {
	reset_tileinfo(i);
}


// var t = new Array();
// for (var i = 0; i < 9; i++) {
// 	t[i] = {
// 		alias: '',
// 		ccode: '',
// 		cid: 0,
// 		imgurl: '',
// 		param: '',
// 		stime: 0,
// 		timeoffset: -1440,
// 		title: '',
// 		url: '',
// 		urltype: 0,
// 		vid: '',
// 		vol: '',
// 		ytobj: undefined,
// 		f_ccode: false,
// 		f_timeoffset: false,
// 		f_sync: false
// 	};
// }


var tile_update_timer;


var tile_number_size = {};
tile_number_size[1] = 25;
tile_number_size[4] = 25;
tile_number_size[6] = 25;
tile_number_size[9] = 14;

var tile_header_font_size = {};
tile_header_font_size[1] = 22;
tile_header_font_size[4] = 22;
tile_header_font_size[6] = 22;
tile_header_font_size[9] = 11;

var tile_header_height = {};
// tile_header_height[1] = 97;
// tile_header_height[4] = 28;
// tile_header_height[6] = 55;
// tile_header_height[9] = 14;
tile_header_height[1] = 28;
tile_header_height[4] = 28;
tile_header_height[6] = 28;
tile_header_height[9] = 14;

var tile_header_left = {};
tile_header_left[1] = 28;
tile_header_left[4] = 28;
tile_header_left[6] = 28;
tile_header_left[9] = 16;

var tile_header_padding = {};
tile_header_padding[1] = '1px 5px 0px 5px';
tile_header_padding[4] = '1px 5px 0px 5px';
tile_header_padding[6] = '1px 5px 0px 5px';
tile_header_padding[9] = '1px 3px 0px 3px';





// tile size for small tile
/*
var tns = 14;  // tile number size

var thfs = 11;  // tile header font-size
var thh = 14;  // tile header height
var thl = 16;  // tile header left
var thp = '1px 3px 0px 3px';  // tile header padding

var teh = 238;  // tile embed height
var tew = 283;  // tile embed width

var tvt = thh + 1;  // tile view top (15)
var tvh = teh;  // tile view height (238)
var tvw = tew;  // tile view width (283)

var th = tvh + thh + 3;  // tile height (255)
var tw = tvw + 2;  // tile width (285)


// tile size for 2 x 2 tile

var tns22 = 25;  // tile number size

var thfs22 = 22;  // tile header font-size
var thh22 = 55;  // tile header height
var thl22 = 28;  // tile header left
var thp22 = '1px 5px 0px 5px';  // tile header padding

var teh22 = 452;  // tile embed height
var tew22 = 568;  // tile embed width

var tvt22 = thh22 + 1;  // tile view top (56)
var tvh22 = teh22;  // tile view height (452)
var tvw22 = tew22;  // tile view width (568)

var th22 = tvh22 + thh22 + 3;  // tile height (510)
var tw22 = tvw22 + 2;  // tile width (570)


// tile size for 3 x 2 tile

var tns32 = 25;  // tile number size

var thfs32 = 22;  // tile header font-size
var thh32 = 28;  // tile header height
var thl32 = 28;  // tile header left
var thp32 = '1px 5px 0px 5px';  // tile header padding

var teh32 = 479;  // tile embed height
var tew32 = 853;  // tile embed width

var tvt32 = thh32 + 1;  // tile view top (29)
var tvh32 = teh32;  // tile view height (479)
var tvw32 = tew32;  // tile view width (853)

var th32 = tvh32 + thh32 + 3;  // tile height (510)
var tw32 = tvw32 + 2;  // tile width (855)


// tile size for maximized tile equivalent to 3 x 3

var tns33 = 25;  // tile number size

var thfs33 = 22;  // tile header font-size
var thh33 = 97;  // tile header height
var thl33 = 28;  // tile header left
var thp33 = '1px 5px 0px 5px';  // tile header padding

// var teh33 = 659;  // tile embed height
// var tew33 = 844;  // tile embed width

var teh33 = 665;  // tile embed height
var tew33 = 853;  // tile embed width

var tvt33 = thh33 + 1;  // tile view top
var tvh33 = teh33;  // tile view height
var tvw33 = tew33;  // tile view width

var th33 = th * 3;  // tile height (765)
var tw33 = tw * 3;  // tile width (855)
*/

var vqstr = new Array('small', 'medium', 'large', 'hd720', 'hd1080', 'highres');



function calculate_image_size(iw, ih, vw, vh) {
// 	debug_append('calculate_image_size :: iw = ' + iw + ', ih = ' + ih);
// 	debug_append('calculate_image_size :: vw = ' + vw + ', vh = ' + vh);
	var riw;
	var rih;
	var offset_y;
	var offset_x;
	if (iw <= vw && ih <= vh) {
		// image is small enough to fit.  no resizing necessary
// 		debug_append('calculate_image_size :: image is small enough to fit.  no resizing necessary');
		riw = iw;
		rih = ih;
		offset_x = Math.round((vw - iw) / 2);
		offset_y = Math.round((vh - ih) / 2);
	}
	else if (iw > vw && ih <= vh) {
		// image is too wide
// 		debug_append('calculate_image_size :: image is too wide');
		var r = iw / vw;
		riw = vw;
		rih = Math.round(ih / r);
		offset_x = 0;
		offset_y = Math.round((vh - rih) / 2);
	}
	else if (iw <= vw && ih > vh) {
		// image is too tall
// 		debug_append('calculate_image_size :: image is too tall');
		var r = ih / vh;
		riw = Math.round(iw / r);
		rih = vh;
		offset_x = Math.round((vw - riw) / 2);
		offset_y = 0;
	}
	else if (iw > vw && ih > vh) {
		// image is both too wide and too tall
// 		debug_append('calculate_image_size :: image is both too wide and too tall');
		var vr = vw / vh;	// vr = view aspect ratio
		var ir = iw / ih;	// ir = image aspect ratio
		if (vr < ir) {
			// image has wider aspect ratio than tile
			var r = iw / vw;
			riw = vw;
			rih = Math.round(ih / r);
			offset_x = 0;
			offset_y = Math.round((vh - rih) / 2);
		} else if (vr > ir) {
			// image has narrower aspect ratio than tile
			var r = ih / vh;
			riw = Math.round(iw / r);
			rih = vh;
			offset_x = Math.round((vw - riw) / 2);
			offset_y = 0;
		} else {
			// image aspect ratio is same as tile aspect ratio
			riw = vw;
			rih = vh;
			offset_x = 0;
			offset_y = 0;
		}
	}
// 	debug_append('calculate_image_size :: riw = ' + riw + ', rih = ' + rih);
// 	debug_append('calculate_image_size :: offset_y = ' + offset_y + ', offset_x = ' + offset_x)
	var r = new Array();
	r['riw'] = riw;
	r['rih'] = rih;
	r['offset_x'] = offset_x;
	r['offset_y'] = offset_y;
	return r;
}

function calculate_offset(cid) {
// 	debug_append('calculate_offset() :: cid = ' + cid);
// 	debug_append('calculate_offset() :: get_local_cid() = ' + get_local_cid());
// 	debug_append('calculate_offset() :: get_local_cid() - cid = ' + (get_local_cid() - cid));
// 	var tmp = Math.floor(((get_local_cid() - cid) + (basecid - basecid_local)) / 100);
	var tmp = Math.floor(((get_local_cid() - cid) + (basecid - basecid_local)) / 10000);
	if (tmp < 0)
		tmp = 0;
	return tmp;
}

function cmd_close(ti) {
	debug_append('cmd_close() :: ti = ' + ti);
	$('#t' + tile[ti]).css('visibility', 'hidden');
	$('#tn' + tile[ti]).html('');
	$('#tn' + tile[ti]).unbind();
	$('#th' + tile[ti]).html('');
	$('#th' + tile[ti]).unbind();
	$('#tv' + tile[ti]).html('');
	$('#tt' + tile[ti]).html('');
	$('#tt' + tile[ti]).css('visibility', 'hidden');
	$('#tai' + tile[ti]).attr('src', '');
	$('#tai' + tile[ti]).unbind();
	$('#ta' + tile[ti]).css('visibility', 'hidden');
	$('#tf' + tile[ti]).css('visibility', 'hidden');
	$('#tfi' + tile[ti]).attr('src', '');
	$('#tfi' + tile[ti]).css('visibility', 'hidden');
	reset_tileinfo(ti);
	tilestate[ti] = false;
}

function cmd_mode(mode) {
	debug_append('cmd_mode() :: tilemode = ' + tilemode + ', mode = ' + mode);
	if (mode != 1 && mode != 4 && mode != 6 && mode != 9)
		return;
	if (tilemode == -1) {
		init_tile(mode);
		tilemode = mode;
		return;
	}
	if (tilemode == mode)
		return;
	if (tilemode == 1 && mode == 4) {
		$('#t' + tile[0]).css('width', get_tile_w(4, 0) + 'px').css('height', get_tile_h(4, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(4, 0) + 'px').css('height', get_tilenumber_size(4, 0) + 'px').css('font-size', get_tilenumber_size(4, 0) + 'px').css('line-height', get_tilenumber_size(4, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(4, 0) + 'px').css('height', get_tileheader_h(4, 0) + 'px').css('padding', get_tileheader_padding(4, 0)).css('font-size', get_tileheader_fontsize(4, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(4, 0) + 'px').css('width', get_tileview_w(4, 0) + 'px').css('height', get_tileview_h(4, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(4, 0) + 'px').css('height', get_tileembed_h(4, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(4, 0)).attr('height', get_tileembed_h(4, 0));
		}
		$('#t' + tile[1]).css('visibility', 'hidden');
		$('#t' + tile[2]).css('visibility', 'hidden');
		$('#t' + tile[3]).css('visibility', 'hidden');
		visually_move_tile(4, 1);
		visually_move_tile(4, 2);
		visually_move_tile(4, 3);
		tilemode = mode;
	} else if (tilemode == 1 && mode == 6) {
		$('#t' + tile[0]).css('width', get_tile_w(6, 0) + 'px').css('height', get_tile_h(6, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(6, 0) + 'px').css('height', get_tilenumber_size(6, 0) + 'px').css('font-size', get_tilenumber_size(6, 0) + 'px').css('line-height', get_tilenumber_size(6, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(6, 0) + 'px').css('height', get_tileheader_h(6, 0) + 'px').css('padding', get_tileheader_padding(6, 0)).css('font-size', get_tileheader_fontsize(6, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(6, 0) + 'px').css('width', get_tileview_w(6, 0) + 'px').css('height', get_tileview_h(6, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(6, 0) + 'px').css('height', get_tileembed_h(6, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(6, 0)).attr('height', get_tileembed_h(6, 0));
		}
		$('#t' + tile[1]).css('visibility', 'hidden');
		$('#t' + tile[2]).css('visibility', 'hidden');
		$('#t' + tile[3]).css('visibility', 'hidden');
		$('#t' + tile[4]).css('visibility', 'hidden');
		$('#t' + tile[5]).css('visibility', 'hidden');
		visually_move_tile(6, 1);
		visually_move_tile(6, 2);
		visually_move_tile(6, 3);
		visually_move_tile(6, 4);
		visually_move_tile(6, 5);
		tilemode = mode;
	} else if (tilemode == 1 && mode == 9) {
		$('#t' + tile[0]).css('width', get_tile_w(9, 0) + 'px').css('height', get_tile_h(9, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(9, 0) + 'px').css('height', get_tilenumber_size(9, 0) + 'px').css('font-size', get_tilenumber_size(9, 0) + 'px').css('line-height', get_tilenumber_size(9, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(9, 0) + 'px').css('height', get_tileheader_h(9, 0) + 'px').css('padding', get_tileheader_padding(9, 0)).css('font-size', get_tileheader_fontsize(9, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(9, 0) + 'px').css('width', get_tileview_w(9, 0) + 'px').css('height', get_tileview_h(9, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(9, 0) + 'px').css('height', get_tileembed_h(9, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(9, 0)).attr('height', get_tileembed_h(9, 0));
		}
		$('#t' + tile[1]).css('visibility', 'hidden');
		$('#t' + tile[2]).css('visibility', 'hidden');
		$('#t' + tile[3]).css('visibility', 'hidden');
		$('#t' + tile[4]).css('visibility', 'hidden');
		$('#t' + tile[5]).css('visibility', 'hidden');
		$('#t' + tile[6]).css('visibility', 'hidden');
		$('#t' + tile[7]).css('visibility', 'hidden');
		$('#t' + tile[8]).css('visibility', 'hidden');
		visually_move_tile(9, 1);
		visually_move_tile(9, 2);
		visually_move_tile(9, 3);
		visually_move_tile(9, 4);
		visually_move_tile(9, 5);
		visually_move_tile(9, 6);
		visually_move_tile(9, 7);
		visually_move_tile(9, 8);
		tilemode = mode;
	} else if (tilemode == 4 && mode == 1) {
		cmd_close(3);
		cmd_close(2);
		cmd_close(1);
		$('#t' + tile[0]).css('width', get_tile_w(1, 0) + 'px').css('height', get_tile_h(1, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(1, 0) + 'px').css('height', get_tilenumber_size(1, 0) + 'px').css('font-size', get_tilenumber_size(1, 0) + 'px').css('line-height', get_tilenumber_size(1, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(1, 0) + 'px').css('height', get_tileheader_h(1, 0) + 'px').css('padding', get_tileheader_padding(1, 0)).css('font-size', get_tileheader_fontsize(1, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(1, 0) + 'px').css('width', get_tileview_w(1, 0) + 'px').css('height', get_tileview_h(1, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(1, 0) + 'px').css('height', get_tileembed_h(1, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(1, 0)).attr('height', get_tileembed_h(1, 0));
		}
		tilemode = mode;
	} else if (tilemode == 4 && mode == 6) {
		$('#t' + tile[0]).css('width', get_tile_w(6, 0) + 'px').css('height', get_tile_h(6, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(6, 0) + 'px').css('height', get_tilenumber_size(6, 0) + 'px').css('font-size', get_tilenumber_size(6, 0) + 'px').css('line-height', get_tilenumber_size(6, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(6, 0) + 'px').css('height', get_tileheader_h(6, 0) + 'px').css('padding', get_tileheader_padding(6, 0)).css('font-size', get_tileheader_fontsize(6, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(6, 0) + 'px').css('width', get_tileview_w(6, 0) + 'px').css('height', get_tileview_h(6, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(6, 0) + 'px').css('height', get_tileembed_h(6, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(6, 0)).attr('height', get_tileembed_h(6, 0));
		}
		visually_move_tile(6, 1);
		visually_move_tile(6, 2);
		visually_move_tile(6, 3);
		$('#t' + tile[4]).css('visibility', 'hidden');
		$('#t' + tile[5]).css('visibility', 'hidden');
		visually_move_tile(6, 4);
		visually_move_tile(6, 5);
		tilemode = mode;
	} else if (tilemode == 4 && mode == 9) {
		$('#t' + tile[0]).css('width', get_tile_w(9, 0) + 'px').css('height', get_tile_h(9, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(9, 0) + 'px').css('height', get_tilenumber_size(9, 0) + 'px').css('font-size', get_tilenumber_size(9, 0) + 'px').css('line-height', get_tilenumber_size(9, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(9, 0) + 'px').css('height', get_tileheader_h(9, 0) + 'px').css('padding', get_tileheader_padding(9, 0)).css('font-size', get_tileheader_fontsize(9, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(9, 0) + 'px').css('width', get_tileview_w(9, 0) + 'px').css('height', get_tileview_h(9, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(9, 0) + 'px').css('height', get_tileembed_h(9, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(9, 0)).attr('height', get_tileembed_h(9, 0));
		}
		visually_move_tile(9, 1);
		visually_move_tile(9, 2);
		visually_move_tile(9, 3);
		$('#t' + tile[4]).css('visibility', 'hidden');
		$('#t' + tile[5]).css('visibility', 'hidden');
		$('#t' + tile[6]).css('visibility', 'hidden');
		$('#t' + tile[7]).css('visibility', 'hidden');
		$('#t' + tile[8]).css('visibility', 'hidden');
		visually_move_tile(9, 4);
		visually_move_tile(9, 5);
		visually_move_tile(9, 6);
		visually_move_tile(9, 7);
		visually_move_tile(9, 8);
		tilemode = mode;
	} else if (tilemode == 6 && mode == 1) {
		cmd_close(5);
		cmd_close(4);
		cmd_close(3);
		cmd_close(2);
		cmd_close(1);
		$('#t' + tile[0]).css('width', get_tile_w(1, 0) + 'px').css('height', get_tile_h(1, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(1, 0) + 'px').css('height', get_tilenumber_size(1, 0) + 'px').css('font-size', get_tilenumber_size(1, 0) + 'px').css('line-height', get_tilenumber_size(1, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(1, 0) + 'px').css('height', get_tileheader_h(1, 0) + 'px').css('padding', get_tileheader_padding(1, 0)).css('font-size', get_tileheader_fontsize(1, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(1, 0) + 'px').css('width', get_tileview_w(1, 0) + 'px').css('height', get_tileview_h(1, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(1, 0) + 'px').css('height', get_tileembed_h(1, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(1, 0)).attr('height', get_tileembed_h(1, 0));
		}
		tilemode = mode;
	} else if (tilemode == 6 && mode == 4) {
		cmd_close(5);
		cmd_close(4);
		visually_move_tile(4, 3);
 		visually_move_tile(4, 2);
		visually_move_tile(4, 1);
		$('#t' + tile[0]).css('width', get_tile_w(4, 0) + 'px').css('height', get_tile_h(4, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(4, 0) + 'px').css('height', get_tilenumber_size(4, 0) + 'px').css('font-size', get_tilenumber_size(4, 0) + 'px').css('line-height', get_tilenumber_size(4, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(4, 0) + 'px').css('height', get_tileheader_h(4, 0) + 'px').css('padding', get_tileheader_padding(4, 0)).css('font-size', get_tileheader_fontsize(4, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(4, 0) + 'px').css('width', get_tileview_w(4, 0) + 'px').css('height', get_tileview_h(4, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(4, 0) + 'px').css('height', get_tileembed_h(4, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(4, 0)).attr('height', get_tileembed_h(4, 0));
		}
		tilemode = mode;
	} else if (tilemode == 6 && mode == 9) {
		$('#t' + tile[0]).css('width', get_tile_w(9, 0) + 'px').css('height', get_tile_h(9, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(9, 0) + 'px').css('height', get_tilenumber_size(9, 0) + 'px').css('font-size', get_tilenumber_size(9, 0) + 'px').css('line-height', get_tilenumber_size(9, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(9, 0) + 'px').css('height', get_tileheader_h(9, 0) + 'px').css('padding', get_tileheader_padding(9, 0)).css('font-size', get_tileheader_fontsize(9, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(9, 0) + 'px').css('width', get_tileview_w(9, 0) + 'px').css('height', get_tileview_h(9, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(9, 0) + 'px').css('height', get_tileembed_h(9, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(9, 0)).attr('height', get_tileembed_h(9, 0));
		}
		visually_move_tile(9, 1);
		visually_move_tile(9, 2);
		visually_move_tile(9, 3);
		visually_move_tile(9, 4);
		visually_move_tile(9, 5);
		$('#t' + tile[6]).css('visibility', 'hidden');
		$('#t' + tile[7]).css('visibility', 'hidden');
		$('#t' + tile[8]).css('visibility', 'hidden');
		visually_move_tile(9, 6);
		visually_move_tile(9, 7);
		visually_move_tile(9, 8);
		tilemode = mode;
	} else if (tilemode == 9 && mode == 1) {
		cmd_close(8);
		cmd_close(7);
		cmd_close(6);
		cmd_close(5);
		cmd_close(4);
		cmd_close(3);
		cmd_close(2);
		cmd_close(1);
		$('#t' + tile[0]).css('width', get_tile_w(1, 0) + 'px').css('height', get_tile_h(1, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(1, 0) + 'px').css('height', get_tilenumber_size(1, 0) + 'px').css('font-size', get_tilenumber_size(1, 0) + 'px').css('line-height', get_tilenumber_size(1, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(1, 0) + 'px').css('height', get_tileheader_h(1, 0) + 'px').css('padding', get_tileheader_padding(1, 0)).css('font-size', get_tileheader_fontsize(1, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(1, 0) + 'px').css('width', get_tileview_w(1, 0) + 'px').css('height', get_tileview_h(1, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(1, 0) + 'px').css('height', get_tileembed_h(1, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(1, 0)).attr('height', get_tileembed_h(1, 0));
		}
		tilemode = mode;
	} else if (tilemode == 9 && mode == 4) {
		cmd_close(8);
		cmd_close(7);
		cmd_close(6);
		cmd_close(5);
		cmd_close(4);
		visually_move_tile(4, 3);
 		visually_move_tile(4, 2);
		visually_move_tile(4, 1);
		$('#t' + tile[0]).css('width', get_tile_w(4, 0) + 'px').css('height', get_tile_h(4, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(4, 0) + 'px').css('height', get_tilenumber_size(4, 0) + 'px').css('font-size', get_tilenumber_size(4, 0) + 'px').css('line-height', get_tilenumber_size(4, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(4, 0) + 'px').css('height', get_tileheader_h(4, 0) + 'px').css('padding', get_tileheader_padding(4, 0)).css('font-size', get_tileheader_fontsize(4, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(4, 0) + 'px').css('width', get_tileview_w(4, 0) + 'px').css('height', get_tileview_h(4, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(4, 0) + 'px').css('height', get_tileembed_h(4, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(4, 0)).attr('height', get_tileembed_h(4, 0));
		}
		tilemode = mode;
	} else if (tilemode == 9 && mode == 6) {
		cmd_close(8);
		cmd_close(7);
		cmd_close(6);
		visually_move_tile(6, 5);
		visually_move_tile(6, 4);
		visually_move_tile(6, 3);
 		visually_move_tile(6, 2);
		visually_move_tile(6, 1);
		$('#t' + tile[0]).css('width', get_tile_w(6, 0) + 'px').css('height', get_tile_h(6, 0) + 'px');
		$('#tn' + tile[0]).css('width', get_tilenumber_size(6, 0) + 'px').css('height', get_tilenumber_size(6, 0) + 'px').css('font-size', get_tilenumber_size(6, 0) + 'px').css('line-height', get_tilenumber_size(6, 0) + 'px');
		$('#th' + tile[0]).css('left', get_tileheader_left(6, 0) + 'px').css('height', get_tileheader_h(6, 0) + 'px').css('padding', get_tileheader_padding(6, 0)).css('font-size', get_tileheader_fontsize(6, 0) + 'px');
		$('#tv' + tile[0]).css('top', get_tileview_top(6, 0) + 'px').css('width', get_tileview_w(6, 0) + 'px').css('height', get_tileview_h(6, 0) + 'px');
		if (tilestate[0] == true && tileinfo[0]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[0]).attr('iw');
			var ih = $('#te' + tile[0]).attr('ih');
			var vw = get_tileembed_w(mode, 0);
			var vh = get_tileembed_h(mode, 0);
			debug_append('cmd_mode() :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
			debug_append('cmd_mode() :: r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
			debug_append('cmd_mode() :: r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[0]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[0]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[0]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[0]).css('width', get_tileembed_w(6, 0) + 'px').css('height', get_tileembed_h(6, 0) + 'px');
			$('#te' + tile[0]).attr('width', get_tileembed_w(6, 0)).attr('height', get_tileembed_h(6, 0));
		}
		tilemode = mode;
	}
	if (tileinfo[0]['urltype'] == URLTYPE['YOUTUBE']) {
// 		debug_append('cmd_mode() :: tilemode = ' + tilemode + ', vq = ' + vqstr[get_vq(tilemode, 0)]);
		// change YouTube video quality of tile 0
		tileinfo[0]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, 0)]);
	}
}

function cmd_move(ti1, ti2) {
	debug_append('cmd_move() :: ti1 = ' + ti1 + ', ti2 = ' + ti2);
	debug_append('cmd_move() :: tilemode = ' + tilemode);
	if (tilemode == 1)
		return;
	if (tilemode == 4 || tilemode == 6) {
		if (ti1 == 0) {
			// moving a large tile to a small space

			// reduce video quality of now smaller tile
			if (tileinfo[ti1]['urltype'] == URLTYPE['YOUTUBE'])
				tileinfo[ti1]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti2)]);

			move_tileinfo(ti1, ti2);

			// shrink the source tile
			$('#t' + tile[ti1]).css('width', get_tile_w(tilemode, ti2) + 'px').css('height', get_tile_h(tilemode, ti2) + 'px');
			$('#tn' + tile[ti1]).css('width', get_tilenumber_size(tilemode, ti2) + 'px').css('height', get_tilenumber_size(tilemode, ti2) + 'px').css('font-size', get_tilenumber_size(tilemode, ti2) + 'px').css('line-height', get_tilenumber_size(tilemode, ti2) + 'px');
			$('#th' + tile[ti1]).css('left', get_tileheader_left(tilemode, ti2) + 'px').css('height', get_tileheader_h(tilemode, ti2) + 'px').css('padding', get_tileheader_padding(tilemode, ti2)).css('font-size', get_tileheader_fontsize(tilemode, ti2) + 'px');
			$('#tv' + tile[ti1]).css('top', get_tileview_top(tilemode, ti2) + 'px').css('width', get_tileview_w(tilemode, ti2) + 'px').css('height', get_tileview_h(tilemode, ti2) + 'px');
			if (tilestate[ti1] == true && tileinfo[ti2]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti1]).attr('iw');
				var ih = $('#te' + tile[ti1]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti2);
				var vh = get_tileembed_h(tilemode, ti2);
				debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti1]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti1]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti1]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti1]).css('width', get_tileembed_w(tilemode, ti2) + 'px').css('height', get_tileembed_h(tilemode, ti2) + 'px');
				$('#te' + tile[ti1]).attr('width', get_tileembed_w(tilemode, ti2)).attr('height', get_tileembed_h(tilemode, ti2));
			}

			// clear out destination tile
			$('#t' + tile[ti2]).css('visibility', 'hidden');
			$('#tn' + tile[ti2]).html('');
			$('#tn' + tile[ti2]).unbind();
			$('#th' + tile[ti2]).html('');
			$('#tv' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).css('visibility', 'hidden');
			$('#tfi' + tile[ti2]).attr('src', '');
			$('#tfi' + tile[ti2]).css('visibility', 'hidden');
			$('#tf' + tile[ti2]).css('visibility', 'hidden');

			// renumber the tile
			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2);});

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
			$('#t' + tile[ti2]).css('left', get_tile_x(tilemode, ti1) + 'px').css('top', get_tile_y(tilemode, ti1) + 'px');

			$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).click(function() { toggle_tile(tile[ti2]);});
			$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
			$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');


			// there is really no move in tile[].  it's always swap
			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);
		} else if (ti2 == 0) {
			// moving a small tile to a large space

			// increase video quality of now larger tile
			if (tileinfo[ti1]['urltype'] == URLTYPE['YOUTUBE'])
				tileinfo[ti1]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti2)]);

			move_tileinfo(ti1, ti2);

			// clear out the destination tile
			$('#t' + tile[ti2]).css('visibility', 'hidden');
			$('#tn' + tile[ti2]).html('');
			$('#tn' + tile[ti2]).unbind();
			$('#th' + tile[ti2]).html('');
			$('#tv' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).css('visibility', 'hidden');
			$('#tfi' + tile[ti2]).attr('src', '');
			$('#tfi' + tile[ti2]).css('visibility', 'hidden');
			$('#tf' + tile[ti2]).css('visibility', 'hidden');

			// renumber the tile
			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2);});

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');

			// resize the tile
			$('#t' + tile[ti1]).css('width', get_tile_w(tilemode, ti2) + 'px').css('height', get_tile_h(tilemode, ti2) + 'px');
			$('#tn' + tile[ti1]).css('width', get_tilenumber_size(tilemode, ti2) + 'px').css('height', get_tilenumber_size(tilemode, ti2) + 'px').css('font-size', get_tilenumber_size(tilemode, ti2) + 'px').css('line-height', get_tilenumber_size(tilemode, ti2) + 'px');
			$('#th' + tile[ti1]).css('left', get_tileheader_left(tilemode, ti2) + 'px').css('height', get_tileheader_h(tilemode, ti2) + 'px').css('padding', get_tileheader_padding(tilemode, ti2)).css('font-size', get_tileheader_fontsize(tilemode, ti2) + 'px');
			$('#tv' + tile[ti1]).css('top', get_tileview_top(tilemode, ti2) + 'px').css('width', get_tileview_w(tilemode, ti2) + 'px').css('height', get_tileview_h(tilemode, ti2) + 'px');
			if (tilestate[ti1] == true && tileinfo[ti2]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti1]).attr('iw');
				var ih = $('#te' + tile[ti1]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti2);
				var vh = get_tileembed_h(tilemode, ti2);
				debug_append('cmd_move() :: ti2 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti1]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti1]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti1]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti1]).css('width', get_tileembed_w(tilemode, ti2) + 'px').css('height', get_tileembed_h(tilemode, ti2) + 'px');
				$('#te' + tile[ti1]).attr('width', get_tileembed_w(tilemode, ti2)).attr('height', get_tileembed_h(tilemode, ti2));
			}
			$('#t' + tile[ti2]).css('left', get_tile_x(tilemode, ti1) + 'px').css('top', get_tile_y(tilemode, ti1) + 'px');

			$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
			$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
			$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');

			// there is really no move in tile[].  it's always swap
			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);
		} else {
			move_tileinfo(ti1, ti2);

			// clear out the destination tile
			$('#t' + tile[ti2]).css('visibility', 'hidden');
			$('#tn' + tile[ti2]).html('');
			$('#tn' + tile[ti2]).unbind();
			$('#th' + tile[ti2]).html('');
			$('#tv' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).html('');
			$('#tt' + tile[ti2]).css('visibility', 'hidden');
			$('#tfi' + tile[ti2]).attr('src', '');
			$('#tfi' + tile[ti2]).css('visibility', 'hidden');
			$('#tf' + tile[ti2]).css('visibility', 'hidden');

			// renumber the tile
			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2);});

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
			$('#t' + tile[ti2]).css('left', get_tile_x(tilemode, ti1) + 'px').css('top', get_tile_y(tilemode, ti1) + 'px');

			$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).click(function() { toggle_tile(tile[ti2]);});
			$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
			$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');

			// there is really no move in tile[].  it's always swap
			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);
		}
	}
	else if (tilemode == 9) {
		move_tileinfo(ti1, ti2);

		// clear out the destination tile
		$('#t' + tile[ti2]).css('visibility', 'hidden');
		$('#tn' + tile[ti2]).html('');
		$('#tn' + tile[ti2]).unbind();
		$('#th' + tile[ti2]).html('');
		$('#tv' + tile[ti2]).html('');

		// renumber the tile
		$('#tn' + tile[ti1]).html(ti2 + 1);
		$('#tn' + tile[ti1]).unbind();
		$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2);});

		// move the tile
		$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
		$('#t' + tile[ti2]).css('left', get_tile_x(tilemode, ti1) + 'px').css('top', get_tile_y(tilemode, ti1) + 'px');

		$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
		$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
		$('#tn' + tile[ti2]).click(function() { toggle_tile(tile[ti2]);});
		$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
		$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');

		// there is really no move in tile[].  it's always swap
		swap_tile(ti1, ti2);
		swap_tilestate(ti1, ti2);
	}
	if (tilemode == 4 || tilemode == 6 || tilemode == 9) {
// 		if (tileinfo[ti2]['f_sync']) {
// 			debug_append('cmd_move() :: ti1 = ' + ti1 + ', tile[ti1] = ' + tile[ti1]);
// 			debug_append('cmd_move() :: ti2 = ' + ti2 + ', tile[ti2] = ' + tile[ti2]);
// 			debug_append('cmd_move() :: tileinfo[ti2][f_sync] = ' + tileinfo[ti2]['f_sync']);
// 			$('#tai' + tile[ti2]).unbind();
// 			$('#tai' + tile[ti2]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 		}
		if (tileinfo[ti2]['ytobj'])
			tileinfo[ti2]['ytobj'].ti =  ti2;
	}
}

function cmd_mute(ti) {
// 	debug_append('cmd_mute() :: ti = ' + ti);
	if (tilestate[ti] == false)
		return;
	tileinfo[ti]['vol'] = 'm';
	if (tileinfo[ti]['urltype'] == URLTYPE['YOUTUBE']) {
		var ytobj = tileinfo[ti]['ytobj'];
		if (ytobj == null) {
// 			debug_append('cmd_mute() :: ti = ' + ti + ', ytobj == null');
			var id = 'te' + tile[ti];
			ytobj = new YT.Player(id, {
				events: {
					'onReady' : function(event) {
						event.target.mute();
// 						var ytobj = event.target;
// 						ytobj.ti = ti;
// 						set_tileinfo_ytobj(ti, ytobj);
// 						setTimeout(function() { event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]) }, 1000);
						event.target.ti = ti;
						tileinfo[ti]['ytobj'] = event.target;
						event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 					},
// 					'onStateChange' : function(event) {
// 						tileinfo[ti]['ytobj'] = event.target;
// 						tileinfo[ti]['ytobj'].state = event.data;
// 						ytobj_onstatechange(tileinfo[ti]['ytobj']);
					}
				}
			});
// 			set_tileinfo_ytobj(ti, new YT.Player(id));
// 			ytobj = tileinfo[ti]['ytobj'];
		} else
			ytobj.mute();
	}
}

function cmd_open(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol) {
	debug_append('cmd_open() :: ti = ' + ti + ', cid = ' + cid);
	var id = 'te' + tile[ti];
	var apiid = 'tapi' + tile[ti];
	var w = get_tileembed_w(tilemode, ti);
	var h = get_tileembed_h(tilemode, ti);
	var st = stime + calculate_offset(cid);
// 	debug_append('cmd_open() :: stime = ' + stime);
// 	debug_append('cmd_open() :: calculate_offset(cid) = ' +  calculate_offset(cid));
// 	debug_append('cmd_open() :: st = ' + st);
	var swfobj = get_swfobj(urltype, id, apiid, vid, param, w, h, st);
	if (swfobj) {
		$('#tn' + tile[ti]).html(ti + 1);
		$('#tn' + tile[ti]).unbind();
		$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
		if (title == '' || alias.toLowerCase() == title.toLowerCase())
			headertext = alias;
		else
			if (alias == '')
				headertext = title;
			else
				headertext = alias + ' : ' + title;
		$('#th' + tile[ti]).html(headertext);
		if (headertext != '') {
			$('#th' + tile[ti]).css('cursor', 'pointer');
			$('#th' + tile[ti]).unbind();
			$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
		} else {
			$('#th' + tile[ti]).css('cursor', 'default');
			$('#th' + tile[ti]).unbind();
		}
		$('#tv' + tile[ti]).html(swfobj);
		var f_ccode = false;
		var f_timeoffset = false;
		if (ccode != '') {
			$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
			$('#tfi' + tile[ti]).css('visibility', 'visible');
			$('#tf' + tile[ti]).css('visibility', 'visible');
			f_ccode = true;
		} else {
			$('#tfi' + tile[ti]).attr('src', '');
			$('#tff' + tile[ti]).css('visibility', 'hidden');
			$('#tf' + tile[ti]).css('visibility', 'hidden');
			f_ccode = false;
		}
		if (timeoffset != -1440) {
			$('#tt' + tile[ti]).html(get_timestring(timeoffset));
			$('#tt' + tile[ti]).css('visibility', 'visible');
			if (f_ccode)
				$('#tt' + tile[ti]).css('right', '20px');
			else
				$('#tt' + tile[ti]).css('right', '2px');
			f_timeoffset = true;
		} else {
			$('#tt' + tile[ti]).html('');
			$('#tt' + tile[ti]).css('visibility', 'hidden');
			f_timeoffset = false;
		}
		var header_right = 0;
		if (f_ccode)
			header_right = 18;
		if (f_timeoffset)
			header_right += 31;
		if (f_ccode || f_timeoffset)
			header_right += 2;
		$('#th' + tile[ti]).css('right', header_right + 'px');
		$('#t' + tile[ti]).css('width', get_tile_w(tilemode, ti) + 'px').css('height', get_tile_h(tilemode, ti) + 'px');
		$('#tn' + tile[ti]).css('width', get_tilenumber_size(tilemode, ti) + 'px').css('height', get_tilenumber_size(tilemode, ti) + 'px').css('font-size', get_tilenumber_size(tilemode, ti) + 'px').css('line-height', get_tilenumber_size(tilemode, ti) + 'px');
		$('#th' + tile[ti]).css('left', get_tileheader_left(tilemode, ti) + 'px').css('height', get_tileheader_h(tilemode, ti) + 'px').css('padding', get_tileheader_padding(tilemode, ti)).css('font-size', get_tileheader_fontsize(tilemode, ti) + 'px');
		$('#tv' + tile[ti]).css('top', get_tileview_top(tilemode, ti) + 'px').css('width', get_tileview_w(tilemode, ti) + 'px').css('height', get_tileview_h(tilemode, ti) + 'px');
		$('#te' + tile[ti]).attr('width', get_tileembed_w(tilemode, ti)).attr('height', get_tileembed_h(tilemode, ti));
		$('#t' + tile[ti]).css('visibility', 'visible');
	} else
		alert('swf object creation failure');
	set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol);
	tilestate[ti] = true;
}


// function cmd_open_image(ti, alias, cid, url) {
function cmd_open_image(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol) {
	debug_append('cmd_open_image() :: ti = ' + ti + ', cid = ' + cid + ', url = ' + url + ', urltype = ' + urltype);
	var id = 'te' + tile[ti];
	var embed_w = get_tileembed_w(tilemode, ti);
	var embed_h = get_tileembed_h(tilemode, ti);
	$('#tn' + tile[ti]).html(ti + 1);
	$('#tn' + tile[ti]).unbind();
	$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
	$('#th' + tile[ti]).html('');
	$('#th' + tile[ti]).css('right', '0px');

	$('#tv' + tile[ti]).html('<img id="te' + tile[ti] + '" class="tile-embed" src="img/spinner.gif" width="16" height="16" />');
	$('#te' + tile[ti]).css('top', Math.round((embed_h - 16) / 2)).css('left', Math.round((embed_w - 16) / 2));

	$('#t' + tile[ti]).css('width', get_tile_w(tilemode, ti) + 'px').css('height', get_tile_h(tilemode, ti) + 'px');
	$('#tn' + tile[ti]).css('width', get_tilenumber_size(tilemode, ti) + 'px').css('height', get_tilenumber_size(tilemode, ti) + 'px').css('font-size', get_tilenumber_size(tilemode, ti) + 'px').css('line-height', get_tilenumber_size(tilemode, ti) + 'px');
	$('#th' + tile[ti]).css('left', get_tileheader_left(tilemode, ti) + 'px').css('height', get_tileheader_h(tilemode, ti) + 'px').css('padding', get_tileheader_padding(tilemode, ti)).css('font-size', get_tileheader_fontsize(tilemode, ti) + 'px');
	$('#tv' + tile[ti]).css('top', get_tileview_top(tilemode, ti) + 'px').css('width', get_tileview_w(tilemode, ti) + 'px').css('height', get_tileview_h(tilemode, ti) + 'px');
	$('#t' + tile[ti]).css('visibility', 'visible');
	set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol);
	tilestate[ti] = true;

	var imgobj = new Image();
	imgobj.ti = ti;
	imgobj.vw = embed_w;
	imgobj.vh = embed_h;
	$(imgobj).bind('load', function() {
		var ti = this.ti;
// 		debug_append('cmd_open_image() :: load() :: ti = ' + ti);
// 		debug_append('cmd_open_image() :: load() :: this.src = ' + this.src);
		var iw = this.width;
		var ih = this.height;
// 		debug_append('cmd_open_image() :: load() :: loaded');
// 		debug_append('cmd_open_image() :: load() :: this.vw = ' + this.vw + ', this.vh = ' + this.vh);
// 		debug_append('cmd_open_image() :: load() :: width = ' + iw + ', height = ' + ih);
// 		debug_append('cmd_open_image() :: load() :: image ratio = ' + (iw / ih));
		var r = calculate_image_size(iw, ih, this.vw, this.vh);
		var riw = r['riw'];
		var rih = r['rih'];
		var offset_x = r['offset_x'];
		var offset_y = r['offset_y'];
		$('#te' + tile[ti]).attr('iw', iw).attr('ih', ih);
		$('#te' + tile[ti]).attr('src', this.src);
		$('#te' + tile[ti]).css('width', riw + 'px').css('height', rih + 'px');
		$('#te' + tile[ti]).css('top', offset_y).css('left', offset_x);
	});
	imgobj.src = url;
	tileinfo[ti]['imgobj'] = imgobj;
	debug_append('cmd_open_image() :: tileinfo[ti][urltype] = ' + tileinfo[ti]['urltype']);
}

function cmd_open_noautoplay(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol) {
	$('#tn' + tile[ti]).html(ti + 1);
	$('#tn' + tile[ti]).unbind();
	$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
	var headertext = '';
	if (title == '' || alias.toLowerCase() == title.toLowerCase())
		headertext = alias;
	else
		if (alias == '')
			headertext = title;
		else
			headertext = alias + ' : ' + title;
	$('#th' + tile[ti]).html(headertext);
	if (headertext != '') {
		$('#th' + tile[ti]).css('cursor', 'pointer');
		$('#th' + tile[ti]).unbind();
		$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
	} else {
		$('#th' + tile[ti]).css('cursor', 'default');
		$('#th' + tile[ti]).unbind();
	}
	$('#tv' + tile[ti]).html('<div id="te' + tile[ti] + '" class="tile-embed"></div>');
	$('#te' + tile[ti]).css('width', get_tileembed_w(tilemode, ti) + 'px').css('height', get_tileembed_h(tilemode, ti) + 'px').css('background', '#333333');
	var f_ccode = false;
	var f_timeoffset = false;
	if (ccode != '') {
		$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
		$('#tfi' + tile[ti]).css('visibility', 'visible');
		$('#tf' + tile[ti]).css('visibility', 'visible');
		f_ccode = true;
	} else {
		$('#tfi' + tile[ti]).attr('src', '');
		$('#tfi' + tile[ti]).css('visibility', 'hidden');
		$('#tf' + tile[ti]).css('visibility', 'hidden');
		f_ccode = false;
	}
	if (timeoffset != -1440) {
		$('#tt' + tile[ti]).html(get_timestring(timeoffset));
		$('#tt' + tile[ti]).css('visibility', 'visible');
		if (f_ccode)
			$('#tt' + tile[ti]).css('right', '20px');
		else
			$('#tt' + tile[ti]).css('right', '2px');
		f_timeoffset = true;
	} else {
		$('#tt' + tile[ti]).html('');
		$('#tt' + tile[ti]).css('visibility', 'hidden');
		f_timeoffset = false;
	}
	var header_right = 0;
	if (f_ccode)
		header_right = 18;
	if (f_timeoffset)
		header_right += 31;
	if (f_ccode || f_timeoffset)
		header_right += 2;
	$('#th' + tile[ti]).css('right', header_right + 'px');
	$('#t' + tile[ti]).css('width', get_tile_w(tilemode, ti) + 'px').css('height', get_tile_h(tilemode, ti) + 'px');
	$('#tn' + tile[ti]).css('width', get_tilenumber_size(tilemode, ti) + 'px').css('height', get_tilenumber_size(tilemode, ti) + 'px').css('font-size', get_tilenumber_size(tilemode, ti) + 'px').css('line-height', get_tilenumber_size(tilemode, ti) + 'px');
	$('#th' + tile[ti]).css('left', get_tileheader_left(tilemode, ti) + 'px').css('height', get_tileheader_h(tilemode, ti) + 'px').css('padding', get_tileheader_padding(tilemode, ti)).css('font-size', get_tileheader_fontsize(tilemode, ti) + 'px');
	$('#tv' + tile[ti]).css('top', get_tileview_top(tilemode, ti) + 'px').css('width', get_tileview_w(tilemode, ti) + 'px').css('height', get_tileview_h(tilemode, ti) + 'px');
	$('#te' + tile[ti]).attr('width', get_tileembed_w(tilemode, ti)).attr('height', get_tileembed_h(tilemode, ti));
	$('#t' + tile[ti]).css('visibility', 'visible');
	set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol);
	tilestate[ti] = false;
}

function cmd_open_yt(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol) {
	debug_append('cmd_open_yt() :: ti = ' + ti + ', cid = ' + cid);
	var id = 'te' + tile[ti];
	var apiid = 'tapi' + tile[ti];
	var w = get_tileembed_w(tilemode, ti);
	var h = get_tileembed_h(tilemode, ti);
	var st = stime + calculate_offset(cid);
// 	debug_append('cmd_open_yt() :: stime = ' + stime);
// 	debug_append('cmd_open_yt() :: calculate_offset(cid) = ' + calculate_offset(cid));
	debug_append('cmd_open_yt() :: st = ' + st);
	if (tilestate[ti] == true && tileinfo[ti]['urltype'] == URLTYPE['YOUTUBE']) {
		// if tile already has YouTube tile loaded, use the object in place to load the new video instead of destroying and creating new object
		if (tileinfo[ti]['ytobj'] == null) {
// 			debug_append('cmd_open_yt() :: ti = ' + ti + ', tileinfo[ti][ytobj] == null');
			var ytobj = new YT.Player(id, {
				events: {
					'onReady' : function(event) {
						if (vol == 'm')
							event.target.mute();
						event.target.ti = ti;
						tileinfo[ti]['ytobj'] = event.target;
						event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 					},
// 					'onStateChange' : function(event) {
// 						tileinfo[ti]['ytobj'] = event.target;
// 						tileinfo[ti]['ytobj'].state = event.data;
// 						ytobj_onstatechange(tileinfo[ti]['ytobj']);
					}
				}
			});
		}
		$('#tn' + tile[ti]).html(ti + 1);
		$('#tn' + tile[ti]).unbind();
		$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
		if (title == '' || alias.toLowerCase() == title.toLowerCase())
			headertext = alias;
		else
			if (alias == '')
				headertext = title;
			else
				headertext = alias + ' : ' + title;
		$('#th' + tile[ti]).html(headertext);
		if (headertext != '') {
			$('#th' + tile[ti]).css('cursor', 'pointer');
			$('#th' + tile[ti]).unbind();
			$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
		} else {
			$('#th' + tile[ti]).css('cursor', 'default');
			$('#th' + tile[ti]).unbind();
		}
		var ytobj = tileinfo[ti]['ytobj'];
		ytobj.loadVideoById(vid, st);
		var f_ccode = false;
		var f_timeoffset = false;
		if (ccode != '') {
			$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
			$('#tfi' + tile[ti]).css('visibility', 'visible');
			$('#tf' + tile[ti]).css('visibility', 'visible');
			f_ccode = true;
		} else {
			$('#tfi' + tile[ti]).attr('src', '');
			$('#tfi' + tile[ti]).css('visibility', 'hidden');
			$('#tf' + tile[ti]).css('visibility', 'hidden');
			f_ccode = false;
		}
		if (timeoffset != -1440) {
			$('#tt' + tile[ti]).html(get_timestring(timeoffset));
			$('#tt' + tile[ti]).css('visibility', 'visible');
			if (f_ccode)
				$('#tt' + tile[ti]).css('right', '20px');
			else
				$('#tt' + tile[ti]).css('right', '2px');
			f_timeoffset = true;
		} else {
			$('#tt' + tile[ti]).html('');
			$('#tt' + tile[ti]).css('visibility', 'hidden');
			f_timeoffset = false;
		}
		var header_right = 0;
		if (f_ccode)
			header_right = 18;
		if (f_timeoffset)
			header_right += 31;
		if (f_ccode || f_timeoffset)
			header_right += 2;
		$('#th' + tile[ti]).css('right', header_right + 'px');
		$('#t' + tile[ti]).css('width', get_tile_w(tilemode, ti) + 'px').css('height', get_tile_h(tilemode, ti) + 'px');
		$('#tn' + tile[ti]).css('width', get_tilenumber_size(tilemode, ti) + 'px').css('height', get_tilenumber_size(tilemode, ti) + 'px').css('font-size', get_tilenumber_size(tilemode, ti) + 'px').css('line-height', get_tilenumber_size(tilemode, ti) + 'px');
		$('#th' + tile[ti]).css('left', get_tileheader_left(tilemode, ti) + 'px').css('height', get_tileheader_h(tilemode, ti) + 'px').css('padding', get_tileheader_padding(tilemode, ti)).css('font-size', get_tileheader_fontsize(tilemode, ti) + 'px');
		$('#tv' + tile[ti]).css('top', get_tileview_top(tilemode, ti) + 'px').css('width', get_tileview_w(tilemode, ti) + 'px').css('height', get_tileview_h(tilemode, ti) + 'px');
		$('#te' + tile[ti]).attr('width', get_tileembed_w(tilemode, ti)).attr('height', get_tileembed_h(tilemode, ti));
		$('#t' + tile[ti]).css('visibility', 'visible');
		set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol);
		tileinfo[ti]['f_sync'] = false;
		tilestate[ti] = true;
		tileinfo[ti]['ytobj'] = ytobj;
		if (vol == 'm')
			ytobj.mute();
		else
			ytobj.unMute();
	} else {
		debug_append('cmd_open_yt() :: new tile');
		var swfobj = get_swfobj(urltype, id, apiid, vid, param, w, h, st);
		if (swfobj) {
			$('#tn' + tile[ti]).html(ti + 1);
			$('#tn' + tile[ti]).unbind();
			$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
			var headertext = '';
			if (title == '' || alias.toLowerCase() == title.toLowerCase())
				headertext = alias;
			else
				if (alias == '')
					headertext = title;
				else
					headertext = alias + ' : ' + title;
			$('#th' + tile[ti]).html(headertext);
			if (headertext != '') {
				$('#th' + tile[ti]).css('cursor', 'pointer');
				$('#th' + tile[ti]).unbind();
				$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
			} else {
				$('#th' + tile[ti]).css('cursor', 'default');
				$('#th' + tile[ti]).unbind();
			}
			$('#tv' + tile[ti]).html(swfobj);
			var f_ccode = false;
			var f_timeoffset = false;
			if (ccode != '') {
				$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
				$('#tfi' + tile[ti]).css('visibility', 'visible');
				$('#tf' + tile[ti]).css('visibility', 'visible');
				f_ccode = true;
			} else {
				$('#tfi' + tile[ti]).attr('src', '');
				$('#tfi' + tile[ti]).css('visibility', 'hidden');
				$('#tf' + tile[ti]).css('visibility', 'hidden');
				f_ccode = false;
			}
			if (timeoffset != -1440) {
				$('#tt' + tile[ti]).html(get_timestring(timeoffset));
				$('#tt' + tile[ti]).css('visibility', 'visible');
				if (f_ccode)
					$('#tt' + tile[ti]).css('right', '20px');
				else
					$('#tt' + tile[ti]).css('right', '2px');
				f_timeoffset = true;
			} else {
				$('#tt' + tile[ti]).html('');
				$('#tt' + tile[ti]).css('visibility', 'hidden');
				f_timeoffset = false;
			}
			var header_right = 0;
			if (f_ccode)
				header_right = 18;
			if (f_timeoffset)
				header_right += 31;
			if (f_ccode || f_timeoffset)
				header_right += 2;
			$('#th' + tile[ti]).css('right', header_right + 'px');
			$('#t' + tile[ti]).css('width', get_tile_w(tilemode, ti) + 'px').css('height', get_tile_h(tilemode, ti) + 'px');
			$('#tn' + tile[ti]).css('width', get_tilenumber_size(tilemode, ti) + 'px').css('height', get_tilenumber_size(tilemode, ti) + 'px').css('font-size', get_tilenumber_size(tilemode, ti) + 'px').css('line-height', get_tilenumber_size(tilemode, ti) + 'px');
			$('#th' + tile[ti]).css('left', get_tileheader_left(tilemode, ti) + 'px').css('height', get_tileheader_h(tilemode, ti) + 'px').css('padding', get_tileheader_padding(tilemode, ti)).css('font-size', get_tileheader_fontsize(tilemode, ti) + 'px');
			$('#tv' + tile[ti]).css('top', get_tileview_top(tilemode, ti) + 'px').css('width', get_tileview_w(tilemode, ti) + 'px').css('height', get_tileview_h(tilemode, ti) + 'px');
			$('#te' + tile[ti]).attr('width', get_tileembed_w(tilemode, ti)).attr('height', get_tileembed_h(tilemode, ti));
			$('#t' + tile[ti]).css('visibility', 'visible');
		} else
			alert('swf object creation failure');
		set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol);
		tileinfo[ti]['f_sync'] = false;
		tilestate[ti] = true;
		debug_append('cmd_open_yt() :: about to create ytobj, id = ' + id);
		var ytobj = new YT.Player(id, {
			events: {
				'onReady' : function(event) {
					if (vol == 'm')
						event.target.mute();
					debug_append('cmd_open_ti() :: setting quality, tilemode = ' + tilemode + ', ti = ' + ti);
					debug_append('cmd_open_ti() :: setting quality, get_vq(tilemode, ti) = ' + get_vq(tilemode, ti));
					debug_append('cmd_open_ti() :: setting quality, vqstr[get_vq(tilemode, ti)] = ' + vqstr[get_vq(tilemode, ti)]);
					event.target.ti = ti;
					tileinfo[ti]['ytobj'] = event.target;
					event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 					},
// 					'onStateChange' : function(event) {
// 						debug_append('cmd_open_yt() :: handling onStateChange event');
// 						tileinfo[ti]['ytobj'] = event.target;
// 						tileinfo[ti]['ytobj'].state = event.data;
// 						ytobj_onstatechange(tileinfo[ti]['ytobj']);
				}
// 					'onStateChange' : handle_onstatechange
			}
		});
// 		setTimeout(function() {
// 			debug_append('cmd_open_yt() :: after ytobj creation, ytobj.ti = ' + ytobj.ti);
// 		}, 2000);
	}
}


// function get_statestr(state) {
// 	var statestr = 'NULL';
// 	if (state == -1)
// 		statestr = 'UNSTARTED';
// 	else if (state == 0)
// 		statestr = 'ENDED';
// 	else if (state == 1)
// 		statestr = 'PLAYING';
// 	else if (state == 2)
// 		statestr = 'PAUSED';
// 	else if (state == 3)
// 		statestr = 'BUFFERING';
// 	else if (state == 5)
// 		statestr = 'VIDEO CUED';
// 	return statestr;
// }


function handle_onready(event) {
// 	if (vol == 'm')
// 		event.target.mute();
// 	var ytobj = event.target;
// 	ytobj.ti = ti;
// 	set_tileinfo_ytobj(ti, ytobj);
}

function handle_onstatechange(event) {
// 	debug_append('handle_onstatechange()');
// 	var state = event.data;
// 	var ytobj = event.target;
// 	debug_append('handle_onstatechange() :: state = ' + state + ' -- ' + get_statestr(state));
}











// function cmd_pause(ti) {
// 	var ytobj = tilemode[ti]['ytobj'];
// 	ytobj.pauseVideo();
// }
//
// function cmd_play(ti) {
// 	var ytobj = tilemode[ti]['ytobj'];
// 	ytobj.playVideo();
// }

function cmd_refreshpage() {
	window.location.reload();
}

function cmd_reload(ti) {
	if (ti >= tilemode)	// you can't refresh a tile that doesn't exist on current mode
		return;
	if (tileinfo[ti]['cid'] == 0)	// you can't refresh a tile that is vacant
		return;
	if (p_noautoplay == true && tilestate[ti] == false)	// you can't refresh a tile that's currently disabled
		return;
	var alias = tileinfo[ti]['alias'];
	var ccode = tileinfo[ti]['ccode'];
	var cid = tileinfo[ti]['cid'];
	var imgurl = tileinfo[ti]['imgurl'];
	var param = tileinfo[ti]['param'];
	var stime = tileinfo[ti]['stime'];
	var timeoffset = tileinfo[ti]['timeoffset'];
	var title = tileinfo[ti]['title'];
	var url = tileinfo[ti]['url'];
	var urltype = tileinfo[ti]['urltype'];
	var vid = tileinfo[ti]['vid'];
	var vol = tileinfo[ti]['vol'];

	var id = 'te' + tile[ti];
	var apiid = 'tapi' + tile[ti];
	var embed_w = get_tileembed_w(tilemode, ti);
	var embed_h = get_tileembed_h(tilemode, ti);
	var st = stime + calculate_offset(cid);
	if (tileinfo[ti]['urltype'] == URLTYPE['IMAGE']) {
		$('#tv' + tile[ti]).html('<img id="te' + tile[ti] + '" class="tile-embed" src="img/spinner.gif" width="16" height="16" />');
		$('#te' + tile[ti]).css('top', Math.round((embed_h - 16) / 2)).css('left', Math.round((embed_w - 16) / 2));
		$('#t' + tile[ti]).css('visibility', 'visible');
		var imgobj = new Image();
		imgobj.ti = ti;
		imgobj.vw = embed_w;
		imgobj.vh = embed_h;
		debug_append('toggle_tile() :: embed_w = ' + embed_w + ', embed_h = ' + embed_h);
		$(imgobj).bind('load', function() {
			var ti = this.ti;
			debug_append('cmd_reload() :: load() :: ti = ' + ti);
			debug_append('cmd_reload() :: load() :: this.src = ' + this.src);
			var iw = this.width;
			var ih = this.height;
			debug_append('cmd_reload() :: load() :: loaded');
			debug_append('cmd_reload() :: load() :: this.vw = ' + this.vw + ', this.vh = ' + this.vh);
			debug_append('cmd_reload() :: load() :: width = ' + iw + ', height = ' + ih);
			debug_append('cmd_reload() :: load() :: image ratio = ' + (iw / ih));
			var r = calculate_image_size(iw, ih, this.vw, this.vh);
			var riw = r['riw'];
			var rih = r['rih'];
			var offset_x = r['offset_x'];
			var offset_y = r['offset_y'];
			$('#te' + tile[ti]).attr('iw', iw);
			$('#te' + tile[ti]).attr('ih', ih);
			$('#te' + tile[ti]).attr('src', this.src);
			$('#te' + tile[ti]).css('width', riw + 'px').css('height', rih + 'px');
			$('#te' + tile[ti]).css('top', offset_y).css('left', offset_x);
// 				$('#te' + tile[ti]).css('background', null);
		});
		debug_append('toggle_tile() :: tileinfo[ti].url = ' + tileinfo[ti].url);
		imgobj.src = tileinfo[ti].url;
		tileinfo[ti]['imgobj'] = imgobj;
	} else {
		var swfobj = get_swfobj(urltype, id, apiid, vid, param, embed_w, embed_h, st);
		if (swfobj) {
			$('#tn' + tile[ti]).html(ti + 1);
			$('#tn' + tile[ti]).unbind();
			$('#tn' + tile[ti]).click(function() { toggle_tile(ti); });
			if (title == '' || alias.toLowerCase() == title.toLowerCase())
				headertext = alias;
			else
				if (alias == '')
					headertext = title;
				else
					headertext = alias + ' : ' + title;
			$('#th' + tile[ti]).html(headertext);
			if (headertext != '') {
				$('#th' + tile[ti]).css('cursor', 'pointer');
				$('#th' + tile[ti]).unbind();
				$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
			} else {
				$('#th' + tile[ti]).css('cursor', 'default');
				$('#th' + tile[ti]).unbind();
			}
			$('#tv' + tile[ti]).html(swfobj);
			var f_ccode = false;
			var f_timeoffset = false;
			if (ccode != '') {
				$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
				$('#tfi' + tile[ti]).css('visibility', 'visible');
				$('#tf' + tile[ti]).css('visibility', 'visible');
				f_ccode = true;
			} else {
				$('#tfi' + tile[ti]).attr('src', '');
				$('#tfi' + tile[ti]).css('visibility', 'hidden');
				$('#tf' + tile[ti]).css('visibility', 'hidden');
				f_ccode = false;
			}
			if (timeoffset != -1440) {
				$('#tt' + tile[ti]).html(get_timestring(timeoffset));
				$('#tt' + tile[ti]).css('visibility', 'visible');
				if (f_ccode)
					$('#tt' + tile[ti]).css('right', '20px');
				else
					$('#tt' + tile[ti]).css('right', '2px');
				f_timeoffset = true;
			} else {
				$('#tt' + tile[ti]).html('');
				$('#tt' + tile[ti]).css('visibility', 'hidden');
				f_timeoffset = false;
			}
			var header_right = 0;
			if (f_ccode)
				header_right = 18;
			if (f_timeoffset)
				header_right += 31;
			if (f_ccode || f_timeoffset)
				header_right += 2;
			$('#th' + tile[ti]).css('right', header_right + 'px');
			$('#t' + tile[ti]).css('visibility', 'visible');
		} else
			alert('swf object creation failure');
	}
	if (tileinfo[ti]['urltype'] == URLTYPE['YOUTUBE']) {
		var ytobj = new YT.Player(id, {
			events: {
				'onReady' : function(event) {
					if (vol == 'm')
						event.target.mute();
					event.target.ti = ti;
					tileinfo[ti]['ytobj'] = event.target;
					event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 				},
// 				'onStateChange' : function(event) {
// 					tileinfo[ti]['ytobj'] = event.target;
// 					tileinfo[ti]['ytobj'].state = event.data;
// 					ytobj_onstatechange(tileinfo[ti]['ytobj']);
				}
			}
		});
	}
// 		set_tileinfo_ytobj(ti, ytobj);
}


// function cmd_reloadall() {
// 	for (i = 0; i < tilemode; i++)
// 		cmd_reload(i);
// }

// cmd_replay only works for YouTube videos
function cmd_replay(ti) {
	debug_append('cmd_replay() :: ti = ' + ti);
	var stime = tileinfo[ti]['stime'];
	var ytobj = tileinfo[ti]['ytobj'];
	if (ytobj == null) {
		debug_append('cmd_replay() :: ti = ' + ti + ', ytobj == null');
		var id = 'te' + tile[ti];
		var ytobj = new YT.Player(id, {
			events: {
				'onReady' : function(event) {
					if (vol == 'm')
						event.target.mute();
					event.target.ti = ti;
					tileinfo[ti]['ytobj'] = event.target;
					event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 				},
// 				'onStateChange' : function(event) {
// 					tileinfo[ti]['ytobj'] = event.target;
// 					tileinfo[ti]['ytobj'].state = event.data;
// 					ytobj_onstatechange(tileinfo[ti]['ytobj']);
				}
			}
		});
// 		set_tileinfo_ytobj(ti, new YT.Player(id));
	} else {
// 		hide_sync(ti);
		ytobj.seekTo(stime, true);
		var state = ytobj.getPlayerState();
		if (state != 1)
			ytobj.playVideo();
	}
}

function cmd_setmeta(ti, ccode, param, timeoffset) {
	var oldparam = tileinfo[ti]['param'];
	set_tileinfo_meta(ti, ccode, param, timeoffset);
	var f_ccode = false;
	var f_timeoffset = false;
	if (ccode != '') {
		$('#tfi' + tile[ti]).attr('src', flag_img_urlbase + ccode + '.png');
		$('#tfi' + tile[ti]).css('visibility', 'visible');
		$('#tf' + tile[ti]).css('visibility', 'visible');
		f_ccode = true;
	} else {
		$('#tfi' + tile[ti]).attr('src', '');
		$('#tfi' + tile[ti]).css('visibility', 'hidden');
		$('#tf' + tile[ti]).css('visibility', 'hidden');
		f_ccode = false;
	}
	if (timeoffset != -1440) {
		$('#tt' + tile[ti]).html(get_timestring(timeoffset));
		$('#tt' + tile[ti]).css('visibility', 'visible');
		if (f_ccode)
			$('#tt' + tile[ti]).css('right', '20px');
		else
			$('#tt' + tile[ti]).css('right', '2px');
		f_timeoffset = true;
	} else {
		$('#tt' + tile[ti]).html('');
		$('#tt' + tile[ti]).css('visibility', 'hidden');
		f_timeoffset = false;
	}
	var header_right = 0;
	if (f_ccode)
		header_right = 18;
	if (f_timeoffset)
		header_right += 31;
	if (tileinfo[ti]['f_sync']) {
		$('#ta' + tile[ti]).css('right', (header_right + 2) + 'px');
		header_right += 16;
	}
	if (f_ccode || f_timeoffset || tileinfo[ti]['f_sync'])
		header_right += 2;
	$('#th' + tile[ti]).css('right', header_right + 'px');
	if (oldparam != param && (tileinfo[ti]['urltype'] == URLTYPE['USTREAML'] || tileinfo[ti]['urltype'] == URLTYPE['USTREAMR']))
		cmd_reload(ti);
}

function cmd_swap(ti1, ti2) {
	if (tilemode == 1)
		return;
	if (tilemode == 4 || tilemode == 6) {
		if (ti1 == 0) {
// 			if (tileinfo[ti1]['f_sync']) {
// 				$('#tai' + tile[ti1]).unbind();
// 				$('#tai' + tile[ti1]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 			}

			if (tileinfo[ti1]['urltype'] == URLTYPE['YOUTUBE']) {
				if (tileinfo[ti1]['ytobj'])
					tileinfo[ti1]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti2)]);
			}
			if (tileinfo[ti2]['urltype'] == URLTYPE['YOUTUBE']) {
				if (tileinfo[ti2]['ytobj'])
					tileinfo[ti2]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti1)]);
			}

			swap_tileinfo(ti1, ti2);

			// shrink the tile first
			$('#t' + tile[ti1]).css('width', get_tile_w(tilemode, ti2) + 'px').css('height', get_tile_h(tilemode, ti2) + 'px');
			$('#tn' + tile[ti1]).css('width', get_tilenumber_size(tilemode, ti2) + 'px').css('height', get_tilenumber_size(tilemode, ti2) + 'px').css('font-size', get_tilenumber_size(tilemode, ti2) + 'px').css('line-height', get_tilenumber_size(tilemode, ti2) + 'px');
			$('#th' + tile[ti1]).css('left', get_tileheader_left(tilemode, ti2) + 'px').css('height', get_tileheader_h(tilemode, ti2) + 'px').css('padding', get_tileheader_padding(tilemode, ti2)).css('font-size', get_tileheader_fontsize(tilemode, ti2) + 'px');
			$('#tv' + tile[ti1]).css('top', get_tileview_top(tilemode, ti2) + 'px').css('width', get_tileview_w(tilemode, ti2) + 'px').css('height', get_tileview_h(tilemode, ti2) + 'px');
			if (tilestate[ti1] == true && tileinfo[ti2]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti1]).attr('iw');
				var ih = $('#te' + tile[ti1]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti2);
				var vh = get_tileembed_h(tilemode, ti2);
				debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti1]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti1]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti1]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti1]).css('width', get_tileembed_w(tilemode, ti2) + 'px').css('height', get_tileembed_h(tilemode, ti2) + 'px');
				$('#te' + tile[ti1]).attr('width', get_tileembed_w(tilemode, ti2)).attr('height', get_tileembed_h(tilemode, ti2));
			}

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
			$('#t' + tile[ti2]).animate({'left': get_tile_x(tilemode, ti1) + 'px', 'top': get_tile_y(tilemode, ti1) + 'px'}, 'fast');

			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2); });
			$('#tn' + tile[ti2]).html(ti1 + 1);
			$('#tn' + tile[ti2]).unbind();
			$('#tn' + tile[ti2]).click(function() { toggle_tile(ti1); });

			// expand the second tile in new position
			$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
			$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
			$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');
			if (tilestate[ti2] == true && tileinfo[ti1]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti2]).attr('iw');
				var ih = $('#te' + tile[ti2]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti1);
				var vh = get_tileembed_h(tilemode, ti1);
				debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti2]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti2]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti2]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti2]).css('width', get_tileembed_w(tilemode, ti1) + 'px').css('height', get_tileembed_h(tilemode, ti1) + 'px');
				$('#te' + tile[ti2]).attr('width', get_tileembed_w(tilemode, ti1)).attr('height', get_tileembed_h(tilemode, ti1));
			}

			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);

		} else if (ti2 == 0) {
// 			if (tileinfo[ti1]['f_sync']) {
// 				$('#tai' + tile[ti1]).unbind();
// 				$('#tai' + tile[ti1]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 			}

			if (tileinfo[ti1]['urltype'] == URLTYPE['YOUTUBE']) {
				if (tileinfo[ti1]['ytobj'])
					tileinfo[ti1]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti2)]);
			}
			if (tileinfo[ti2]['urltype'] == URLTYPE['YOUTUBE']) {
				if (tileinfo[ti2]['ytobj'])
					tileinfo[ti2]['ytobj'].setPlaybackQuality(vqstr[get_vq(tilemode, ti1)]);
			}

			swap_tileinfo(ti1, ti2);

			// shrink the second tile first
			$('#t' + tile[ti2]).css('width', get_tile_w(tilemode, ti1) + 'px').css('height', get_tile_h(tilemode, ti1) + 'px');
			$('#tn' + tile[ti2]).css('width', get_tilenumber_size(tilemode, ti1) + 'px').css('height', get_tilenumber_size(tilemode, ti1) + 'px').css('font-size', get_tilenumber_size(tilemode, ti1) + 'px').css('line-height', get_tilenumber_size(tilemode, ti1) + 'px');
			$('#th' + tile[ti2]).css('left', get_tileheader_left(tilemode, ti1) + 'px').css('height', get_tileheader_h(tilemode, ti1) + 'px').css('padding', get_tileheader_padding(tilemode, ti1)).css('font-size', get_tileheader_fontsize(tilemode, ti1) + 'px');
			$('#tv' + tile[ti2]).css('top', get_tileview_top(tilemode, ti1) + 'px').css('width', get_tileview_w(tilemode, ti1) + 'px').css('height', get_tileview_h(tilemode, ti1) + 'px');
			if (tilestate[ti2] == true && tileinfo[ti1]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti2]).attr('iw');
				var ih = $('#te' + tile[ti2]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti1);
				var vh = get_tileembed_h(tilemode, ti1);
				debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti2]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti2]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti2]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti2]).css('width', get_tileembed_w(tilemode, ti1) + 'px').css('height', get_tileembed_h(tilemode, ti1) + 'px');
				$('#te' + tile[ti2]).attr('width', get_tileembed_w(tilemode, ti1)).attr('height', get_tileembed_h(tilemode, ti1));
			}

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
			$('#t' + tile[ti2]).animate({'left': get_tile_x(tilemode, ti1) + 'px', 'top': get_tile_y(tilemode, ti1) + 'px'}, 'fast');

			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2); });
			$('#tn' + tile[ti2]).html(ti1 + 1);
			$('#tn' + tile[ti2]).unbind();
			$('#tn' + tile[ti2]).click(function() { toggle_tile(ti1); });

			// expand the first tile in new position
			$('#t' + tile[ti1]).css('width', get_tile_w(tilemode, ti2) + 'px').css('height', get_tile_h(tilemode, ti2) + 'px');
			$('#tn' + tile[ti1]).css('width', get_tilenumber_size(tilemode, ti2) + 'px').css('height', get_tilenumber_size(tilemode, ti2) + 'px').css('font-size', get_tilenumber_size(tilemode, ti2) + 'px').css('line-height', get_tilenumber_size(tilemode, ti2) + 'px');
			$('#th' + tile[ti1]).css('left', get_tileheader_left(tilemode, ti2) + 'px').css('height', get_tileheader_h(tilemode, ti2) + 'px').css('padding', get_tileheader_padding(tilemode, ti2)).css('font-size', get_tileheader_fontsize(tilemode, ti2) + 'px');
			$('#tv' + tile[ti1]).css('top', get_tileview_top(tilemode, ti2) + 'px').css('width', get_tileview_w(tilemode, ti2) + 'px').css('height', get_tileview_h(tilemode, ti2) + 'px');
			if (tilestate[ti1] == true && tileinfo[ti2]['urltype'] == URLTYPE['IMAGE']) {
				var iw = $('#te' + tile[ti1]).attr('iw');
				var ih = $('#te' + tile[ti1]).attr('ih');
				var vw = get_tileembed_w(tilemode, ti2);
				var vh = get_tileembed_h(tilemode, ti2);
				debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
				var r = calculate_image_size(iw, ih, vw, vh);
				debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
				debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
				$('#te' + tile[ti1]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
				$('#te' + tile[ti1]).attr('width', r['riw']).attr('height', r['rih']);
				$('#te' + tile[ti1]).css('top', r['offset_y']).css('left', r['offset_x']);
			} else {
				$('#te' + tile[ti1]).css('width', get_tileembed_w(tilemode, ti2) + 'px').css('height', get_tileembed_h(tilemode, ti2) + 'px');
				$('#te' + tile[ti1]).attr('width', get_tileembed_w(tilemode, ti2)).attr('height', get_tileembed_h(tilemode, ti2));
			}

			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);
		} else {
// 			if (tileinfo[ti1]['f_sync']) {
// 				$('#tai' + tile[ti1]).unbind();
// 				$('#tai' + tile[ti1]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 			}

			swap_tileinfo(ti1, ti2);

			// move the tile
			$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
			$('#t' + tile[ti2]).animate({'left': get_tile_x(tilemode, ti1) + 'px', 'top': get_tile_y(tilemode, ti1) + 'px'}, 'fast');

			$('#tn' + tile[ti1]).html(ti2 + 1);
			$('#tn' + tile[ti1]).unbind();
			$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2); });
			$('#tn' + tile[ti2]).html(ti1 + 1);
			$('#tn' + tile[ti2]).unbind();
			$('#tn' + tile[ti2]).click(function() { toggle_tile(ti1); });

			swap_tile(ti1, ti2);
			swap_tilestate(ti1, ti2);
		}
	}
	else if (tilemode == 9) {
// 		if (tileinfo[ti1]['f_sync']) {
// 			$('#tai' + tile[ti1]).unbind();
// 			$('#tai' + tile[ti1]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 		}

		swap_tileinfo(ti1, ti2);

		// move the tile
		$('#t' + tile[ti1]).animate({'left': get_tile_x(tilemode, ti2) + 'px', 'top': get_tile_y(tilemode, ti2) + 'px'}, 'fast');
		$('#t' + tile[ti2]).animate({'left': get_tile_x(tilemode, ti1) + 'px', 'top': get_tile_y(tilemode, ti1) + 'px'}, 'fast');

		$('#tn' + tile[ti1]).html(ti2 + 1);
		$('#tn' + tile[ti1]).unbind();
		$('#tn' + tile[ti1]).click(function() { toggle_tile(ti2); });
		$('#tn' + tile[ti2]).html(ti1 + 1);
		$('#tn' + tile[ti2]).unbind();
		$('#tn' + tile[ti2]).click(function() { toggle_tile(ti1); });

		swap_tile(ti1, ti2);
		swap_tilestate(ti1, ti2);
	}
	if (tilemode == 4 || tilemode == 6 || tilemode == 9) {
// 		if (tileinfo[ti1]['f_sync']) {
// 			debug_append('cmd_swap() :: ti1 = ' + ti1 + ', tile[ti1] = ' + tile[ti1]);
// 			debug_append('cmd_swap() :: ti2 = ' + ti2 + ', tile[ti2] = ' + tile[ti2]);
// 			debug_append('cmd_swap() :: tileinfo[ti1][f_sync] = ' + tileinfo[ti1]['f_sync']);
// 			$('#tai' + tile[ti1]).unbind();
// 			$('#tai' + tile[ti1]).click(function() { sync_tile(ti1); hide_sync(ti1); });
// 		}
// 		if (tileinfo[ti2]['f_sync']) {
// 			debug_append('cmd_swap() :: ti1 = ' + ti1 + ', tile[ti1] = ' + tile[ti1]);
// 			debug_append('cmd_swap() :: ti2 = ' + ti2 + ', tile[ti2] = ' + tile[ti2]);
// 			debug_append('cmd_swap() :: tileinfo[ti2][f_sync] = ' + tileinfo[ti2]['f_sync']);
// 			$('#tai' + tile[ti2]).unbind();
// 			$('#tai' + tile[ti2]).click(function() { sync_tile(ti2); hide_sync(ti2); });
// 		}
		if (tileinfo[ti1]['imgobj'])
			tileinfo[ti1]['imgobj'].ti =  ti1;

		if (tileinfo[ti2]['imgobj'])
			tileinfo[ti2]['imgobj'].ti =  ti2;

		if (tileinfo[ti1]['ytobj'])
			tileinfo[ti1]['ytobj'].ti =  ti1;

		if (tileinfo[ti2]['ytobj'])
			tileinfo[ti2]['ytobj'].ti =  ti2;
	}
}

function cmd_unmute(ti) {
	if (tilestate[ti] == false)
		return;
	tileinfo[ti]['vol'] = '';
	if (tileinfo[ti]['urltype'] == URLTYPE['YOUTUBE']) {
		var ytobj = tileinfo[ti]['ytobj'];
		if (ytobj == null) {
			var id = 'te' + tile[ti];
			ytobj = new YT.Player(id, {
				events: {
					'onReady' : function(event) {
// 						if (vol == 'm')
// 							event.target.mute();
// 						var ytobj = event.target;
// 						ytobj.ti = ti;
// 						set_tileinfo_ytobj(ti, ytobj);
// 						setTimeout(function() { event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]) }, 1000);
						event.target.ti = ti;
						tileinfo[ti]['ytobj'] = event.target;
						event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 					},
// 					'onStateChange' : function(event) {
// 						tileinfo[ti]['ytobj'] = event.target;
// 						tileinfo[ti]['ytobj'].state = event.data;
// 						ytobj_onstatechange(tileinfo[ti]['ytobj']);
					}
				}
			});
		} else
			ytobj.unMute();
	}
}

function get_currentsec() {
	var d = new Date();
	return d.getSeconds();
}

// function get_local_cid() {
// 	var d = new Date();
// 	var utcms = d.valueOf();
// 	return Math.floor((utcms - (CIDOFFSET * 10)) / 10);
// }

function get_local_cid() {
	var d = new Date();
	return (Math.floor((d.valueOf() - (CIDOFFSET * 10)) / 10) * 100) + (CIDSEED++ % 100);
}

function get_swfobj(urltype, id, apiid, vid, param, w, h, st) {
	switch (urltype) {
		case URLTYPE['ATOM']:
			return swfcreate_atom(id, vid, w, h);
			break;
		case URLTYPE['BING']:
			return swfcreate_bing(id, vid, w, h);
			break;
		case URLTYPE['BLIPTV']:
			return swfcreate_bliptv(id, vid, w, h);
			break;
		case URLTYPE['CURRENT']:
			return swfcreate_current(id, vid, w, h);
			break;
		case URLTYPE['DAILYMOTION']:
			return swfcreate_dailymotion(id, vid, w, h, st);
			break;
		case URLTYPE['FORATVL']:
			return swfcreate_foratv_live(id, vid, w, h);
			break;
		case URLTYPE['FORATVR']:
			return swfcreate_foratv_recorded(id, vid, w, h);
			break;
		case URLTYPE['FUNNYORDIE']:
			return swfcreate_funnyordie(id, vid, w, h);
			break;
		case URLTYPE['GOOGLEVIDEO']:
			return swfcreate_googlevideo(id, vid, w, h, st);
			break;
		case URLTYPE['GPLUSHANGOUT']:
			return swfcreate_gplushangout(id, apiid, vid, w, h, st);
			break;
/*		case URLTYPE['HULU']:
			return swfcreate_hulu(id, vid, w, h);
			break;*/
		case URLTYPE['JUSTINTVL']:
			return swfcreate_justintv_live(id, vid, w, h);
			break;
		case URLTYPE['JUSTINTVR']:
			return swfcreate_justintv_recorded(id, vid, w, h);
			break;
		case URLTYPE['LIVELEAK']:
			return swfcreate_liveleak(id, vid, w, h);
			break;
		case URLTYPE['LIVESTREAML']:
			return swfcreate_livestream_live(id, vid, w, h);
			break;
		case URLTYPE['LIVESTREAMR']:
			return swfcreate_livestream_recorded(id, vid, w, h);
			break;
		case URLTYPE['METACAFE']:
			return swfcreate_metacafe(id, vid, w, h);
			break;
		case URLTYPE['MITOCW']:
			return swfcreate_mitocw(id, apiid, vid, w, h, st);
			break;
		case URLTYPE['MITTECHTV']:
			return swfcreate_mittechtv(id, vid, w, h);
			break;
		case URLTYPE['MYSPACE']:
			return swfcreate_myspace(id, vid1, w, h, st);
			break;
		case URLTYPE['QIKL']:
			return swfcreate_qik_live(id, vid, w, h);
			break;
		case URLTYPE['QIKR']:
			return swfcreate_qik_recorded(id, vid, w, h);
			break;
		case URLTYPE['REVISION3']:
			return swfcreate_revision3(id, vid, w, h, st);
			break;
		case URLTYPE['REVVER']:
			return swfcreate_revver(id, vid, w, h);
			break;
		case URLTYPE['TED']:
			return swfcreate_ted(id, vid, w, h);
			break;
		case URLTYPE['TWITCHTVL']:
			return swfcreate_twitchtv_live(id, vid, w, h);
			break;
		case URLTYPE['TWITCHTVR']:
			return swfcreate_twitchtv_recorded(id, vid, w, h);
			break;
		case URLTYPE['USTREAML']:
			return swfcreate_ustream_live(id, vid, param, w, h);
			break;
		case URLTYPE['USTREAMR']:
			return swfcreate_ustream_recorded(id, vid, param, w, h);
			break;
		case URLTYPE['VEOH']:
			return swfcreate_veoh(id, vid, w, h);
			break;
		case URLTYPE['VIDDLER']:
			return swfcreate_viddler(id, vid, w, h);
			break;
		case URLTYPE['VIMEO']:
			return swfcreate_vimeo(id, vid, w, h);
			break;
		case URLTYPE['YOUTUBE']:
			return swfcreate_youtube(id, apiid, vid, w, h, st);
			break;
	}
}


// var ww = $(window).width() - ($(window).width() % 3);
// var wh = ($(window).height() - header_height) - (($(window).height() - header_height) % 3);
//
// var tw = ww / 3;
// var th = wh / 3;




// function get_tile_h(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return th33;
// 	if (mode == 4 && ti == 0)
// 		return th32;
// 	if (mode == 6 && ti == 0)
// 		return th22;
// 	return th;
// }



function get_tile_h(mode, ti) {
	if (mode == 1 && ti == 0)
		return $(window).height() - header_height;
// 		return $(window).height() - (header_height + 10);

	var wh = ($(window).height() - header_height) - (($(window).height() - header_height) % 3);
	var th = wh / 3;
// 	if (mode == 1 && ti == 0)
// 		return th * 3;

	if (mode == 4 && ti == 0)
		return th * 2;

	if (mode == 6 && ti == 0)
		return th * 2;

	return th;
}


/*
function get_tile_w(mode, ti) {
	if (mode == 1 && ti == 0)
		return tw33;
	if (mode == 4 && ti == 0)
		return tw32;
	if (mode == 6 && ti == 0)
		return tw22;
	return tw;
}
*/

function get_tile_w(mode, ti) {
	if (mode == 1 && ti == 0)
		return $(window).width();
// 		return $(window).width() - 10;

	var ww = $(window).width() - ($(window).width() % 3);
	var tw = ww / 3;

// 	if (mode == 1 && ti == 0)
// 		return tw * 3;
	if (mode == 4 && ti == 0)
		return tw * 3;
	if (mode == 6 && ti == 0)
		return tw * 2;
	return tw;
}


/*
function get_tile_x(mode, ti) {
	if (mode == 1) {
		if (ti == 0)
			return mleft;
	} else if (mode == 4) {
		switch (ti) {
			case 0:
			case 1:
				return mleft;
			case 2:
				return mleft + tw;
			case 3:
				return mleft + (2 * tw);
		}
	} else if (mode == 6) {
		switch (ti) {
			case 0:
			case 3:
				return mleft;
			case 1:
			case 2:
			case 5:
				return mleft + (2 * tw);
			case 4:
				return mleft + tw;
		}
	} else if (mode == 9)
		return (ti % 3) * tw + mleft;
}
*/


function get_tile_x(mode, ti) {
	var ww = $(window).width() - ($(window).width() % 3);
	var tw = ww / 3;
	if (mode == 1) {
		if (ti == 0)
			return mleft;
	} else if (mode == 4) {
		switch (ti) {
			case 0:
			case 1:
				return mleft;
			case 2:
				return mleft + tw;
			case 3:
				return mleft + (2 * tw);
		}
	} else if (mode == 6) {
		switch (ti) {
			case 0:
			case 3:
				return mleft;
			case 1:
			case 2:
			case 5:
				return mleft + (2 * tw);
			case 4:
				return mleft + tw;
		}
	} else if (mode == 9)
		return (ti % 3) * tw + mleft;
}



// function get_tile_y(mode, ti) {
// 	if (mode == 1) {
// 		if (ti == 0)
// 			return mtop;
// 	} else if (mode == 4) {
// 		switch (ti) {
// 			case 0:
// 				return mtop;
// 			case 1:
// 			case 2:
// 			case 3:
// 				return mtop + (2 * th);
// 		}
// 	} else if (mode == 6) {
// 		switch (ti) {
// 			case 0:
// 			case 1:
// 				return mtop;
// 			case 2:
// 				return mtop + th;
// 			case 3:
// 			case 4:
// 			case 5:
// 				return mtop + (2 * th);
// 		}
// 	} else if (mode == 9)
// 		return Math.floor(ti / 3) * th + mtop;
// }




function get_tile_y(mode, ti) {
	var wh = ($(window).height() - header_height) - (($(window).height() - header_height) % 3);
	var th = wh / 3;
	if (mode == 1) {
		if (ti == 0)
			return mtop + header_height;
	} else if (mode == 4) {
		switch (ti) {
			case 0:
				return mtop + header_height;
			case 1:
			case 2:
			case 3:
				return mtop + header_height + (2 * th);
		}
	} else if (mode == 6) {
		switch (ti) {
			case 0:
			case 1:
				return mtop + header_height;
			case 2:
				return mtop + header_height + th;
			case 3:
			case 4:
			case 5:
				return mtop + header_height + (2 * th);
		}
	} else if (mode == 9)
		return Math.floor(ti / 3) * th + mtop + header_height;
}






/*
function get_tileembed_h(mode, ti) {
	if (mode == 1 && ti == 0)
		return teh33;
	if (mode == 4 && ti == 0)
		return teh32;
	if (mode == 6 && ti == 0)
		return teh22;
	return teh;
}*/


/*
 * 860 - 24 = 836
 * 836 - 28 =
*/


function get_tileembed_h(mode, ti) {
	if (mode == 1 && ti == 0)
		return ($(window).height() - header_height) - (tile_header_height[1] + 3);
// 		return ($(window).height() - header_height) - (tile_header_height[1] + 3 + 3);

	var wh = ($(window).height() - header_height) - (($(window).height() - header_height) % 3);
	var th = wh / 3;

	if (mode == 4 && ti == 0)
		return (th * 2) - (tile_header_height[4] + 3);
	if (mode == 6 && ti == 0)
		return (th * 2) - (tile_header_height[6] + 3);
	return th - (tile_header_height[9] + 3);
}







// function get_tileembed_w(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tew33;
// 	if (mode == 4 && ti == 0)
// 		return tew32;
// 	if (mode == 6 && ti == 0)
// 		return tew22;
// 	return tew;
// }





function get_tileembed_w(mode, ti) {
	if (mode == 1 && ti == 0)
		return $(window).width() - 2;
// 		return $(window).width() - (2 + 3);

	var ww = $(window).width() - ($(window).width() % 3);
	var tw = ww / 3;

	if (mode == 4 && ti == 0)
		return (tw * 3) - 2;
	if (mode == 6 && ti == 0)
		return (tw * 2) - 2;
	return tw - 2;
}




/*
function get_tilenumber_size(mode, ti) {
	if (mode == 1 && ti == 0)
		return tns33;
	if (mode == 4 && ti == 0)
		return tns32;
	if (mode == 6 && ti == 0)
		return tns22;
	return tns;
}
*/

function get_tilenumber_size(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tile_number_size[1];
// 	if (mode == 4 && ti == 0)
// 		return tile_number_size[4];
// 	if (mode == 6 && ti == 0)
// 		return tile_number_size[6];
// 	return tile_number_size[9];
	if (ti == 0)
		return tile_number_size[mode];
	return tile_number_size[9];
}


/*
function get_tileheader_h(mode, ti) {
	if (mode == 1 && ti == 0)
		return thh33;
	if (mode == 4 && ti == 0)
		return thh32;
	if (mode == 6 && ti == 0)
		return thh22;
	return thh;
}
*/


function get_tileheader_h(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tile_header_height[1];
// 	if (mode == 4 && ti == 0)
// 		return tile_header_height[4];
// 	if (mode == 6 && ti == 0)
// 		return tile_header_height[6];
// 	return tile_header_height[9];
	if (ti == 0)
		return tile_header_height[mode];
	return tile_header_height[9];

}


/*
function get_tileheader_left(mode, ti) {
	if (mode == 1 && ti == 0)
		return thl33;
	if (mode == 4 && ti == 0)
		return thl32;
	if (mode == 6 && ti == 0)
		return thl22;
	return thl;
}
*/



function get_tileheader_left(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tile_header_left[1];
// 	if (mode == 4 && ti == 0)
// 		return tile_header_left[4];
// 	if (mode == 6 && ti == 0)
// 		return tile_header_left[6];
// 	return tile_header_left[9];
	if (ti == 0)
		return tile_header_left[mode];
	return tile_header_left[9];
}


/*
function get_tileheader_fontsize(mode, ti) {
	if (mode == 1 && ti == 0)
		return thfs33;
	if (mode == 4 && ti == 0)
		return thfs32;
	if (mode == 6 && ti == 0)
		return thfs22;
	return thfs;
}
*/


function get_tileheader_fontsize(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tile_header_font_size[1];
// 	if (mode == 4 && ti == 0)
// 		return tile_header_font_size[4];
// 	if (mode == 6 && ti == 0)
// 		return tile_header_font_size[6];
// 	return tile_header_font_size[9];
	if (ti == 0)
		return tile_header_font_size[mode];
	return tile_header_font_size[9];
}


/*
function get_tileheader_padding(mode, ti) {
	if (mode == 1 && ti == 0)
		return thp33;
	if (mode == 4 && ti == 0)
		return thp32;
	if (mode == 6 && ti == 0)
		return thp22;
	return thp;
}
*/


function get_tileheader_padding(mode, ti) {
// 	if (mode == 1 && ti == 0)
// 		return tile_header_padding[1];
// 	if (mode == 4 && ti == 0)
// 		return tile_header_padding[4];
// 	if (mode == 6 && ti == 0)
// 		return tile_header_padding[6];
// 	return tile_header_padding[9];
	if (ti == 0)
		return tile_header_padding[mode];
	return tile_header_padding[9];
}












/*
function get_tileview_h(mode, ti) {
	if (mode == 1 && ti == 0)
		return tvh33;
	if (mode == 4 && ti == 0)
		return tvh32;
	if (mode == 6 && ti == 0)
		return tvh22;
	return tvh;
}
*/

function get_tileview_h(mode, ti) {
	return get_tileembed_h(mode, ti);
}

/*
function get_tileview_w(mode, ti) {
	if (mode == 1 && ti == 0)
		return tvw33;
	if (mode == 4 && ti == 0)
		return tvw32;
	if (mode == 6 && ti == 0)
		return tvw22;
	return tvw;
}
*/

function get_tileview_w(mode, ti) {
	return get_tileembed_w(mode, ti);

}


/*
function get_tileview_top(mode, ti) {
	if (mode == 1 && ti == 0)
		return tvt33;
	if (mode == 4 && ti == 0)
		return tvt32;
	if (mode == 6 && ti == 0)
		return tvt22;
	return tvt;
}
*/


function get_tileview_top(mode, ti) {
	return get_tileheader_h(mode, ti) + 1;
}










function get_timestring(timeoffset) {
	var d = new Date();
	d.setTime(d.getTime() + ((d.getTimezoneOffset() - timeoffset) * 60000));
	var h = d.getHours();
	if (h < 10)
		h = '0' + h;
	var m = d.getMinutes();
	if (m < 10)
		m = '0' + m;
	return h + ":" + m;
}

function get_vq(mode, ti) {
	if (mode == 1 || mode == 4) {
		if (ti == 0) {
			// 3x2
			var vq = 2;
			if (p_vq != null && vq > p_vq)
				return p_vq;
			else
				return vq;
		} else {
			// 1x1
			return 0;
		}
	}
	if (mode == 6) {
		if (ti == 0) {
			// 2x2
			var vq = 1;
			if (p_vq != null && vq > p_vq)
				return p_vq;
			else
				return vq;
		} else {
			// 1x1
			return 0;
		}
	}
	if (mode == 9) {
		// 1x1
		return 0;
	}
}

function hide_sync(ti) {
// 	debug_append('hide_sync() :: ti = ' + ti);
	if (tileinfo[ti]['f_sync'] == false)
		return;
	var f_ccode = tileinfo[ti]['f_ccode'];
	var f_timeoffset = tileinfo[ti]['f_timeoffset'];
	var header_right = 0;
	if (f_ccode)
		header_right += 18;
	if (f_timeoffset)
		header_right += 31;
	header_right += 2;
	$('#th' + tile[ti]).css('right', header_right + 'px');
	$('#tai' + tile[ti]).attr('src', '');
	$('#ta' + tile[ti]).css('visibility', 'hidden');
	$('#tai' + tile[ti]).css('visibility', 'hidden');
	$('#tai' + tile[ti]).unbind();
	tileinfo[ti]['f_sync'] = false;
}

function init_tile(mode) {
	for (i = 0; i < mode; i++) {
		$('#t' + i).css('left', get_tile_x(mode, i) + 'px').css('top', get_tile_y(mode, i) + 'px');
		$('#t' + i).css('width', get_tile_w(mode, i) + 'px').css('height', get_tile_h(mode, i) + 'px');
		$('#tn' + i).css('width', get_tilenumber_size(mode, i) + 'px').css('height', get_tilenumber_size(mode, i) + 'px').css('font-size', get_tilenumber_size(mode, i) + 'px').css('line-height', get_tilenumber_size(mode, i) + 'px');
		$('#th' + i).css('left', get_tileheader_left(mode, i) + 'px').css('height', get_tileheader_h(mode, i) + 'px').css('padding', get_tileheader_padding(mode, i)).css('font-size', get_tileheader_fontsize(mode, i) + 'px');
		$('#tv' + i).css('top', get_tileview_top(mode, i) + 'px').css('width', get_tileview_w(mode, i) + 'px').css('height', get_tileview_h(mode, i) + 'px');
	}
	var spinner = new Image();
	spinner.src = "img/spinner.gif";
}

function move_tileinfo(ti1, ti2) {
	tileinfo[ti2] = tileinfo[ti1];
	reset_tileinfo(ti1);
}

function move_tilestate(ti1, ti2) {
	tilestate[ti2] = tilestate[ti1];
	tilestate[ti1] = false;
}

function reset_tileinfo(ti) {
	tileinfo[ti] = new Array();
	tileinfo[ti]['alias'] = '';
	tileinfo[ti]['ccode'] = '';
	tileinfo[ti]['cid'] = 0;
	tileinfo[ti]['imgurl'] = '';
	tileinfo[ti]['param'] = '';
	tileinfo[ti]['stime'] = 0;
	tileinfo[ti]['timeoffset'] = -1440;
	tileinfo[ti]['title'] = '';
	tileinfo[ti]['url'] = '';
	tileinfo[ti]['urltype'] = 0;
	tileinfo[ti]['vid'] = '';
	tileinfo[ti]['vol'] = '';
	tileinfo[ti]['imgobj'] = null;
	tileinfo[ti]['ytobj'] = null;
	tileinfo[ti]['f_ccode'] = false;
	tileinfo[ti]['f_timeoffset'] = false;
	tileinfo[ti]['f_sync'] = false;
}


function resize_tiles() {
// 	alert('resize_tiles()');
	for (i = 0; i < tilemode; i++) {
		$('#t' + tile[i]).css('left', get_tile_x(tilemode, i) + 'px').css('top', get_tile_y(tilemode, i) + 'px');
		$('#t' + tile[i]).css('width', get_tile_w(tilemode, i) + 'px').css('height', get_tile_h(tilemode, i) + 'px');
		$('#tn' + tile[i]).css('width', get_tilenumber_size(tilemode, i) + 'px').css('height', get_tilenumber_size(tilemode, i) + 'px').css('font-size', get_tilenumber_size(tilemode, i) + 'px').css('line-height', get_tilenumber_size(tilemode, i) + 'px');
		$('#th' + tile[i]).css('left', get_tileheader_left(tilemode, i) + 'px').css('height', get_tileheader_h(tilemode, i) + 'px').css('padding', get_tileheader_padding(tilemode, i)).css('font-size', get_tileheader_fontsize(tilemode, i) + 'px');
		$('#tv' + tile[i]).css('top', get_tileview_top(tilemode, i) + 'px').css('width', get_tileview_w(tilemode, i) + 'px').css('height', get_tileview_h(tilemode, i) + 'px');

		if (tilestate[i] == true && tileinfo[i]['urltype'] == URLTYPE['IMAGE']) {
			var iw = $('#te' + tile[i]).attr('iw');
			var ih = $('#te' + tile[i]).attr('ih');
			var vw = get_tileembed_w(tilemode, i);
			var vh = get_tileembed_h(tilemode, i);
// 			debug_append('cmd_move() :: ti1 == 0 :: iw = ' + iw + ', ih = ' + ih + ', vw = ' + vw + ', vh = ' + vh);
			var r = calculate_image_size(iw, ih, vw, vh);
// 			debug_append('r[riw] = ' + r['riw'] + ', r[rih] = ' + r['rih']);
// 			debug_append('r[offset_x] = ' + r['offset_x'] + ', r[offset_y] = ' + r['offset_y']);
			$('#te' + tile[i]).css('width', r['riw'] + 'px').css('height', r['rih'] + 'px');
			$('#te' + tile[i]).attr('width', r['riw']).attr('height', r['rih']);
			$('#te' + tile[i]).css('top', r['offset_y']).css('left', r['offset_x']);
		} else {
			$('#te' + tile[i]).css('width', get_tileembed_w(tilemode, i) + 'px').css('height', get_tileembed_h(tilemode, i) + 'px');
			$('#te' + tile[i]).attr('width', get_tileembed_w(tilemode, i)).attr('height', get_tileembed_h(tilemode, i));
		}
	}
}










function set_tileinfo(ti, alias, ccode, cid, imgurl, param, stime, timeoffset, title, url, urltype, vid, vol) {
	tileinfo[ti] = new Array();
	tileinfo[ti]['alias'] = alias;
	tileinfo[ti]['ccode'] = ccode;
	tileinfo[ti]['cid'] = cid;
	tileinfo[ti]['imgurl'] = imgurl;
	tileinfo[ti]['param'] = param;
	tileinfo[ti]['stime'] = stime;
	tileinfo[ti]['timeoffset'] = timeoffset;
	tileinfo[ti]['title'] = title;
	tileinfo[ti]['url'] = url;
	tileinfo[ti]['urltype'] = urltype;
	tileinfo[ti]['vid'] = vid;
	tileinfo[ti]['vol'] = vol;
	tileinfo[ti]['imgobj'] = null;
	tileinfo[ti]['ytobj'] = null;
	if (ccode != '')
		tileinfo[ti]['f_ccode'] = true;
	else
		tileinfo[ti]['f_ccode'] = false;
	if (timeoffset != -1440)
		tileinfo[ti]['f_timeoffset'] = true;
	else
		tileinfo[ti]['f_timeoffset'] = false;
}

function set_tileinfo_kv(ti, k, v) {
	tileinfo[ti][k] = v;
}

function set_tileinfo_meta(ti, ccode, param, timeoffset) {
	tileinfo[ti]['ccode'] = ccode;
	tileinfo[ti]['param'] = param;
	tileinfo[ti]['timeoffset'] = timeoffset;
	if (ccode != '')
		tileinfo[ti]['f_ccode'] = true;
	else
		tileinfo[ti]['f_ccode'] = false;
	if (timeoffset != -1440)
		tileinfo[ti]['f_timeoffset'] = true;
	else
		tileinfo[ti]['f_timeoffset'] = false;
}

function set_tileinfo_vol(ti, vol) {
	tileinfo[ti]['vol'] = vol;
}

// function set_tileinfo_ytobj(ti, ytobj) {
// 	tileinfo[ti]['ytobj'] = ytobj;
// }

// function show_sync(ti) {
// // 	debug_append('show_sync() :: ti = ' + ti);
// 	if (tileinfo[ti]['f_sync'])
// 		return;
// 	var f_ccode = tileinfo[ti]['f_ccode'];
// 	var f_timeoffset = tileinfo[ti]['f_timeoffset'];
// 	var header_right = 0;
// 	if (f_ccode)
// 		header_right += 18;
// 	if (f_timeoffset)
// 		header_right += 31;
// 	header_right += 2;
// 	$('#ta' + tile[ti]).css('right', header_right + 'px');
// 	header_right += 16;
// 	$('#th' + tile[ti]).css('right', header_right + 'px');
// 	$('#ta' + tile[ti]).css('visibility', 'visible');
// 	$('#tai' + tile[ti]).css('visibility', 'visible');
// // 	$('#tai' + tile[ti]).attr('src', 'http://dev.larvalstage.com/je/sync.png');
// 	$('#tai' + tile[ti]).attr('src', 'img/sync.png');
// 	$('#tai' + tile[ti]).unbind();
// 	$('#tai' + tile[ti]).click(function() { sync_tile(ti); hide_sync(ti); });
// 	tileinfo[ti]['f_sync'] = true;
// }

function swap_tile(ti1, ti2) {
	var t = tile[ti1];
	tile[ti1] = tile[ti2];
	tile[ti2] = t;
}

function swap_tileinfo(ti1, ti2) {
	var t = tileinfo[ti1];
	tileinfo[ti1] = tileinfo[ti2];
	tileinfo[ti2] = t;
}

function sync_tile(ti) {
// 	debug_append('sync_tile() :: ti = ' + ti);
	if (tileinfo[ti] && tileinfo[ti]['urltype'] != URLTYPE['YOUTUBE'])
		return;
	var stime = tileinfo[ti]['stime'];
	var cid = tileinfo[ti]['cid'];
	var offset = stime + calculate_offset(cid);
	var ytobj = tileinfo[ti]['ytobj'];
	if (ytobj == null) {
// 		debug_append('sync_tile() :: ti = ' + ti + ', ytobj == null');
		var id = 'te' + tile[ti];
		var ytobj = new YT.Player(id, {
			events: {
				'onReady' : function(event) {
// 						if (vol == 'm')
// 							event.target.mute();
// 					var ytobj = event.target;
// 					ytobj.ti = ti;
// 					set_tileinfo_ytobj(ti, ytobj);
// 					setTimeout(function() { event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]) }, 1000);
					event.target.ti = ti;
					tileinfo[ti]['ytobj'] = event.target;
					event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);

// 				},
// 				'onStateChange' : function(event) {
// 					tileinfo[ti]['ytobj'] = event.target;
// 					tileinfo[ti]['ytobj'].state = event.data;
// 					ytobj_onstatechange(tileinfo[ti]['ytobj']);
				}
			}
		});
	}
// 	debug_append('sync_tile() :: before calling seekTo(' + offset + ')');
	ytobj.seekTo(offset, true);
// 	debug_append('sync_tile() :: after calling seekTo(' + offset + ')');
	var duration = ytobj.getDuration();
	if (offset < duration)
		ytobj.playVideo();
}

function swap_tilestate(ti1, ti2) {
	var t = tilestate[ti1];
	tilestate[ti1] = tilestate[ti2];
	tilestate[ti2] = t;
}

function toggle_tile(ti) {
	if (ti >= tilemode)
		return;
	if (tileinfo[ti]['cid'] == 0)
		return;
	if (tilestate[ti] == true) {
		$('#tv' + tile[ti]).html('<div id="te' + tile[ti] + '" class="tile-embed"></div>');
		$('#te' + tile[ti]).css('width', get_tileembed_w(tilemode, ti) + 'px').css('height', get_tileembed_h(tilemode, ti) + 'px').css('background', '#333333');
		tilestate[ti] = false;
		tileinfo[ti]['imgobj'] = null;
		tileinfo[ti]['ytobj'] = null;
// 		hide_sync(ti);
	} else {
		var alias = tileinfo[ti]['alias'];
		var ccode = tileinfo[ti]['ccode'];
		var cid = tileinfo[ti]['cid'];
		var imgurl = tileinfo[ti]['imgurl'];
		var param = tileinfo[ti]['param'];
		var stime = tileinfo[ti]['stime'];
		var timeoffset = tileinfo[ti]['timeoffset'];
		var title = tileinfo[ti]['title'];
		var url = tileinfo[ti]['url'];
		var urltype = tileinfo[ti]['urltype'];
		var vid = tileinfo[ti]['vid'];
		var vol = tileinfo[ti]['vol'];

		var id = 'te' + tile[ti];
		var apiid = 'tapi' + tile[ti];
		var embed_w = get_tileembed_w(tilemode, ti);
		var embed_h =  get_tileembed_h(tilemode, ti);
		var st = stime + calculate_offset(cid);
		if (tileinfo[ti]['urltype'] == URLTYPE['IMAGE']) {
			$('#tv' + tile[ti]).html('<img id="te' + tile[ti] + '" class="tile-embed" src="img/spinner.gif" width="16" height="16" />');
			$('#te' + tile[ti]).css('top', Math.round((embed_h - 16) / 2)).css('left', Math.round((embed_w - 16) / 2));
			$('#t' + tile[ti]).css('visibility', 'visible');
			var imgobj = new Image();
			imgobj.ti = ti;
			imgobj.vw = embed_w;
			imgobj.vh = embed_h;
			debug_append('toggle_tile() :: embed_w = ' + embed_w + ', embed_h = ' + embed_h);
			$(imgobj).bind('load', function() {
				var ti = this.ti;
				debug_append('toggle_tile() :: load() :: ti = ' + ti);
				debug_append('toggle_tile() :: load() :: this.src = ' + this.src);
				var iw = this.width;
				var ih = this.height;
				debug_append('toggle_tile() :: load() :: loaded');
				debug_append('toggle_tile() :: load() :: this.vw = ' + this.vw + ', this.vh = ' + this.vh);
				debug_append('toggle_tile() :: load() :: width = ' + iw + ', height = ' + ih);
				debug_append('toggle_tile() :: load() :: image ratio = ' + (iw / ih));
				var r = calculate_image_size(iw, ih, this.vw, this.vh);
				var riw = r['riw'];
				var rih = r['rih'];
				var offset_x = r['offset_x'];
				var offset_y = r['offset_y'];
				$('#te' + tile[ti]).attr('iw', iw);
				$('#te' + tile[ti]).attr('ih', ih);
				$('#te' + tile[ti]).attr('src', this.src);
				$('#te' + tile[ti]).css('width', riw + 'px').css('height', rih + 'px');
				$('#te' + tile[ti]).css('top', offset_y).css('left', offset_x);
// 				$('#te' + tile[ti]).css('background', null);
			});
			debug_append('toggle_tile() :: tileinfo[ti].url = ' + tileinfo[ti].url);
			imgobj.src = tileinfo[ti].url;
			tileinfo[ti]['imgobj'] = imgobj;
		} else {
			var swfobj = get_swfobj(urltype, id, apiid, vid, param, embed_w, embed_h, st);
			if (swfobj) {
				$('#t' + tile[ti] + 'n').html(ti + 1);
				if (title == '' || alias.toLowerCase() == title.toLowerCase())
					var headertext = alias;
				else
					if (alias == '')
						headertext = title;
					else
						headertext = alias + ' : ' + title;
				if (headertext != '') {
					$('#th' + tile[ti]).css('cursor', 'pointer');
					$('#th' + tile[ti]).unbind();
					$('#th' + tile[ti]).click(function() { window.open(url, '_blank'); });
				} else {
					$('#th' + tile[ti]).css('cursor', 'default');
					$('#th' + tile[ti]).unbind();
				}
				$('#th' + tile[ti]).html(headertext);
				$('#tv' + tile[ti]).html(swfobj);
				$('#t' + tile[ti]).css('visibility', 'visible');
			} else
				alert('swf object creation failure');
		}
		tilestate[ti] = true;
		if (tileinfo[ti]['urltype'] == URLTYPE['YOUTUBE']) {
			var ytobj = new YT.Player(id, {
				events: {
					'onReady' : function(event) {
						if (vol == 'm')
							event.target.mute();
						event.target.ti = ti;
						tileinfo[ti]['ytobj'] = event.target;
						event.target.setPlaybackQuality(vqstr[get_vq(tilemode, ti)]);
// 					},
// 					'onStateChange' : function(event) {
// 						tileinfo[ti]['ytobj'] = event.target;
// 						tileinfo[ti]['ytobj'].state = event.data;
// 						ytobj_onstatechange(tileinfo[ti]['ytobj']);
					}
				}
			});
		}

	}
}

function timeoffset_timerloop() {
	update_tile_timeoffset();
	tile_update_timer = setTimeout(timeoffset_timerloop, (60 - get_currentsec()) * 1000);
}

// function timeoffset_updateloop_start() {
// 	tile_update_timer = setTimeout(timeoffset_timerloop, (60 - get_currentsec()) * 1000);
// }

function update_tile_timeoffset() {
	for (var i = 0; i < tilemode; i++) {
		if (tileinfo[i]['cid'] > 0 && tileinfo[i]['timeoffset'] != -1440) {
			$('#tt' + tile[i]).html(get_timestring(tileinfo[i]['timeoffset']));
		}
	}
}

// function ytobj_onstatechange(ytobj) {
// // function ytobj_onstatechange(event) {
// // 	var ytobj = event.target;
// // 	var state = event.data;
// // 	var ti = tile[ytobj.ti];
// // 	var ti = ytobj.ti;
//
// 	var state = ytobj.state;
// 	var ti = ytobj.ti;
// // 	var uiti = ytobj.uiti;
// // 	var ti = revtile[uiti];
//
// // 	debug_append('ytobj_onstatechange() :: ytobj.uiti = ' + ytobj.uiti);
// // 	debug_append('ytobj_onstatechange() :: ytobj.ti = ' + ytobj.ti);
// // 	debug_append('ytobj_onstatechange() :: ytobj.state = ' + ytobj.state + ' -- ' + get_statestr(ytobj.state));
//
// 	if (state == YT.PlayerState.ENDED) {
// // 		debug_append('cmd_open_yt() :: onStateChange :: ti = ' + ti + ', player ended');
// 		hide_sync(ti);
// 	}
// 	if (state == YT.PlayerState.PAUSED) {
// 		var ctime = ytobj.getCurrentTime();
// 		var duration = ytobj.getDuration();
// 		var timeleft = duration - ctime;
// // 		debug_append('cmd_open_yt() :: onStateChange PAUSED :: ti = ' + ti + ', ctime = ' + ctime + ', duration = ' + duration + ', timeleft = ' + timeleft + ', player paused');
// 		var stime = tileinfo[ti]['stime'];
// 		var cid = tileinfo[ti]['cid'];
// 		var offset = stime + calculate_offset(cid);
// // 		debug_append('cmd_open_yt() :: onStateChange :: cid = ' + cid + ', stime = ' + stime + ', offset = ' + offset);
// 		if (timeleft >= 1 && offset < duration) {
// // 			debug_append('cmd_open_yt() :: onStateChange PAUSED :: calling show_sync() ti = ' + ti);
// 			show_sync(ti);
// 		}
// 	}
// }

function visually_move_tile(mode, ti) {
	$('#t' + tile[ti]).animate({'left': get_tile_x(mode, ti) + 'px', 'top': get_tile_y(mode, ti) + 'px'}, 'fast');
}


