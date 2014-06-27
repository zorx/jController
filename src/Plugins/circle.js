
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	name : "circle",

	// note: je propose qu'on l'appelle construct (ref aux objets)
	properties : function(params)
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
					cx : params.x,
					cy : params.y,
					cr : params.r,
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
					cx : params.x,
					cy : params.y,
					cr : params.r,
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
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				}) && !self.getInternal("_in")) {
					
					self.setInternal({_in:true});
						callback(e, self);
					
				}
			});
		},

		mouseout : function ($canvas, self, callback) {
			
			$canvas.on("mousemove", {self:self, callback: callback}, function(e) {
				if (!$.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				}) && self.getInternal("_in")) {
					
					callback(e, self);
					self.setInternal({_in:false});

				}
			});
		}
	}
})