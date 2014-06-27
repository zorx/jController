
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
			lineWidth : 1,
		}

		return $.extend({}, defaults, params);
	},

	render : function(self) {

		var ctx = $.jController.getContext();
		
		var params = self.params;
		ctx.beginPath();
		$.jController.getHelper("contextSet")({
			ctx : ctx,
			color : params.color,
			lineWidth : params.lineWidth,
		})
		ctx.arc(params.x, params.y, params.r, params.angleStart, params.angleEnd);
		ctx.stroke();
		$.jController.getHelper("contextReset")({ctx: ctx});
	},
})