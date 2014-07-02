
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
		}

		return $.extend({}, defaults, params);
	},

	path : function(self) {
		var params = self.attr;
		$.jController
			.getContext()
			.arc(params.x, params.y, params.r,
				params.angleStart, params.angleEnd);
	},

	render : function(self) {
		var params = self.attr;
		$.jController.getHelper("canvasDraw")({
			color  : params.color,
			fill   : params.fill,
			line   : params.line,
			shadow : params.shadow,
			draw   : self.getPath(params),
		})
	},
})