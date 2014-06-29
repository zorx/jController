
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	name : "circle",

	construct : function(params) {
		var defaults = {
			x : 0,
			y : 0,
			r : 0,
		}

		/**
		@TODO: gérer un internal par défaut
		cf mousein out qui a besoin de mousedIn à false au début
		pour éviter le "si undef mettre à false"

		le souci c'est qu'il faut avoir accès à self d'ici pour faire ça,
		et j'ai regardé il n'est pas encore accessible d'ici lorsque cette
		fonction est appellée

		de manière générale, on est en train d'atteindre les limites du système actuel, vu qu'on peut pas affecter les instances de plugin et les utiliser (genre a1 = $.jC.arc()   a1.on("click", function() {}), etc.)
		on va avoir du mal à vraiment faire un système cohérent ou chaque instance a son état interne mais est liée à la "classe" a laquelle est appartient
		là on est train de fix au fur et à mesure mais je pense qu'on va vite se heurter à des murs ...
		*/

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

				/*
				// @TODO : gérer état initial dans le construct (cf construct)
				if (typeof self.getInternal("mousedIn") == "undefined") {
					console.log(self)
					console.log(typeof self.getInternal("mousedIn"))
					console.log("mousedIn (init)")
					self.setInternal({mousedIn:false});
					console.log(typeof self.getInternal("mousedIn"))
					console.log("---")
				}
				*/

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
	},
})