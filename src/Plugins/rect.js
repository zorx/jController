
// Add rect plugin
$.jController.registerPlugin({
	name: "rect",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
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
		ctx.rect(params.x, params.y, params.w, params.h);
		ctx.stroke();
		$.jController.getHelper("contextReset")({ctx: ctx});
	},

	events : {

		click : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("click", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if ($.jController.getHelper("inRect")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(e);
				}
			});
		},

	},
})