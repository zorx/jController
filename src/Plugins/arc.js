
// Arc plugin
$.jController.registerPlugin({
	name : "arc",
	
	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 0,
			angleStart : 0,
			angleEnd : Math.PI,
			color : "black",
			fill : undefined,
			lineWidth : 1,
		}

		return $.extend({}, defaults, params);
	},

	render : function(self) {

		var params = self.params;
		$.jController.getHelper("contextDraw")({
			ctx : $.jController.getContext(),
			color : params.color,
			fill  : params.fill,
			lineWidth : params.lineWidth,
			draw : function (ctx) {
				ctx.arc(params.x, params.y, params.r, params.angleStart, params.angleEnd);
			},
		})

	},
})