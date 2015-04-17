
// Ipega button (based on circles)
$.jController.registerPlugin({
	name : "button",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 20,
		}

		return $.extend({}, defaults, params);
	},

	path : function(self) {
		(self.getInternal('innerCircle').getPath())();
	},

	render : function(self) {
		var blur  = 2;
		var fill  = "red";
		var color = "black";

		if (self.getInternal('pushed')) {
			blur  = 5;
			fill  = "grey";
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
			font : "bold 16px sans-serif",
			align : "center",
			baseline : "middle",
		});

		self.setInternal({label: label});
		self.setInternal({innerCircle: circle});
	},

	events : {

		push : {
			listener : ["pointerdown", "pointerup", "pointermove"],
			fn : function(self, callback, data) {
				var canvas = $.jController.getCanvas();

				var isInButton = self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				);

				// Pushing button
				if (data.type == "pointerdown" && isInButton) {
					self.setInternal({pushed: true});
				}

				// Leaving button (up or move)
				if ((data.type == "pointermove" && !isInButton) ||
				    (data.type == "pointerup")) {
					if (self.getInternal('pushed')) {
						callback(self, data);
					}

					self.setInternal({pushed: false});
				}
			}
		}
	}
});
