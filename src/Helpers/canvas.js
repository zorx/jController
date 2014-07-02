
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
	name : "canvasDraw",
	fn : function(args) {
		
		// Default values
		var defaults = {
			ctx : $.jController.getContext(),
			line : {
				width : 1,
				cap   : "butt",
				join  : "miter",
				miterLimit : 10,
			},
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
		args.ctx.lineWidth  = args.line.width;
		args.ctx.lineCap    = args.line.cap;
		args.ctx.lineJoin   = args.line.join;
		args.ctx.miterLimit = args.line.miterLimit;

		// Actually draw what should be drawn
		args.draw();
		
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


/**
 * Handle canvas to write text
 * args :
 * ctx = canvas context
 * text = what should be written
 * x,y  = where it should go
 * font = text font
 * align
 * baseline
 * color = text color (fill)
 * outline = text outline (stroke)
 * shadow : { color, blur, offX, offY }
 */
$.jController.registerHelper({
	name : "canvasWrite",
	fn : function(args) {

		// Default values
		var defaults = {
			ctx : $.jController.getContext(),
			x : 0,
			y : 0,
			text  : undefined,
			font  : "10px sans-serif",
			align : "start",
			baseline : "bottom",
			color    : "black",
			outline  : undefined,
			shadow   : {
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

		// Set font
		args.ctx.font         = args.font;
		args.ctx.textAlign    = args.align; 
		args.ctx.textBaseline = args.baseline;

		// Shadows
		if (args.shadow.blur > 0) {
			args.ctx.shadowColor   = args.shadow.color;
			args.ctx.shadowBlur    = args.shadow.blur;
			args.ctx.shadowOffsetX = args.shadow.offX;
			args.ctx.shadowOffsetY = args.shadow.offY;
		}

		// Font color (fill)
		if (args.color != undefined) {
			args.ctx.fillStyle = args.color;
			args.ctx.fillText(args.text, args.x, args.y);
		}

		// Font outline (stroke)
		if (args.outline != undefined) {
			args.ctx.strokeStyle = args.outline;
			args.ctx.strokeText(args.text, args.x, args.y);
		}

		// Restore context
		args.ctx.restore();

	}
})