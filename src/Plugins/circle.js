
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

	path : function(self) {
		// @TODO : utiliser le plugin arc
		$.jController
			.getContext()
			.arc(self.attr.x, self.attr.y, self.attr.r, 0, 2.*Math.PI);
	},

	render : function(self) {
		
		// Circles are full arcs
		self.render("arc", {
			x: self.attr.x,
			y: self.attr.y,
			r: self.attr.r,
			angleStart: 0,
			angleEnd:   2 * Math.PI,
			color:  self.attr.color,
			fill:   self.attr.fill,
			line:   self.attr.line,
			shadow: self.attr.shadow,
		});

	},

	events : {
		
		click : {

			listener : "click",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if (self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {

					callback(self, data);
				}
			}
		},

		mousemove : {

			listener : "mousemove",

			fn : function (self, callback, data) {
				
				var canvas = $.jController.getCanvas();

				if (self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
					callback(self, data);
				}
			}
		},

		mousein : {

			listener : "mousemove",

			fn : function (self, callback, data) {

				var canvas = $.jController.getCanvas();

				if (! self.getInternal("mousedIn") &&
					self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
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
					! self.inPath(
					data.pageX - canvas.offsetLeft,
					data.pageY - canvas.offsetTop
				)) {
					callback(self, data);
					self.setInternal({mousedIn:false});
				}
			}

		},

		jump : {

			fn : function (self,callback,data) {

				self.attr.y = self.attr.y+2;
				var ismosaic = self.getInternal("mosaic");

				if (ismosaic)
				{
					self.getInternal("mosaicobj").remove();
					self.setInternal({mosaic:false});
				}else
				{
					self.setInternal({mosaic:true});

					// Circles are full arcs
					var hello = $.jController.mosaic({
				    	colors : ["rgb(250, 250, 250)", "rgb(230,220,100)", "rgb(230,180,60)","rgb(250,50,10)","rgb(255,0,0)"],
				    	trace : false,
				    	r:50,
				    	//callbackOnEvent
				    	click : function (self) {
				    		console.log("Yeah !");
			                self.attr.r -= 5;
			                if (self.attr.r < 5) {
			                    self.attr.r = 50;
			                }
			            }
					});
					self.setInternal({mosaicobj:hello});
				}

				
				callback(self,data);
			}
		}
	},
})