(function(){
 var o = ["castle","castling","check","checkmate","en passant","mate","pawn","peon","piece","queen","rook","smothered mate","stalemate"];
 if(!window.on_field_cb) console.warn("on_field_cb?"); else on_field_cb("chess",o);
})();