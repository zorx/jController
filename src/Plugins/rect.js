
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

	render : function(self) {

		var params = self.params;
		$.jController.getHelper("contextDraw")({
			color  : params.color,
			fill   : params.fill,
			line   : params.line,
			shadow : params.shadow,
			draw : function (ctx) {
				ctx.rect(params.x, params.y, params.w, params.h);
			},
		})

	},

	events : {

		click : {

			listener : "click",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inRect")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self, data);
				}
			}
		},

		mousemove : {

			listener : "mousemove",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inRect")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self, data);
				}
			}
		},

		mousein : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if (! self.getInternal("mousedIn") && 
					$.jController.getHelper("inRect")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self, data);
					self.setInternal({mousedIn : true});
				}
			}
		},

		mouseout : {

			listener : "mousemove",

			fn : function (self, callback, data) {
				var canvas = $.jController.getCanvas();
				
				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inRect")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self, data);
					self.setInternal({mousedIn : false});
				}
			}

		},

	},
})