

// Line plugin
$.jController.registerPlugin({
	name : "line",
	
	construct : function(params)
	{
		var defaults = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			color: "black",
		}

		return $.extend({}, defaults, params);
	},
	
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.strokeStyle = params.color;
		ctx.moveTo(params.x, params.y);
		ctx.lineTo(params.w, params.h);
		ctx.stroke();
	},
})