
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
			ctx    : $.jController.getContext(),
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

			fn : function (self,callback,listener) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inRect")({
					px : listener.pageX - canvas.offsetLeft,
					py : listener.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self);
				}
			}
		},

		mousemove : {

			listener : "mousemove",

			fn : function (self,callback,listener) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inRect")({
					px : listener.pageX - canvas.offsetLeft,
					py : listener.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self);
				}
			}
		},

		mousein : {

			listener : "mousemove",

			fn : function (self,callback,listener) {

				var canvas = $.jController.getCanvas();

				self.setInternal({mousedIn : false});
				
				if (! self.getInternal("mousedIn") && 
					$.jController.getHelper("inRect")({
					px : listener.pageX - canvas.offsetLeft,
					py : listener.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self);
					self.setInternal({mousedIn : true});
				}
			}
		},

		mouseout : {

			listener : "mousemove",

			fn : function (self,callback,listener) {
				
				var canvas = $.jController.getCanvas();
				
				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inRect")({
					px : listener.pageX - canvas.offsetLeft,
					py : listener.pageY - canvas.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(self);
					self.setInternal({mousedIn : false});
				}
			}

		},

	},
})