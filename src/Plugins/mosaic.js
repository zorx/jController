
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "mosaic",

	construct : function(params)
	{
		var defaults = {
			r : 0,
			trace : false,
			colors : ["rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)"]
		}

		return $.extend({}, defaults, params);
	},

	path : function (self) {
		// @TODO
	},

	render : function(self) {
		
		var ctx = $.jController.getContext();
		ctx.save();
		self.attr.t = new Date().getTime() * 0.002;
		self.attr.x = Math.sin(self.attr.t)       * 192 + 256;
		self.attr.y = Math.cos(self.attr.t * 0.9) * 192 + 256;
		self.attr.c = 1;//Math.floor(Math.random() * self.attr.colors.length);

		if (self.attr.trace) {
			$.jController.clearCanvas(false);
		}
		//console.log(self);
		var t = self.render("circle", {
			x: self.attr.x,
			y: self.attr.y,
			r: self.attr.r,
			color: self.attr.colors[self.attr.c],
			fill:  self.attr.colors[self.attr.c],
		});
		ctx.restore();
		//console.log(t);
		
	},

	events : {

		click : {

			listener : "click",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if ($.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.attr.x,
					cy : self.attr.y,
					cr : self.attr.r,
				})) {
					callback(self, data);
				}
			}
		}
	}
})