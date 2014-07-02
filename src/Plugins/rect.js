
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

	path : function(self) {
		var params = self.attr;
		$.jController
			.getContext()
			.rect(params.x, params.y, params.w, params.h);
	},

	render : function(self) {
		var params = self.attr;
		$.jController
			.getHelper("canvasDraw")({
				color  : params.color,
				fill   : params.fill,
				line   : params.line,
				shadow : params.shadow,
				draw   : self.getPath(),
		})
	},

	events : {

		click : {

			listener : "click",

			fn : function (self, callback, data) {
				var canvas = $.jController.getCanvas();
				if (self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
					callback(self, data);
				}
			}
		},

		mousemove : {

			listener : "mousemove",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if (self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
					callback(self, data);
				}
			}
		},

		mousein : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if (! self.getInternal("mousedIn") && 
					self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
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
					! self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
					callback(self, data);
					self.setInternal({mousedIn : false});
				}
			}

		},

	},
})