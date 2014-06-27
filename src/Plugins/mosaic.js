
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "mosaic",

	construct : function(params)
	{
		var defaults = {
			r : 0,
			trace : false,
			colors : ["rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)"]
		}

		return $.extend({}, defaults, params);
	},

	render : function(self) {
		
		var time = new Date().getTime() * 0.002;
	    var x = Math.sin( time ) * 192 + 256;
	    var y = Math.cos( time * 0.9 ) * 192 + 256;

	    var rnd = Math.floor(Math.random() * self.params.colors.length);

	    var ctx = $.jController.getContext();

	    if (!self.params.trace)
	    {
	    	ctx.clearRect(0, 0, $.jController.getCanvas().width, $.jController.getCanvas().height);
	    }

	    ctx.fillStyle = self.params.colors[rnd];
	    ctx.beginPath();
	    ctx.arc( x, y, self.params.r, 0, Math.PI * 2, true );
	    ctx.closePath();
	    ctx.fill();

	}
})