

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
			lineWidth: 1,
		}

		return $.extend({}, defaults, params);
	},
	
	render : function(ctx, self) {
		var params = self.params;
		ctx.beginPath();
		$.jController.getHelper("contextSet")({
			ctx : ctx,
			color : params.color,
			lineWidth : params.lineWidth,
		})
		ctx.moveTo(params.x, params.y);
		ctx.lineTo(params.w, params.h);
		ctx.stroke();
		$.jController.getHelper("contextReset")({ctx: ctx});
	},
})