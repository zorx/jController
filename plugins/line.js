
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

	path : function(self) {
		var params = self.attr;
		var ctx    = $.jController.getContext();
		ctx.lineWidth = params.line.width;
		ctx.moveTo(params.x, params.y);
		ctx.lineTo(params.w, params.h);
	},

	render : function(self) {
		var params = self.attr;
		$.jController.getHelper("canvasDraw")({
			color  : params.color,
			line   : params.line,
			shadow : params.shadow,
			draw   : self.getPath(),
		})

	},

})
