
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "mosaic",

	construct : function(params)
	{
		var defaults = {
			x : 0,
			y : 0,
			r : 0
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, self) {
		

	    ctx.fillStyle = 'rgb(20,20,200)'
	    ctx.beginPath();
	    ctx.arc( self.x, self.y, self.r, 0, Math.PI * 2, true );
	    ctx.closePath();
	    ctx.fill();

	}
})