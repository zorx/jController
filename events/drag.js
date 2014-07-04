// drag Event
$.jController.registerEvent({

	name : "drag",

	listener : ["pointerdown","pointerup","mousemove"],

	fn : function (self, callback, data) {
		
		var canvas = $.jController.getCanvas();
		
		if (data.type == "pointerdown") {
			if (self.inPath(
				data.pageX - canvas.offsetLeft,
				data.pageY - canvas.offsetTop
			)) {

				self.setInternal({
					__draggable : {
							x : data.pageX,
							y : data.pageY
						}
				});
			}
		}

		else if (data.type == "pointerup") {

			self.setInternal({__draggable:false});
		}

		else if (data.type == "mousemove") {

			var draggable = self.getInternal("__draggable");

			if (draggable) {
				self.setInternal({
					__draggable : {
							x : data.pageX,
							y : data.pageY
						}
				});
				self.attr.x = self.attr.x + (data.pageX - draggable.x)
				self.attr.y = self.attr.y + (data.pageY - draggable.y)
				callback(self,data);
			}
		}
	}
});