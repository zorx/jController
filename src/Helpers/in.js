
/**
 * whether we are in a circle or not
 * args :
 * p(x,y)   = point position
 * c(x,y,r) = circle position and radius
 */
$.jController.registerHelper({
	name : "inCircle",
	fn : function(args) {
		return (Math.pow(args.px - args.cx, 2) + Math.pow(args.py - args.cy, 2) < Math.pow(args.cr, 2))
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
		return (args.rx <= args.px <= args.rx + args.rw && args.ry <= args.py <= args.ry + args.rh)
	},
})
