
// Ipega button (based on circles)
$.jController.registerPlugin({
	name : "button",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0, 
			r : 0,
		}

		return $.extend({}, defaults, params);
	},

	path : function(self) {
		(self.getInternal('innerCircle').getPath())();
	},

	render : function(self) {
		var circle = self.render('circle', {
			x: self.attr.x,
			y: self.attr.y,
			r: self.attr.r,
		});

		self.setInternal({innerCircle: circle});
	},
	
	events : {

		down : {
			listener : "pointerdown",
			fn : function(self, callback, data) {
				// @TODO: in path
				callback(self, data);
			}
		},

		up : {
			listener : "pointerup",
			fn : function(self, callback, data) {
				// @TODO: in path
				callback(self, data);
			}
		},

		push : {
			listener : "pointerup",
			fn : function(self, callback, data) {
				// @TODO: in path
				callback(self, data);
			}
		},

	}
});