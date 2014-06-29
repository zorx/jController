// jQuery Listeners : http://api.jquery.com/category/events/

// Register click Listener

$.jController.registerListener({

	name : "click",

	on : function(callback) {

		var $canvas = $.jController.getCanvasObject();
		$canvas.on("click",callback);
	},

	off : function(callback) {

		var $canvas = $.jController.getCanvasObject();
		$canvas.off("click",callback);
	}
		
});


// Register mousemove Listener

$.jController.registerListener({

	name : "mousemove",

	on : function(callback) {

		var $canvas = $.jController.getCanvasObject();
		$canvas.on("mousemove",callback);
	},

	off : function(callback) {

		var $canvas = $.jController.getCanvasObject();
		$canvas.off("mousemove",callback);
	}
		
});