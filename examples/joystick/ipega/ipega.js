
/* Import jController files */
$.jController.import([
	{ dir : "../../../plugins", files : ["rect", "arc", "circle",] },
	{ dir : "../../../helpers", files : ["canvas",] },
	{ dir : "./plugins", files : ["button",] },
]
/* Ipega controller */
, function() {

	/* Ipega components */
	var buttonA = $.jController.button({
		x : 100,
		y : 100,
		r : 20,

		down : function(self) {
			$.jController.trigger("buttonA", { event: "down", });
		},

		up : function(self) {
			$.jController.trigger("buttonA", { event: "up", });
		},

		push : function(self) {
			$.jController.trigger("buttonA", { event: "push", });
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