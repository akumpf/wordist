(function(){
 var o = ["beacon","northing","reckoning","rhumb","ring","southing"];
 if(!window.on_field_cb) console.warn("on_field_cb?"); else on_field_cb("navigation",o);
})();