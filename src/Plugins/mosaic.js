
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "mosaic",

	construct : function(params)
	{
		var defaults = {
			r : 0,
			colors : ["rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)"]
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, self) {
		
		var time = new Date().getTime() * 0.002;
	    var x = Math.sin( time ) * 192 + 256;
	    var y = Math.cos( time * 0.9 ) * 192 + 256;
	    
	    var rnd = Math.floor(Math.random() * self.colors.length)
	    ctx.fillStyle = self.colors[rnd];
	    ctx.beginPath();
	    ctx.arc( x, y, self.r, 0, Math.PI * 2, true );
	    ctx.closePath();
	    ctx.fill();

	}
})