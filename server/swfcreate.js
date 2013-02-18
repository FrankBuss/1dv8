
function parseparam(param) {
	var paramarray = new Array();
	var a = param.split('&amp;');
	var i = 0;
	for (i = 0; i < a.length; i++) {
		var eq = a[i].indexOf('=');
		if (eq == -1) continue;
		var k = a[i].substr(0, eq);
		var v = a[i].substr(eq + 1);
		paramarray[k] = v;
	}
	return paramarray;
}

function swfcreate_atom(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://media.mtvnservices.com/mgid:hcx:content:atom.com:' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		wmode: "opaque",
		flashvars: {
			autoPlay: 'true' },
		id: id
	});
}

function swfcreate_bing(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://img.widgets.video.s-msn.com/fl/player/current/player.swf',
		width: w,
		height: h,
		hasVersion: 8,
		base: '.',
		bgcolor: "#ffffff",
		wmode: "transparent",
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: {
			"player.ap": "true",
			"player.c": "v",
			"player.v": videoid,
			mkt: "en-us",
			brand: "v5^544x306",
			configCsid: "msnvideo",
			configName: "syndicationplayer",
			playAdBeforeFirstVid: "false",
		},
		id: id
	});
}

function swfcreate_bliptv(id, videoid, w, h) {
	return '<iframe id="' + id + '" width="' + w + '" height="' + h + '" src="http://blip.tv/play/' + videoid + '.html" frameborder="0" allowfullscreen></iframe>';
}

function swfcreate_current(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://current.com/e/' + videoid + '/en_US',
		width: w,
		height: h,
		contentId: videoid,
		hasVersion: 9,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		wmode: "transparent",
		flashvars: {
			autoplay: "true",
			context: "item" },
		id: id
	});
}

function swfcreate_dailymotion(id, videoid, w, h, stime) {
	return $.flash.create({
		swf: 'http://www.dailymotion.com/swf/video/' + videoid + '?width=&theme=default&foreground=%23F7FFFD&highlight=%23FFC300&background=%23171D1B&additionalInfos=1&autoPlay=1&start=' + stime + '&animatedTitle=&iframe=0&hideInfos=0',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		id: id
	});
}

function swfcreate_foratv_live(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://fora.tv/FORA_Live_DVR.ver_1_16_2_5.swf',
		width: w,
		height: h,
		hasVersion: 10.1,
		hasVersionFail: "noVideoFallback",
		allowScriptAccess: "always",
		allowFullscreen: "true",
		align: 'bottom',
		scale: 'showall',
		bgcolor: '#000000',
		wmode: "opaque",
		quality: 'high',
		flashvars: {
			m: 'free',
			t: videoid },
		id: id
	});
}

function swfcreate_foratv_recorded(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://fora.tv/embedded_player',
		width: w,
		height: h,
		hasVersion: 9,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		align: 'bottom',
		scale: 'showall',
		bgcolor: '#000000',
		wmode: "opaque",
		quality: 'autohigh',
		flashvars: {
			autoplay: '1',
			webhost: 'fora.tv',
			clipid: videoid,
			cliptype: 'clip' },
		id: id
	});
}

function swfcreate_funnyordie(id, videoid, w, h) {
	// funnyordie.com developers thinks the world is that stupid
	autostart = String(videoid.charAt(0)) + String(videoid.charAt(videoid.length - 1));
	return $.flash.create({
		swf: 'http://player.ordienetworks.com/flash/fodplayer.swf',
		width: w,
		height: h,
		hasVersion: 9,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		wmode: "transparent",
		quality: "medium",
		flashvars: {
			key: videoid,
			autostart: autostart },
		id: id
	});
}

