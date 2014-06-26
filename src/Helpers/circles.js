
/**
 * whether we are in a circle or not
 * params :
 * p(x,y)   = point position
 * c(x,y,r) = circle position and radius
 */
$.jController.registerHelper({
	name : "inCircle",
	fn : function(params) {
		var r  = params.cr;
		var dx = params.px - params.cx;
		var dy = params.py - params.cy;
		
		return (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(r, 2))
	},
})
