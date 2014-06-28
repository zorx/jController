
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
		
		// Render another plugin
		self.render("arc",{
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
			//console.log(self);
			var $canvas = $.jController.getCanvasObject();

			$canvas.on("click", function(e) {
				
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {

					callback(self);
				}
			});
		},

		mousemove : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", function(e) {
				
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					callback(self);
				}
			});
		},

		mousein : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			self.setInternal({mousedIn:false});
			
			$canvas.on("mousemove", function(e) {
				
				if (! self.getInternal("mousedIn") &&
					$.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					self.setInternal({mousedIn:true});
					callback(self);
				}
			});
		},

		mouseout : function(self, callback) {

			var $canvas = $.jController.getCanvasObject();

			$canvas.on("mousemove", function(e) {
				
				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {

					callback(self);
					self.setInternal({mousedIn:false});
				}
			});

		},
	},
})