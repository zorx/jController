
/* Import jController files */
$.jController.import([
	{ dir : "../../../plugins", files : ["rect", "arc", "circle",] },
	{ dir : "../../../helpers", files : ["canvas",] },
]
/* Ipega controller */
, function() {

	/* Ipega components */
	var buttonA = $.jController.circle({
		x : 100,
		y : 100,
		r : 20,

		click : function(self) {
			$.jController.trigger("buttonA", { event: "click", });
		}
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