// function swfcreate_gplushangout(id, videoid, w, h) {
// 	return $.flash.create({
// 		swf: 'https://video.google.com/get_player?flvurl=' + videoid + '&autoplay=1&autohide=0&border=0&fs=1&ps=google-live',
// 		width: w,
// 		height: h,
// 		hasVersion: 9,
// 		allowScriptAccess: "always",
// 		allowFullScreen: "true",
// 		id: id
// 	});
// }
function swfcreate_gplushangout(id, apiid, videoid, w, h, stime) {
	return swfcreate_youtube(id, apiid, videoid, w, h, stime);
}

function swfcreate_googlevideo(id, videoid, w, h, stime) {
	return $.flash.create({
		swf: 'http://video.google.com/googleplayer.swf?docid=' + videoid + '&hl=en&fs=true',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: {
			playerMode: "embedded",
			autoPlay: "true",
			initialTime: stime },
		id: id
	});
}

// function swfcreate_hulu(id, videoid, w, h) {
// 	return $.flash.create({
// 		swf: 'http://www.hulu.com/embed/' + videoid + '&shared_ad_id=0',
// 		width: w,
// 		height: h,
// 		hasVersion: 8,
// 		allowFullscreen: "true",
// 		Autoplay: "Yes",
// 		flashvars: {
// 			Autoplay: "Yes"},
// 		id: id
// 	});
// }

function swfcreate_justintv_live(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	var videoid = a[0];
	var consumerkey = a[1];
	return $.flash.create({
		swf: 'http://www.justin.tv/widgets/live_embed_player.swf?channel=' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		allowNetworking: "all",
		flashvars: {
			hostname: 'www.justin.tv',
			consumer_key: consumerkey,
			channel: videoid,
			auto_play: "true",
			start_volume: "25",
			watermark_position: "top_right" },
		id: id
	});
}

function swfcreate_justintv_recorded(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	var videoid = a[0];
	var archiveid = a[1];
	var consumerkey = a[2];
	return $.flash.create({
		swf: 'http://www.justin.tv/widgets/archive_embed_player.swf',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		allowNetworking: "all",
		flashvars: {
			consumer_key: consumerkey,
			channel: videoid,
			archive_id: archiveid,
			auto_play: "true",
			start_volume: "25" },
		id: id
	});
}

function swfcreate_liveleak(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://www.liveleak.com/e/' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		wmode: 'transparent',
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: { autostart: "true" },
		id: id
	});
}

function swfcreate_livestream_live(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://cdn.livestream.com/grid/LSPlayer.swf?channel=' + videoid + '&amp;color=0xe7e7e7&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0x888888&amp;iconColor=0x777777',
		width: w,
		height: h,
		hasVersion: 8,
		wmode: 'transparent',
		allowScriptAccess: "always",
		allowFullscreen: "true",
		id: id
	});
}

function swfcreate_livestream_recorded(id, videoid, w, h) {
	var a = videoidlist.split("\t");
	videoid = a[0];
	clipid = a[1];
	return $.flash.create({
		swf: 'http://cdn.livestream.com/grid/LSPlayer.swf?channel=' + videoid + '&amp;clip=' + clipid + '&amp;color=0xe7e7e7&amp;autoPlay=true&amp;mute=false&amp;iconColorOver=0x888888&amp;iconColor=0x777777',
		width: w,
		height: h,
		hasVersion: 8,
		wmode: 'transparent',
		allowScriptAccess: "always",
		allowFullscreen: "true",
		id: id
	});
}

function swfcreate_metacafe(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	videoid = a[0];
	videoname = a[1];
	return $.flash.create({
		swf: 'http://www.metacafe.com/fplayer/' + videoid + '/' + videoname + '.swf',
		width: w,
		height: h,
		hasVersion: 8,
		wmode: 'transparent',
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: { playerVars: "showStats=no|autoPlay=yes|" },
		id: id
	});
}

function swfcreate_mitocw(id, apiid, videoid, w, h, stime) {
	return swfcreate_youtube(id, apiid, videoid, w, h, stime);
}

function swfcreate_mittechtv(id, videoid, w, h) {
	return $.flash.create({
		swf: videoid,
		width: w,
		height: h,
		hasVersion: 9,
		allowScriptAccess: "always",
		allowNetworking: "all",
		allowFullscreen: "true",
		bgolor: "#000000",
		flashvars: {
			autoPlay: "true",
			streamerType: "rtmp"
		},
		id: id
	});
}

