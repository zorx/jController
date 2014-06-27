
// Arc plugin
$.jController.registerPlugin({
	name : "arc",
	
	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 0,
			angleStart: 0,
			angleEnd : Math.PI,
			color: "black",
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, params) {
		ctx.beginPath();
		ctx.strokeStyle = params.color;
		ctx.arc(params.x, params.y, params.r, params.angleStart, params.angleEnd);
		ctx.stroke();
		ctx.closePath();
	},
})