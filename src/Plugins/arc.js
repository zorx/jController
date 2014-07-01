
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

	/* // Idea:
	path : function(params) {
		// @TODO: manque la gestion paramétrique
		return function (params, ctx) {
			return function(ctx) {
				ctx.arc(params.x, params.y, params.r,
				params.angleStart, params.angleEnd);
			}
		}
	},
	*/

	render : function(self) {
		var params = self.params;
		$.jController.getHelper("contextDraw")({
			color  : params.color,
			fill   : params.fill,
			line   : params.line,
			shadow : params.shadow,
			draw : /* Idea: self.getPath(params) */ function (ctx) {
				ctx.arc(params.x, params.y, params.r,
					params.angleStart, params.angleEnd);
			},
		})

	},
})