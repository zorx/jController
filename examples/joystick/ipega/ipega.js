
/* Import jController files */
$.jController.import([
	{ dir : "../../../plugins", files : ["rect", "arc", "circle",] },
	{ dir : "../../../helpers", files : ["canvas",] },
]
/* Ipega controller */
, function() {

	/* Ipega components */
	var buttonA = $.jController.button({
		x : 100,
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

	/* Start controller */
	$("#jController").jController({

		attr : {
			width : 512,
			height : 512,
		},

		events : {
			buttonA : function(data) {
				console.log("buttonA : ", data);
			}
		},

	});

});