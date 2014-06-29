
/**
 * whether we are in a circle or not
 * args :
 * px,py = point position
 * cx,cy,cr = circle position and radius
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
 * px,py = point position
 * rx,ry,rw, rh = rect position and size
 */
$.jController.registerHelper({
	name : "inRect",
	fn : function(args) {
		var x = args.rx <= args.px && args.px <= args.rx + args.rw;
		var y = args.ry <= args.py && args.py <= args.ry + args.rh;
		return (x && y)
	},
})

/**
 * whether we are in a path
 * args :
 * px,py = point position
 * draw = instructions to draw path [function(ctx){}]
 */
$.jController.registerHelper({
	name : "inPath",
	fn : function(args) {
		// Get context
		var ctx = $.jController.getContext();

		// Save
		ctx.save();
		ctx.beginPath();

		// Draw path
		args.draw(ctx);

		// Check in
		var result = ctx.isPointInPath(args.px, args.py);

		// Restore
		ctx.closePath();
		ctx.restore();

		return result;
	},
})
