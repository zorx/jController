// jController object
$.jController = new Object();

// jController plugins list (private) [@TODO]
$.jController._plugins = new Object();

// jController Listener list (private) [@TODO]
$.jController._listeners = new Object();

// jController Events list (private) [@TODO]
$.jController._Events = new Object();

// jController Properties list (private) [@TODO]
$.jController._Properties = new Object();



// jQuery jController function definition
$.fn.jController = function (callback) {

	// @TODO: use callback parameter (or remove it)

	var _canvas = this;
	// Get canvas context
	var ctx = _canvas[0].getContext("2d");
	
	// For each declared listener
	$.each($.jController._listeners, function(name, listener) {

		// Start listener and save response
		listener.fn(_canvas, function(e) {
			$.jController._listeners[name].response = e;
		})

	})


	// For each declared plugin
	$.each($.jController._plugins, function(name, p) {

		// Construct and render each one
		$.each(p.paramsList, function(i, params) {

			// @TODO : handle default params by using
			// $.extend({}, default, params) for missing params
			
			// Render plugin
			p.render(ctx, params);
		})

	})

	return this;
}

// Register Listener
$.jController.registerListener = function(listener) {
	
	// Check wether the name has been set
	if (listener.name) {

		// Create new object of listener
		$.jController._listeners[listener.name] = new Object();
		
		// Register listener function into _listeners[name].render
		$.jController._listeners[listener.name].fn = listener.fn;

		// init response to null
		$.jController._listeners[listener.name].response = null;

	}

}

// Register Plugin
$.jController.registerPlugin = function(plugin) {
	
	// Check wether the name has been set
	if (plugin.name) {
		
		// Create new object of plugin
		$.jController._plugins[plugin.name] = new Object();

		// With params (list)
		$.jController._plugins[plugin.name].paramsList = [];

		// Register plugin function into _plugins[name].render
		$.jController._plugins[plugin.name].render = plugin.render;
		
		// Add plugin function
		// Ex : $.jController.arc({[...]}) adds an arc into the controller
		$.jController[plugin.name] = function(params) {
			$.jController._plugins[plugin.name].paramsList.push (params)
		}

	}

}

// "click" Listener

$.jController.registerListener({
	name:"click",
	fn : function(canvas,callback)
	{
		canvas.click(callback);
	}
});


/*
@TODO use the same method as registerPlugin to create addEvent (Ex : click,touch etc..) & AddProperty (Ex : draggable:true)
We can use .on & .trigger from jquery cf : http://api.jquery.com/trigger/
Each plugin can use either the default event or a specific one (so we have to edit registerPlugin)

Ex of event :

$.jController.registerEvent({
	name:"click",
	listener : "click",
	fn : function(ctx,fn)
	{
		
	}

});

*/


// -------- PLUGINS ----------

// Most basic plugins (REF: http://www.w3schools.com/tags/ref_canvas.asp)

// Arc plugin
$.jController.registerPlugin({
	name : "arc",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.arc(params.x, params.y, params.r, params.angleStart, params.angleEnd);
		ctx.stroke();
	},
})

// Line plugin
$.jController.registerPlugin({
	name : "line",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.moveTo(params.x, params.y);
		ctx.lineTo(params.w, params.h);
		ctx.stroke();
	},
})

// Rect plugin
$.jController.registerPlugin({
	name: "rect",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.rect(params.x, params.y, params.w, params.h);
		ctx.stroke();
	},
})

// Add circle plugin (based on arc)
$.jController.registerPlugin({
	name : "circle",
	render : function(ctx, params) {
		$.jController.circle({
			x: "275",
			y: "150",
			r: "20",
			angleStart: 0,
			angleEnd: 2 * Math.PI,
		})
	},
})

// @TODO : SVG plugin, Image plugin, etc.
