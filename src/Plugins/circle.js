
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	name : "circle",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 0,
			color: "black",
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, params) {
		$.jController.arc({
			x: params.x,
			y: params.y,
			r: params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI,
			color: params.color,
		})
	},

	events : {
		
		click : function($canvas, self, callback) {
			$canvas.on("click", {self: self, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : e.data.self.params.x,
					cy : e.data.self.params.y,
					cr : e.data.self.params.r,
				})) {
					callback(e);
				}
			});
		},

		mousemove : function($canvas, self, callback) {
			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					callback(e);
				}
			});
		},

		mousein : function($canvas, self, callback) {
			self.setInternal({mousedIn:false});
			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				}) && !self.getInternal("mousedIn")) {
					self.setInternal({mousedIn:true});
					callback(e);
				}
			});
		},

		mouseout : function($canvas, self, callback) {
			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if (! $.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				}) && self.getInternal("mousedIn")) {
					callback(e);
					self.setInternal({mousedIn:false});
				}
			});
		},
	},
})