
// Add rect plugin
$.jController.registerPlugin({
	name: "rect",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, params) {
		ctx.beginPath();
		ctx.rect(params.x, params.y, params.w, params.h);
		ctx.stroke();
	},

	events : {

		click : function($canvas, self, callback) {
			$canvas.on("click", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				// @TODO: don't work, returns undefined /!\
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