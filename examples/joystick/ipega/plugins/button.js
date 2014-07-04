
// Ipega button (based on circles)
$.jController.registerPlugin({
	name : "button",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0, 
			r : 20,
			color : "black",
		}

		return $.extend({}, defaults, params);
	},

	path : function(self) {
		(self.getInternal('innerCircle').getPath())();
	},

	render : function(self) {
		var blur  = 2;
		var fill  = undefined;
		var color = self.attr.color; 

		if (self.getInternal('pushed')) {
			blur  = 3;
			fill  = self.attr.color;
			color = "orange";
		}

		var circle = self.render('circle', {
			x: self.attr.x,
			y: self.attr.y,
			r: self.attr.r,
			shadow : { blur: blur },
			fill : fill,
		});

		var label = self.render('text', {
			x : self.attr.x,
			y : self.attr.y,
			text : self.attr.label,
			color : color,
			font : "20px Arial bold",
			align : "center",
			baseline : "middle",
		});

		self.setInternal({innerCircle: circle});
		self.setInternal({label: label});
	},

	events : {

		push : {
			listener : ["pointerdown", "pointerup",],
			fn : function(self, callback, data) {
				var canvas = $.jController.getCanvas();

				if (data.type == "pointerdown") {
					if (self.inPath(
						data.pageX - canvas.offsetLeft,
						data.pageY - canvas.offsetTop
					)) {
						self.setInternal({pushed: true});
					}
				} else if (data.type == "pointerup") {
					if (self.getInternal('pushed')) {
						callback(self, data);
					}
					self.setInternal({pushed: false});
				}
			}
		}
	}
});