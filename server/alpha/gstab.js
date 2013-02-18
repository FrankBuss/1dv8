

// var tab_selected;
// var tab_squashed = null;
//
// var spminwidth = 198;  // side panel minimum width

/*
function handle_resize() {
	var ww = $(window).width();
	var spwidth = ww - 858;
	if (spwidth < spminwidth)
		spwidth = spminwidth;
	if (spwidth >= 440) {
		$('#sptabim').css('visibility', 'visible');
		$('#sptabwc').css('visibility', 'visible');
	} else {
		$('#sptabim').css('visibility', 'hidden');
		$('#sptabwc').css('visibility', 'hidden');
	}

	if (ww <= 1019) {
		$('#sbcontainer').css('right', '');
		$('#sbcontainer').css('left', '883px');
		$('#sbreloadbutton').css('left', '858px');
	} else {
		$('#sbcontainer').css('left', '');
		$('#sbcontainer').css('right', '0px');
		$('#sbreloadbutton').css('left', '');
		$('#sbreloadbutton').css('right', '136px');
	}

	$('#sp').css('width', spwidth);
	$('.sptabcontent').css('width', spwidth - 6);
}
*/

/*
function init_sptab() {
	tab_selected = '0';
	$('#sptab0').css('color', '#ffffff');
	$('#sptab0').css('background-color', '#000000');

	$('#sptab0content').css('visibility', 'visible');
	if (f_debug)
		$('#sptabdebug').css('visibility', 'visible');
	else
		$('#sptabdebug').css('visibility', 'hidden');
}

function select_tab(tab) {
	if (tab == tab_selected) return;

	$('#sptab' + tab_selected).css('color', '#cccccc');
	$('#sptab' + tab_selected).css('background-color', '#333333');
	$('#sptab' + tab_selected + 'content').css('visibility', 'hidden');
	$('.sptab' + tab_selected + 'img').css('visibility', 'hidden');
	$('#sptab' + tab).css('color', '#ffffff');
	$('#sptab' + tab).css('background-color', '#000000');
	$('#sptab' + tab + 'content').css('visibility', 'visible');

	tab_squashed = null;
	tab_selected = tab;
}
*/

function statusbox_connected() {
	$('#statusbox').css('background-color', '#009900');
}


function statusbox_disconnected() {
	$('#statusbox').css('background-color', '#990000');
	$('#statusbox').html(':-(');
}

function statusbox_setcount(count) {
	$('#statusbox').html(count);
}