(function(){
 var o = ["insolation","inversion","overcast","precipitation"];
 if(!window.on_field_cb) console.warn("on_field_cb?"); else on_field_cb("meteorology",o);
})();