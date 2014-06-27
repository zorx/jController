

// Line plugin
$.jController.registerPlugin({
	name : "line",
	
	construct : function(params)
	{
		var defaults = {
			x : 0,
			y : 0
		}

		return $.extend({}, defaults, params);
	},
	
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.moveTo(params.x, params.y);
		ctx.lineTo(params.w, params.h);
		ctx.stroke();
	},
})