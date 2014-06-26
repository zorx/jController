
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	// Plugin Name
	name : "circle",

	// Render Plugin
	render : function(ctx, params) {
		$.jController.arc({
			x: params.x,
			y: params.y,
			r: params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI
		})
	},

	// Plugin Events
	events : {
		click : function($canvas, params, callback) {
			$canvas.on("click", {params: params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				})) {
					callback(e);
				}
			});
		},

		mousemove : function ($canvas, params, callback) {
			$canvas.on("mousemove", {params: params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				})) {
					callback(e);
				}
			});
		}
	}
})