
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
		
		// Circles are full arcs
		self.render("arc", {
			x: self.params.x,
			y: self.params.y,
			r: self.params.r,
			angleStart: 0,
			angleEnd:   2 * Math.PI,
			color:  self.params.color,
			fill:   self.params.fill,
			line:   self.params.line,
			shadow: self.params.shadow,
		});

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
		},

		mousemove : {

			listener : "mousemove",

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
		},

		mousein : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if (! self.getInternal("mousedIn") &&
					$.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					self.setInternal({mousedIn:true});
					callback(self, data);
				}
			}
		},

		mouseout : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if (self.getInternal("mousedIn") &&
					! $.jController.getHelper("inCircle")({
					px : data.pageX - canvas.offsetLeft,
					py : data.pageY - canvas.offsetTop,
					cx : self.params.x,
					cy : self.params.y,
					cr : self.params.r,
				})) {
					callback(self, data);
					self.setInternal({mousedIn:false});
				}
			}

		},

		jump : {

			fn : function (self,callback,data) {

				self.params.y = self.params.y+2;
				
				// Circles are full arcs
				$.jController.mosaic({
			    	colors : ["rgb(250, 250, 250)", "rgb(230,220,100)", "rgb(230,180,60)","rgb(250,50,10)","rgb(255,0,0)"],
			    	trace : false,
			    	r:50,
			    	//callbackOnEvent
			    	click : function (self) {
			    		console.log("Yeah !");
		                self.params.r -= 5;
		                if (self.params.r < 5) {
		                    self.params.r = 50;
		                }
		            }
				});

				callback(self,data);
			}
		}
	},
})