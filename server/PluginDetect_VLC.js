/*
PluginDetect v0.7.8 www.pinlady.net/PluginDetect/
www.pinlady.net/PluginDetect/license/
[ getVersion isMinVersion ]
[ VLC ]
*/
var PluginDetect={version:"0.7.8",name:"PluginDetect",handler:function(c,b,a){return function(){c(b,a)}},isDefined:function(b){return typeof b!="undefined"},isArray:function(b){return(/array/i).test(Object.prototype.toString.call(b))},isFunc:function(b){return typeof b=="function"},isString:function(b){return typeof b=="string"},isNum:function(b){return typeof b=="number"},isStrNum:function(b){return(typeof b=="string"&&(/\d/).test(b))},getNumRegx:/[\d][\d\.\_,-]*/,splitNumRegx:/[\.\_,-]/g,getNum:function(b,c){var d=this,a=d.isStrNum(b)?(d.isDefined(c)?new RegExp(c):d.getNumRegx).exec(b):null;return a?a[0]:null},compareNums:function(h,f,d){var e=this,c,b,a,g=parseInt;if(e.isStrNum(h)&&e.isStrNum(f)){if(e.isDefined(d)&&d.compareNums){return d.compareNums(h,f)}c=h.split(e.splitNumRegx);b=f.split(e.splitNumRegx);for(a=0;a<Math.min(c.length,b.length);a++){if(g(c[a],10)>g(b[a],10)){return 1}if(g(c[a],10)<g(b[a],10)){return -1}}}return 0},formatNum:function(b,c){var d=this,a,e;if(!d.isStrNum(b)){return null}if(!d.isNum(c)){c=4}c--;e=b.replace(/\s/g,"").split(d.splitNumRegx).concat(["0","0","0","0"]);for(a=0;a<4;a++){if(/^(0+)(.+)$/.test(e[a])){e[a]=RegExp.$2}if(a>c||!(/\d/).test(e[a])){e[a]="0"}}return e.slice(0,4).join(",")},$$hasMimeType:function(a){return function(c){if(!a.isIE&&c){var f,e,b,d=a.isArray(c)?c:(a.isString(c)?[c]:[]);for(b=0;b<d.length;b++){if(a.isString(d[b])&&/[^\s]/.test(d[b])){f=navigator.mimeTypes[d[b]];e=f?f.enabledPlugin:0;if(e&&(e.name||e.description)){return f}}}}return null}},findNavPlugin:function(l,e,c){var j=this,h=new RegExp(l,"i"),d=(!j.isDefined(e)||e)?/\d/:0,k=c?new RegExp(c,"i"):0,a=navigator.plugins,g="",f,b,m;for(f=0;f<a.length;f++){m=a[f].description||g;b=a[f].name||g;if((h.test(m)&&(!d||d.test(RegExp.leftContext+RegExp.rightContext)))||(h.test(b)&&(!d||d.test(RegExp.leftContext+RegExp.rightContext)))){if(!k||!(k.test(m)||k.test(b))){return a[f]}}}return null},getMimeEnabledPlugin:function(k,m,c){var e=this,f,b=new RegExp(m,"i"),h="",g=c?new RegExp(c,"i"):0,a,l,d,j=e.isString(k)?[k]:k;for(d=0;d<j.length;d++){if((f=e.hasMimeType(j[d]))&&(f=f.enabledPlugin)){l=f.description||h;a=f.name||h;if(b.test(l)||b.test(a)){if(!g||!(g.test(l)||g.test(a))){return f}}}}return 0},AXO:window.ActiveXObject,getAXO:function(a){var f=null,d,b=this,c={};try{f=new b.AXO(a)}catch(d){}return f},convertFuncs:function(f){var a,g,d,b=/^[\$][\$]/,c=this;for(a in f){if(b.test(a)){try{g=a.slice(2);if(g.length>0&&!f[g]){f[g]=f[a](f);delete f[a]}}catch(d){}}}},initObj:function(e,b,d){var a,c;if(e){if(e[b[0]]==1||d){for(a=0;a<b.length;a=a+2){e[b[a]]=b[a+1]}}for(a in e){c=e[a];if(c&&c[b[0]]==1){this.initObj(c,b)}}}},initScript:function(){var c=this,a=navigator,e="/",f,i=a.userAgent||"",g=a.vendor||"",b=a.platform||"",h=a.product||"";c.initObj(c,["$",c]);for(f in c.Plugins){if(c.Plugins[f]){c.initObj(c.Plugins[f],["$",c,"$$",c.Plugins[f]],1)}};c.OS=100;if(b){var d=["Win",1,"Mac",2,"Linux",3,"FreeBSD",4,"iPhone",21.1,"iPod",21.2,"iPad",21.3,"Win.*CE",22.1,"Win.*Mobile",22.2,"Pocket\\s*PC",22.3,"",100];for(f=d.length-2;f>=0;f=f-2){if(d[f]&&new RegExp(d[f],"i").test(b)){c.OS=d[f+1];break}}}c.convertFuncs(c);c.head=(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]||document.body||null);c.isIE=(new Function("return "+e+"*@cc_on!@*"+e+"false"))();c.verIE=c.isIE&&(/MSIE\s*(\d+\.?\d*)/i).test(i)?parseFloat(RegExp.$1,10):null;c.ActiveXEnabled=false;if(c.isIE){var f,j=["Msxml2.XMLHTTP","Msxml2.DOMDocument","Microsoft.XMLDOM","ShockwaveFlash.ShockwaveFlash","TDCCtl.TDCCtl","Shell.UIHelper","Scripting.Dictionary","wmplayer.ocx"];for(f=0;f<j.length;f++){if(c.getAXO(j[f])){c.ActiveXEnabled=true;break}}}c.isGecko=(/Gecko/i).test(h)&&(/Gecko\s*\/\s*\d/i).test(i);c.verGecko=c.isGecko?c.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(i)?RegExp.$1:"0.9"):null;c.isChrome=(/Chrome\s*\/\s*(\d[\d\.]*)/i).test(i);c.verChrome=c.isChrome?c.formatNum(RegExp.$1):null;c.isSafari=((/Apple/i).test(g)||(!g&&!c.isChrome))&&(/Safari\s*\/\s*(\d[\d\.]*)/i).test(i);c.verSafari=c.isSafari&&(/Version\s*\/\s*(\d[\d\.]*)/i).test(i)?c.formatNum(RegExp.$1):null;c.isOpera=(/Opera\s*[\/]?\s*(\d+\.?\d*)/i).test(i);c.verOpera=c.isOpera&&((/Version\s*\/\s*(\d+\.?\d*)/i).test(i)||1)?parseFloat(RegExp.$1,10):null},init:function(d){var c=this,b,d,a={status:-3,plugin:0};if(!c.isString(d)){return a}if(d.length==1){c.getVersionDelimiter=d;return a}d=d.toLowerCase().replace(/\s/g,"");b=c.Plugins[d];if(!b||!b.getVersion){return a}a.plugin=b;if(!c.isDefined(b.installed)){b.installed=null;b.version=null;b.version0=null;b.getVersionDone=null;b.pluginName=d}c.garbage=false;if(c.isIE&&!c.ActiveXEnabled&&d!=="java"){a.status=-2;return a}a.status=1;return a},$$isMinVersion:function(a){return function(h,g,d,c){var e=a.init(h),f,b=-1,j={};if(e.status<0){return e.status}f=e.plugin;g=a.formatNum(a.isNum(g)?g.toString():(a.isStrNum(g)?a.getNum(g):"0"));if(f.getVersionDone!=1){f.getVersion(g,d,c);if(f.getVersionDone===null){f.getVersionDone=1}}a.cleanup();if(f.installed!==null){b=f.installed<=0.5?f.installed:(f.installed==0.7?1:(f.version===null?0:(a.compareNums(f.version,g,f)>=0?1:-0.1)))};return b}},getVersionDelimiter:",",$$getVersion:function(a){return function(g,d,c){var e=a.init(g),f,b,h={};if(e.status<0){return null};f=e.plugin;if(f.getVersionDone!=1){f.getVersion(null,d,c);if(f.getVersionDone===null){f.getVersionDone=1}}a.cleanup();b=(f.version||f.version0);b=b?b.replace(a.splitNumRegx,a.getVersionDelimiter):b;return b}},cleanup:function(){},Plugins:{vlc:{mimeType:"application/x-vlc-plugin",progID:"VideoLAN.VLCPlugin",classID:"clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921",compareNums:function(e,d){var c=this.$,k=e.split(c.splitNumRegx),i=d.split(c.splitNumRegx),h,b,a,g,f,j;for(h=0;h<Math.min(k.length,i.length);h++){j=/([\d]+)([a-z]?)/.test(k[h]);b=parseInt(RegExp.$1,10);g=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;j=/([\d]+)([a-z]?)/.test(i[h]);a=parseInt(RegExp.$1,10);f=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;if(b!=a){return(b>a?1:-1)}if(h==2&&g!=f){return(g>f?1:-1)}}return 0},getVersion:function(){var c=this,b=c.$,f,a=null,d;if(!b.isIE){if(b.hasMimeType(c.mimeType)){f=b.findNavPlugin("VLC.*Plug-?in",0,"Totem");if(f&&f.description){a=b.getNum(f.description,"[\\d][\\d\\.]*[a-z]*")}}c.installed=a?1:-1}else{f=b.getAXO(c.progID);if(f){try{a=b.getNum(f.VersionInfo,"[\\d][\\d\\.]*[a-z]*")}catch(d){}}c.installed=a?1:(f?0:-1)}c.version=b.formatNum(a)}},zz:0}};PluginDetect.initScript();