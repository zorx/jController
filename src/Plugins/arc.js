
// Arc plugin
$.jController.registerPlugin({
	name : "arc",
	
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
		ctx.arc(params.x, params.y, params.r, params.angleStart, params.angleEnd);
		ctx.stroke();
	},
})