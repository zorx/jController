
// Add rect plugin
$.jController.registerPlugin({
	name: "rect",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
		}

		return $.extend({}, defaults, params);
	},

	render : function(self) {

		var params = self.params;
		$.jController.getHelper("contextDraw")({
			ctx : $.jController.getContext(),
			color : params.color,
			fill  : params.fill,
			lineWidth : params.lineWidth,
			shadow : params.shadow,
			draw : function (ctx) {
				ctx.rect(params.x, params.y, params.w, params.h);
			},
		})

	},

	events : {

		click : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("click", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if ($.jController.getHelper("inRect")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(e);
				}
			});
		},

		mousemove : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if ($.jController.getHelper("inRect")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(e);
				}
			});
		},

		mousein : function(self, callback) {

			self.setInternal({mousedIn : false});
			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if (! self.getInternal("mousedIn") && 
					$.jController.getHelper("inRect")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(e);
					self.setInternal({mousedIn : true});
				}
			});
		},

		mouseout : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				var self = e.data.self;
				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inRect")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					rx : self.params.x,
					ry : self.params.y,
					rw : self.params.w,
					rh : self.params.h,
				})) {
					callback(e);
					self.setInternal({mousedIn : false});
				}
			});

			$canvas.on("mouseout", {self: self, callback: callback}, function(e) {
				callback(e);
				e.data.self.setInternal({mousedIn : false});
			});
		},

	},
})