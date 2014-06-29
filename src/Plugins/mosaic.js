
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

		var t = new Date().getTime() * 0.002;
		var x = Math.sin(t)       * 192 + 256;
		var y = Math.cos(t * 0.9) * 192 + 256;
		var c = Math.floor(Math.random() * self.params.colors.length);

		if (self.params.trace) {
			$.jController.clearCanvas(false);
		}

		self.render("circle", {
			x: x,
			y: y,
			r: self.params.r,
			color: self.params.colors[c],
			fill:  self.params.colors[c],
		});

		/*
		ctx.fillStyle = self.params.colors[c];
		ctx.beginPath();
		ctx.arc( x, y, self.params.r, 0, Math.PI * 2, true );
		ctx.closePath();
		ctx.fill();
		*/

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