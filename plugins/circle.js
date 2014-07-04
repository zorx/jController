
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

	path : function(self) {
		(self.getInternal('innerArc').getPath())();
	},

	render : function(self) {
		
		// Circles are full arcs
		var arc = self.render("arc", {
			x: self.attr.x,
			y: self.attr.y,
			r: self.attr.r,
			angleStart: 0,
			angleEnd:   2 * Math.PI,
			color:  self.attr.color,
			fill:   self.attr.fill,
			line:   self.attr.line,
			shadow: self.attr.shadow,
		});

		self.setInternal({innerArc: arc});

	},

	events : {
		
		drag : {

			listener : ["pointerdown","pointerup","mousemove"],

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();
				
				if (data.type == "pointerdown") {
					if (self.inPath(
						data.pageX - canvas.offsetLeft,
						data.pageY - canvas.offsetTop
					)) {
						self.setInternal({drag:true});
					}
				}

				else if (data.type == "pointerup") {

					self.setInternal({drag:false});
					
					callback(self,data);
				
				}

				else if (data.type == "mousemove") {

					if (self.getInternal("drag")) {

						self.attr.x = data.pageX - canvas.offsetLeft;
						self.attr.y = data.pageY - canvas.offsetTop;
					}
				}
			}
		},
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
					self.setInternal({mousedIn:true});
					callback(self, data);
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
					self.setInternal({mousedIn:false});
				}
			}

		},
		
	},
})