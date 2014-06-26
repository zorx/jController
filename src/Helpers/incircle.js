// jController Helper

// inCircle, whether we are in a circle or not

$.jController.registerHelper({
	name : "inCircle",
	fn : function(params) {
		var p = params;

		var r  = p.radius;
		var dx = p.px - p.x;
		var dy = p.py - p.y;
		
		return (Math.pow(dx,2)+Math.pow(dy,2) < Math.pow(r,2))
	},
})