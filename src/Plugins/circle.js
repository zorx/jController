
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

		$.jController.arc({
			x: self.params.x,
			y: self.params.y,
			r: self.params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI,
			color: self.params.color,
			fill: self.params.fill,
			line: self.params.line,
			shadow: self.params.shadow,
		})

	},

	events : {
		
		click : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("click", {self: self, callback: callback}, function(e) {
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

		mousemove : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

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

		mousein : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			self.setInternal({mousedIn:false});
			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if (! self.getInternal("mousedIn") &&
					$.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					self.setInternal({mousedIn:true});
					callback(e);
				}
			});
		},

		mouseout : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if (self.getInternal("mousedIn" &&
					! $.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				}))) {
					callback(e);
					self.setInternal({mousedIn:false});
				}
			});

			$canvas.on("mouseout", {self: self, callback: callback}, function(e) {
				callback(e);
				e.data.self.setInternal({mousedIn : false});
			});
		},
	},
})