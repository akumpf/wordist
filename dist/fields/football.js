(function(){
 var o = ["aerial","blitz","clipping","completed","downed","drive","fair catch","fullback","grid","hack","halfback","handoff","heel","hike","kick","kick off","lateral","lineman","onside kick","pick off","pocket","punt","redskin","rush","scrimmage","snap","tackle","touch","touchback","touchdown","upright"];
 if(!window.on_field_cb) console.warn("on_field_cb?"); else on_field_cb("football",o);
})();