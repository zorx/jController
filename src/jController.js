// jController object
$.jController = new Object();

// jController plugins list (private) [@TODO]
$.jController._plugins = new Object();

// jController Listener list (private) [@TODO]
$.jController._listeners = new Object();

// jController Events list (private) [@TODO]
$.jController._events = new Object();

// jController Properties list (private) [@TODO]
$.jController._properties = new Object();

// jQuery jController function definition
$.fn.jController = function (callback) {
 
	// Get canvas & context
 	var _canvas = this;
	var context = _canvas[0].getContext("2d");
	
	// For each declared listener
	$.each($.jController._listeners, function(name, listener) {

		// Start listener and save response
		listener.fn(_canvas, function(e) {
			$.jController._listeners[name].response = e;
		})

	})

	// Retrieve All events from params

	var retrieveEvents = function(params,index,pluginName) {

		$.each(params,function(paramName,paramValue){

			// looking for events on params
			if(typeof $.jController._events[paramName] === "object" && typeof paramValue === "function") {

				// paramValue in this case is a callback
				console.log(paramName,index,paramValue,pluginName);
			}
			
		});
	}

	var renderAll = function () {

		// For each declared plugin
		$.each($.jController._plugins, function(pluginName, pluginObject) {

			// Not render yet
			if (!pluginObject.isRender && pluginObject.paramsList.length != 0) {

				// Construct and render each one
				$.each(pluginObject.paramsList, function(index, params) {
					// @TODO : handle default params by using
					// $.extend({}, default, params) for missing params

					// Retrieve All events from params
					retrieveEvents(params,index,pluginName);

					// Render plugin
					pluginObject.render(context, params);

				})

				$.jController._plugins[pluginName].isRender = true;
				
				renderAll();
			}

		})
	}

	// Recusively render everything
	renderAll();

	return this;
}

/* -- Listeners config -- */

// Retrieve all listeners
$.jController.getAllListeners = function() {

	return $.jController._listeners;
}

// Retrieve listener by name
$.jController.getListener = function(name) {

	// return the event if exists otherwise null
	return ($.jController.getListener(name)) ? $.jController._listeners[name] : null;
}

// Check wether a listener exists or nor
$.jController.isListener = function(name) {

	return (typeof $.jController._listeners[name] === "object");
}


// Register Listener
$.jController.registerListener = function(listener) {
	
	// Check wether the name has been set
	if (listener.name) {

		// Create new object of listener
		$.jController._listeners[listener.name] = new Object();
		
		// Register listener function
		$.jController._listeners[listener.name].fn = listener.fn;

		// init response to null
		$.jController._listeners[listener.name].response = null;

	}

}

/* -- Events config -- */


// Retrieve all events
$.jController.getAllEvents = function() {

	return $.jController._events;
}

// Retrieve events by name
$.jController.getEvent = function(name) {

	// return the event if exists otherwise null
	return ($.jController.isEvent(name)) ? $.jController._events[name] : null;
}

// Check wether an Event exists or nor
$.jController.isEvent = function(name) {

	return (typeof $.jController._events[name] === "object");
}

// Register Event
$.jController.registerEvent = function(event) {
	
	// Check wether the name has been set
	if (event.name) {

		// Create new object of event
		$.jController._events[event.name] = new Object();
		
		// Register event function into _events[name].render
		$.jController._events[event.name].fn = event.fn;

		// init response to null
		$.jController._events[event.name].response = null;

	}

}

/* -- Plugins config  -- */

// Retrieve all plugins
$.jController.getAllPlugins = function() {

	return $.jController._plugins;
}

// Retrieve plugin by name
$.jController.getPlugin = function(name) {

	// return the plugin if exists otherwise null
	return ($.jController.isPlugin(name)) ? $.jController._plugins[name] : null;
}

// Check wether a Plugin exists or nor
$.jController.isPlugin = function(name) {

	return (typeof $.jController._plugins[name] === "object");
}

// Register Plugin
$.jController.registerPlugin = function(plugin) {
	
	// Check wether the name has been set
	if (plugin.name) {
		// Create new object of plugin
		$.jController._plugins[plugin.name] = new Object();

		// With params (list)
		$.jController._plugins[plugin.name].paramsList = [];

		// Register plugin rendering function
		$.jController._plugins[plugin.name].render = plugin.render;

		// Plugin already rendered ?
		$.jController._plugins[plugin.name].isRender = false;
		
		// Add plugin function
		// Ex : $.jController.arc({[...]}) adds an arc into the controller
		$.jController[plugin.name] = function(params) {
			$.jController._plugins[plugin.name].paramsList.push (params)
		}
	}
	
}

// -------- Create Listeners ----------

// "click" Listener

$.jController.registerListener({
	name:"click",
	fn : function(canvas,callback)
	{
		canvas.click(callback);
	}
});

// "mouseover" Listener
$.jController.registerListener({
	name:"mouseover",
	fn : function(canvas,callback)
	{
		canvas.mouseover(callback);
	}
});


/*
@TODO use the same method as registerPlugin to create addEvent (Ex : click,touch etc..) & AddProperty (Ex : draggable:true)
We can use .on & .trigger from jquery cf : http://api.jquery.com/trigger/
Each plugin can use either the default event or a specific one (so we have to edit registerPlugin)

All events must send true/false



*/

// -------- Create Events ----------

// "click" event
$.jController.registerEvent({
	name : "click",
	listener : "click",
	fn : function(params, listener) {
		var x0 = params.x
		var y0 = params.y;
		var r  = params.r;

		var x1 = listener.clientX;
		var y1 = listener.clientY;
		
		return (Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r);
	}
});

// -------- Create PLUGINS ----------

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

// Circle plugin (based on Arc)
$.jController.registerPlugin({
	name : "circle",
	render : function(ctx, params) {
		$.jController.arc({
			x: params.x,
			y: params.y,
			r: params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI,
		})
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

// Add rect plugin
$.jController.registerPlugin({
	name: "rect",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.rect(params.x, params.y, params.w, params.h);
		ctx.stroke();
	},
})

// @TODO : SVG plugin, Image plugin, etc.
