
/**
 * Handle canvas to draw
 * args :
 * ctx = canvas context
 * draw() = what should be done
 * color = "pen" color
 * lineWidth
 * fill : canvas fillStyle
 */
$.jController.registerHelper({
	name : "contextDraw",
	fn : function(args) {

		// Default values
		var defaults = {};

		// Merge args with default settings
		args = $.extend({}, defaults, args);

		// Begin path
		args.ctx.beginPath();

		// Set args into context
		args.ctx.lineWidth  = args.lineWidth;

		// Actually draw what should be drawn
		args.draw(args.ctx);

		// Fill it ?
		if (args.fill != undefined) {
			args.ctx.fillStyle = args.fill;
			args.ctx.fill();
		}

		// Stroke it ?
		if (args.color != undefined) {
			args.ctx.strokeStyle = args.color;
			args.ctx.stroke();
		}

		// Close path
		args.ctx.closePath();

		return true;
	}
})
