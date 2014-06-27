
/**
 * Handle canvas to draw
 * args :
 * ctx = canvas context
 * draw() = what should be done
 * color = "pen" color
 * lineWidth
 * fill = canvas fillStyle
 * shadow : { color, blur, offX, offY }
 */
$.jController.registerHelper({
	name : "contextDraw",
	fn : function(args) {

		// Default values
		var defaults = {
			lineWidth: 1,
			color: "black",
			fill: undefined,
			shadow : {
				color: "black",
				blur : 0,
				offX : 0,
				offY : 0,
			}
		};

		// Merge args with default settings
		args = $.extend(true, {}, defaults, args);

		// Save context
		args.ctx.save();

		// Begin path
		args.ctx.beginPath();

		// Set args into context
		args.ctx.lineWidth  = args.lineWidth;


		// Actually draw what should be drawn
		args.draw(args.ctx);
		// Put shadows ?
		if (args.shadow.blur > 0) {
			args.ctx.shadowColor   = args.shadow.color;
			args.ctx.shadowBlur    = args.shadow.blur;
			args.ctx.shadowOffsetX = args.shadow.offX;
			args.ctx.shadowOffsetY = args.shadow.offY;
		}

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

		// Restore context
		args.ctx.restore();

		return true;
	}
})
