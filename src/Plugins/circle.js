
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "circle",

	construct : function(params)
	{
		var defaults = {
			x : 0,
			y : 0,
			r : 0
		}

		return $.extend({}, defaults, params);
	},

	render : function(ctx, self) {
		$.jController.arc({
			x: self.x,
			y: self.y,
			r: self.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI
		})
	},

	events : {
		
		click : function($canvas, self, callback) {
			
			$canvas.on("click", {params: self.params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : e.data.params.x,
					cy : e.data.params.y,
					cr : e.data.params.r,
				})) {
					callback(e);
				}
			});
		},

		mousemove : function ($canvas, self, callback) {
			$canvas.on("mousemove", {params: self.params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : e.data.params.x,
					cy : e.data.params.y,
					cr : e.data.params.r,
				})) {
					callback(e);
				}
			});
		},

		mousein : function ($canvas, self, callback) {
			
			// Set Internal var
			self.setInternal({_in:false});


			$canvas.on("mousemove", {self: self, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : e.data.self.params.x,
					cy : e.data.self.params.y,
					cr : e.data.self.params.r,
				}) && !self.getInternal("_in")) {
					
					e.data.self.setInternal({_in:true});
						callback(e, e.data.self);
					
				}
			});
		},

		mouseout : function ($canvas, self, callback) {
			
			$canvas.on("mousemove", {self:self, callback: callback}, function(e) {
				if (!$.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : e.data.self.params.x,
					cy : e.data.self.params.y,
					cr : e.data.self.params.r,
				}) && self.getInternal("_in")) {
					
					callback(e, e.data.self);
					e.data.self.setInternal({_in:false});

				}
			});
		}
	}
})