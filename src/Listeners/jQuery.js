// jQuery Listeners : http://api.jquery.com/category/events/

// Register jQuery click listener

$.jController.registerListener({

	name : "click",

	on : function(callback) {
		$.jController
			.getCanvasObject()
			.on("click", callback);
	},

	off : function(callback) {
		$.jController
			.getCanvasObject()
			.off("click", callback);
	}
		
});


// Register jQuery mousemove listener

$.jController.registerListener({

	name : "mousemove",

	on : function(callback) {
		$.jController
			.getCanvasObject()
			.on("mousemove", callback);
	},

	off : function(callback) {
		$.jController
			.getCanvasObject()
			.off("mousemove", callback);
	}
		
});