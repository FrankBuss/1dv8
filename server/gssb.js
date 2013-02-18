

var sbh = 150; // speechbot embed height
var sbw = 225; // speechbot embed width


var f_sbon = false;

var sb_alias = '';
var sb_urltype = 0;
var sb_url = '';
var sb_vid = '';



function init_sb() {
	if (p_nosb == false) {
		$('#sbreloadimg').attr('src', 'img/sbreload.png');

		$('#sbreloadbutton').hover(function() {
			$('#sbreloadimg').attr('src', 'img/sbreloadhover.png');
		}, function() {
			$('#sbreloadimg').attr('src', 'img/sbreload.png');
		});

		$('#sbreloadbutton').click(function() {
			sb_reload();
		});
	}
}

function sb_off() {
	if (f_sbon == false)
		return;
	// expand the sp and spcontent
	$('#sp').css('height', '765px');
	$('.sptabcontent').css('height', '675px');
	$('#sb').html('');
	$('#sbreloadbutton').css('visibility', 'hidden');
	$('#sptabwciframe').attr('height', '671px');
	f_sbon = false;
}

function sb_on() {
	if (f_sbon == true)
		return;
	// shrink the sp and spcontent
	$('#sp').css('height', '740px');
	$('.sptabcontent').css('height', '647px');
	$('#sb').html(swfcreate_justintv_live('sbe', sb_vid, sbw, sbh));
	$('#sbreloadbutton').css('visibility', 'visible');
	$('#sptabwciframe').attr('height', '640px');
	f_sbon = true;
}

function sb_open(alias, url, urltype, vid) {
	sb_alias = alias;
	sb_url = url;
	sb_urltype = urltype;
	sb_vid = vid;
	$('#sp').css('height', '740px');
	$('.sptabcontent').css('height', '647px');
	$('#sb').html(swfcreate_justintv_live('sbe', vid, sbw, sbh));
	$('#sptabwciframe').attr('height', '640px');
	f_sbon = true;
}

function sb_reload() {
	if (f_sbon == false)
		return;
	$('#sb').html(swfcreate_justintv_live('sbe', sb_vid, sbw, sbh));
	f_sbon = true;
}

