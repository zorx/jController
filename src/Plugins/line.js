

// Line plugin
$.jController.registerPlugin({
	name : "line",
	
	construct : function(params) {

		var defaults = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
		}

		return $.extend({}, defaults, params);
		
	},
	
	render : function(self) {

		var params = self.params;
		$.jController.getHelper("contextDraw")({
			color  : params.color,
			line   : params.line,
			shadow : params.shadow,
			draw : function (ctx) {
				ctx.moveTo(params.x, params.y);
				ctx.lineTo(params.w, params.h);
			},
		})

	},

})