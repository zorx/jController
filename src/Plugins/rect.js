
// Add rect plugin
$.jController.registerPlugin({
	name: "rect",

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
		ctx.rect(params.x, params.y, params.w, params.h);
		ctx.stroke();
	}
})