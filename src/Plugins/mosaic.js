
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

	render : function(self) {
		
		var ctx = $.jController.getContext();
		ctx.save();
		self.params.t = new Date().getTime() * 0.002;
		self.params.x = Math.sin(self.params.t)       * 192 + 256;
		self.params.y = Math.cos(self.params.t * 0.9) * 192 + 256;
		self.params.c = 1;//Math.floor(Math.random() * self.params.colors.length);

		if (self.params.trace) {
			$.jController.clearCanvas(false);
		}
		//console.log(self);
		var t = self.render("circle", {
			x: self.params.x,
			y: self.params.y,
			r: self.params.r,
			color: self.params.colors[self.params.c],
			fill:  self.params.colors[self.params.c],
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
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					callback(self, data);
				}
			}
		}
	}
})