function swfcreate_myspace(id, videoid, w, h, stime) {
	return $.flash.create({
		swf: 'http://mediaservices.myspace.com/services/media/embed.aspx/m=' + videoid + ',t=1,mt=video,ap=1',
		width: w,
		height: h,
		hasVersion: 8,
		wmode: 'transparent',
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: { autostart: "true" },
		id: id
	});
}

function swfcreate_qik_live(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	videoid = a[0];
	username = a[1];
	return $.flash.create({
		swf: 'http://assets1.qik.com/swfs/qikPlayer5.swf?' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "sameDomain",
		allowFullscreen: "true",
		quality: "high",
		bgcolor: "#000000",
		flashvars: {
			username: username
		},
		id: id
	});
}

function swfcreate_qik_recorded(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://qik.com/swfs/qikPlayer5.swf',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		quality: "high",
		bgcolor: "#333333",
		flashvars: {
			streamID: videoid,
			autoplay: 'true'
		},
		id: id
	});
}

// function swfcreate_revision3(id, videoid, w, h, stime) {
// 	return $.flash.create({
// 		swf: 'http://revision3.com/player-v' + videoid,
// 		width: w,
// 		height: h,
// 		hasVersion: 8,
// 		allowScriptAccess: "always",
// 		allowFullscreen: "true",
// 		quality: "high",
// 		wmode: "transparent",
// 		flashvars: {
// 			quality: 'high',
// 			autoStart: '1',
// 			startTime: stime
// 		},
// 		id: id
// 	});
// }

// function swfcreate_revision3(id, videoid, w, h, stime) {
// 	return '<iframe id="' + id + '" src="http://revision3.com/html5player-v' + videoid + '?external=true&width=' + w + '&height=' + h + '&startTime=' + stime + '" width="' + w + '" height="' + h + '" frameborder="0" allowFullScreen mozAllowFullscreen webkitAllowFullScreen></iframe>';
// }

function swfcreate_revver(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://flash.revver.com/player/1.0/player.swf?mediaId=' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: {
			autoStart: "True" },
		id: id
	});
}

function swfcreate_ted(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://video.ted.com/assets/player/swf/EmbedPlayer.swf',
		hasVersion: 9,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		wmode: "transparent",
		bgColor: "#ffffff",
		flashvars: {
			vu: 'http://video.ted.com/' + videoid,
			vw: w - 12,
			vh: h - 85,
			ap: 1,
		},
		id: id
	});
}

function swfcreate_twitchtv_live(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	var videoid = a[0];
	var consumerkey = a[1];
	return $.flash.create({
		swf: 'http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + videoid,
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		allowNetworking: "all",
		flashvars: {
			hostname: 'www.twitch.tv',
			consumer_key: consumerkey,
			channel: videoid,
			auto_play: "true",
			start_volume: "25",
			watermark_position: "top_right" },
		id: id
	});
}

function swfcreate_twitchtv_recorded(id, videoidlist, w, h) {
	var a = videoidlist.split("\t");
	var videoid = a[0];
	var archiveid = a[1];
	var consumerkey = a[2];
	return $.flash.create({
		swf: 'http://www.twitch.tv/widgets/archive_embed_player.swf',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		allowNetworking: "all",
		flashvars: {
			hostname: 'www.twitch.tv',
			consumer_key: consumerkey,
			channel: videoid,
			archive_id: archiveid,
			auto_play: "true",
			start_volume: "25" },
		id: id
	});
}

