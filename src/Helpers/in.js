
/**
 * whether we are in a circle or not
 * args :
 * p(x,y)   = point position
 * c(x,y,r) = circle position and radius
 */
$.jController.registerHelper({
	name : "inCircle",
	fn : function(args) {
		var a = Math.pow(args.px - args.cx, 2);
		var b = Math.pow(args.py - args.cy, 2);
		var c = Math.pow(args.cr, 2);
		return (a + b < c);
	},
})

/**
 * whether we are in a rect or not
 * args :
 * p(x,y)     = point position
 * r(x,y,w,h) = rect position and size
 */
$.jController.registerHelper({
	name : "inRect",
	fn : function(args) {
		var x = args.rx <= args.px <= args.rx + args.rw;
		var y = args.ry <= args.py <= args.ry + args.rh
		return (x && y)
	},
})
