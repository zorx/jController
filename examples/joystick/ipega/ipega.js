
/* Import jController files */
$.jController.import([
	{ dir : "../../../plugins", files : ["rect", "arc", "circle",] },
	{ dir : "../../../helpers", files : ["canvas",] },
]
/* Ipega controller */
, function() {

	/* Ipega components */
	var buttonA = $.jController.button({
		x : 500,
		y : 100,
		r : 20,

		down : function(self, data) {
			$.jController.trigger("buttonA", {
				event: "down",
				self: self,
				data : data,
			});
		},

		up : function(self, data) {
			$.jController.trigger("buttonA", {
				event: "up",
				self: self,
				data : data,
			});
		},

		push : function(self, data) {
			$.jController.trigger("buttonA", {
				event: "push",
				self: self,
				data : data,
			});
		},
	});

	var buttonB = $.jController.button({
		x : 500,
		y : 150,
		r : 20,

		down : function(self, data) {
			$.jController.trigger("buttonB", {
				event: "down",
				self: self,
				data : data,
			});
		},

		up : function(self, data) {
			$.jController.trigger("buttonB", {
				event: "up",
				self: self,
				data : data,
			});
		},

		push : function(self, data) {
			$.jController.trigger("buttonB", {
				event: "push",
				self: self,
				data : data,
			});
		},
	});

	/* Start controller */
	$("#jController").jController({

		attr : {
			width : 600,
			height : 250,
		},

		events : {
			buttonA : function(data) {
				console.log("buttonA : ", data);
			},

			buttonB : function(data) {
				console.log("buttonB : ", data);
			},
		},

	});

});