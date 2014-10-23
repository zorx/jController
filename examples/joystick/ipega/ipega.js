
/* Ipega controller */
$(function() {

	/* Ipega components */
	var buttonA = $.jController.button({
		x : 480,
		y : 130,
		label : "A",
		push : function(self, data) {
			$.jController.trigger("buttonA", {self:self, data:data});
		},
	});

	var buttonB = $.jController.button({
		x : 520,
		y : 90,
		label : "B",
		push : function(self, data) {
			$.jController.trigger("buttonB", {self:self, data:data});
		},
	});

	/*
	var buttonX = $.jController.button({
		x : 440,
		y : 90,
		label : "X",
		push : function(self, data) {
			$.jController.trigger("buttonX", {self:self, data:data});
		},
	});

	var buttonY = $.jController.button({
		x : 480,
		y : 50,
		label : "Y",
		push : function(self, data) {
			$.jController.trigger("buttonY", {self:self, data:data});
		},
	});
	*/

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

			buttonX : function(data) {
				console.log("buttonX : ", data);
			},

			buttonY : function(data) {
				console.log("buttonY : ", data);
			},
		},

	});

});
