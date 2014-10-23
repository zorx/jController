
// Text plugin (label, etc)
$.jController.registerPlugin({
	name : "text",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			text : "",
		}

		return $.extend({}, defaults, params);
	},

	path : function(self) {
		var params = self.attr;
		$.jController
			.getContext()
			// @TODO : define englobing rect (with context, baseline, align, font)
			.rect(params.x, params.y, 10, 10);
	},

	render : function(self) {
		var params = self.attr;
		console.log("draw '"+ params.text +"' (" + params.x + ", " + params.y + ")");
		$.jController.getHelper("canvasWrite")({
			x : params.x,
			y : params.y,
			baseline : params.baseline,
			align    : params.align,
			text     : params.text,
			font     : params.font,
			color    : params.color,
			outline  : params.outline,
			line     : params.line,
			shadow   : params.shadow,
			text     : params.text,
		});
	},
});
