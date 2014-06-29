
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	name : "circle",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 0,
		}

		return $.extend({}, defaults, params);
	},

	render : function(self) {
		
		// Circles are full arcs
		self.render("arc", {
			x: self.params.x,
			y: self.params.y,
			r: self.params.r,
			angleStart: 0,
			angleEnd:   2 * Math.PI,
			color:  self.params.color,
			fill:   self.params.fill,
			line:   self.params.line,
			shadow: self.params.shadow,
		});

	},

	events : {
		
		click : {

			listener : "click",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {

					callback(self);
				}
			}
		},

		mousemove : {

			listener : "mousemove",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					callback(self);
				}
			}
		},

		mousein : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				self.setInternal({mousedIn:false});
				
				if (! self.getInternal("mousedIn") &&
					$.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					self.setInternal({mousedIn:true});
					callback(self);
				}
			}
		},

		mouseout : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();
				
				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {

					callback(self);
					self.setInternal({mousedIn:false});
				}
			}

		},
	},
})