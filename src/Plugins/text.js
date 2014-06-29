
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

	render : function(self) {
		var params = self.params;
		$.jController.getHelper("contextWrite")({
			ctx : $.jController.getContext(),
			x : params.x,
			y : params.y,
			baseline : params.baseline,
			align   : params.align,
			text    : params.text,
			font    : params.font,
			color   : params.color,
			outline : params.outline,
			line    : params.line,
			shadow  : params.shadow,
			text    : params.text,
		});
	},
});
