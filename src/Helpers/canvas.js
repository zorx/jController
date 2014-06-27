
/**
 * Set canvas context to draw (color, line width, etc.)
 * args :
 * ctx = canvas context
 * color = "pen" color
 * lineWidth
 */
$.jController.registerHelper({
	name : "contextSet",
	fn : function(args) {
		args.ctx.strokeStyle = args.color;
		args.ctx.lineWidth   = args.lineWidth;
		return true;
	},
})

/**
 * Reset canvas context for next uses
 * args :
 * ctx = canvas context
 */
$.jController.registerHelper({
	name : "contextReset",
	fn : function(args) {
		args.ctx.strokeStyle = "black";
		args.ctx.lineWidth = 1;

		return true;
	},
})