// function swfcreate_ustream_live_new(id, videoid, param, w, h) {
// 	var paramarray = parseparam(param);
// 	return $.flash.create({
// 		swf: 'http://static-cdn1.ustream.tv/swf/live/viewer3:7.swf',
// 		width: w,
// 		height: h,
// 		hasVersion: 11,
// 		flashvars: {
// 			adfree: 'true',
// 			autoplay: 'true',
// 			brand: 'embed',
// 			cid: videoid,
// 			sessionid: '2f7f95e396008bc17b1cd5407718ef56',
// 			userid: '7694212',
// 			style: paramarray['style'],
// 			locale: 'en_US'
// 		},
// 		allowScriptAccess: "always",
// 		allowFullscreen: "true",
// 		bgcolor: "#000000",
// 		wmode: "opaque",
// 		quality: 'low',
// 		id: id
// 	});
// }

function swfcreate_ustream_live(id, videoid, param, w, h) {
	var paramarray = parseparam(param);
	return $.flash.create({
		swf: 'http://www.ustream.tv/flash/live/1/' + videoid + '?v3=1',
// 		swf: 'http://www.ustream.tv/flash/viewer.swf',
		width: w,
		height: h,
		hasVersion: 8,
 		flashvars: {
			autoplay: 'true',
			brand: 'embed',
			cid: videoid,
			style: paramarray['style'],
			locale: 'en_US'
		},
		allowScriptAccess: "always",
		allowFullscreen: "true",
		quality: 'low',
		id: id
	});
}

// function swfcreate_ustream_live_sb(id, videoid, w, h) {
// 	return $.flash.create({
// 		swf: 'http://www.ustream.tv/flash/live/1/' + videoid + '?v3=1',
// 		width: w,
// 		height: h,
// 		hasVersion: 8,
//  		flashvars: {
// 			autoplay: 'true',
// // 			brand: 'embed',
// 			cid: videoid,
// 			locale: 'en_US',
// 			fullscreen: 'false',
// 			viewcount: 'false'
// 		},
// 		allowScriptAccess: "always",
// 		allowFullscreen: "false",
// 		quality: 'low',
// 		id: id
// 	});
// }

function swfcreate_ustream_recorded(id, videoid, param, w, h) {
	return $.flash.create({
		swf: 'http://www.ustream.tv/flash/video/' + videoid + '?v3=1',
// 		swf: 'http://www.ustream.tv/flash/viewer.swf',
		width: w,
		height: h,
		hasVersion: 8,
 		flashvars: {
			loc: '/',
			autoplay: 'true',
			vid: videoid,
			style: param,
			locale: 'en_US'
		},
		allowScriptAccess: "always",
		allowFullscreen: "true",
		quality: 'low',
		id: id
	});
}

function swfcreate_veoh(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://www.veoh.com/swf/webplayer/WebPlayer.swf?version=AFrontend.5.7.0.1281&permalinkId=' + videoid + '&player=videodetailsembedded&videoAutoPlay=1&id=anonymous',
		width: w,
		height: h,
		hasVersion: 9,
		allowScriptAccess: "always",
		allowFullScreen: "true",
		bgolor: "#000000",
		id: id
	});
}

function swfcreate_viddler(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://www.viddler.com/player/' + videoid + '/',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		flashvars: { autoplay: "t",
			disablebranding: "t" },
		id: id
	});
}

function swfcreate_vimeo(id, videoid, w, h) {
	return $.flash.create({
		swf: 'http://vimeo.com/moogaloop.swf?clip_id=' + videoid + '&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=1&amp;color=00ADEF&amp;fullscreen=1&amp;autoplay=1&amp;loop=0',
		width: w,
		height: h,
		hasVersion: 8,
		allowScriptAccess: "always",
		allowFullscreen: "true",
		id: id
	});
}

function swfcreate_youtube(id, apiid, videoid, w, h, stime) {
	return '<iframe id="' + id + '" title="YouTube video player" width="' + w + '" height="' + h + '" src="http://www.youtube.com/embed/' + videoid + '?rel=0&showinfo=0&autohide=1&enablejsapi=1&playerapiid=' + apiid + '&fs=1&hl=en_US&autoplay=1&start=' + stime + '" frameborder="0" allowfullscreen></iframe>';
}
