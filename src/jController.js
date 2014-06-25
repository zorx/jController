// create closure
(function($) {

	// jController object
	$.jController = new Object();

	// jController plugins list (private)
	var _plugins = new Object();

	// jController Listener list (private)
	var _listeners = new Object();

	// jController Properties list (private)
	var _properties = new Object();

	// jQuery jController function definition
	$.fn.jController = function (callback) {
	 
		// Get canvas & context
	 	var canvasObj = this;
		var context = canvasObj[0].getContext("2d");
		
		// For each declared listener
		$.each(_listeners, function(name, listener) {

			// Start listener and save response
			listener.fn(canvasObj, function(e) {
				_listeners[name].response = e;
			})

		})

		// Retrieve All events from params

		var retrieveEvents = function(params,index,pluginName) {

			$.each(params,function(paramName,paramValue){

				// looking for events on params
				if($.jController.isEvent(pluginName,paramName) && $.isFunction(paramValue)) {

					// paramValue in this case is a callback
					console.log(paramName,index,paramValue,pluginName);
				}
				
			});
		}

		var renderAll = function () {

			// For each declared plugin
			$.each(_plugins, function(pluginName, pluginObject) {

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

					_plugins[pluginName].isRender = true;
					
					renderAll();
				}

			})
		}

		// Recusively render everything
		renderAll();

		return this;
	}

	/* -- Trigger -- */

	$.jController.getTriggerPrefix = function()
	{
		var prefix = "jController"; // Prefix that jController will use to create triggers

		return prefix;
	}

	$.jController.trigger = function(params) {

		// Default trigger params
		var defaults = {

			event:null, // The event that will be triggered
			plugin:null, // Which type of plugin will be triggered
			index:null, // Which index of plugin will be triggered
			data:["jController"] // Data to send, by default jController will be sent

		};

		// merge default & params
		var opt = $.extend({}, defaults, params);
		var eventName = (opt.event != null) ? "_"+opt.event : "";
		var pluginName = (opt.plugin != null) ? "_"+opt.plugin : "";
		var index = (opt.index != null) ? "_"+opt.index : "";

		// Sent a trigger using jQuery
		$(document).trigger($.jController.getTriggerPrefix()+eventName+pluginName+opt.data);

	}

	/* -- Listeners config -- */

	// Retrieve all listeners
	$.jController.getAllListeners = function() {

		return _listeners;
	}

	// Retrieve listener by name
	$.jController.getListener = function(name) {

		// return the listener if exists otherwise null
		return ($.jController.isListener(name)) ? _listeners[name] : null;
	}

	// Check wether a listener exists or nor
	$.jController.isListener = function(name) {

		return ($.isPlainObject(_listeners[name]));
	}


	// Register Listener
	$.jController.registerListener = function(listener) {
		
		// Check wether the name has been set
		if (listener.name) {

			// Create new object of listener
			_listeners[listener.name] = {

				fn 		 : listener.fn, 		// Register listener function
				response : null 				// init response to null
			}

		}

	}

	/* -- Events config -- */


	// Retrieve all events of PluginName
	$.jController.getAllEvents = function(pluginName) {

		return ($.jController.isPlugin(pluginName) && 
			$.isPlainObject($.jController.getPlugin(pluginName).events))
			? $.jController.getPlugin(pluginName).events
			: null;
	}

	// Retrieve a specific pluginName
	$.jController.getEvent = function(pluginName,eventName) {

		// return the event if exists otherwise null
		return ($.jController.isEvent(pluginName,eventName)) 
			? _plugins[pluginName].events[eventName] 
			: null;
	}

	// Check wether a pluginName Event exists or nor
	$.jController.isEvent = function(pluginName,eventName) {

		return ($.jController.isPlugin(pluginName) && 
			$.isPlainObject(_plugins[pluginName].events) &&
			$.isFunction(_plugins[pluginName].events[eventName])
			)
	}

	/* -- Plugins config  -- */

	// Retrieve all plugins
	$.jController.getAllPlugins = function() {

		return _plugins;
	}

	// Retrieve plugin by name
	$.jController.getPlugin = function(name) {

		// return the plugin if exists otherwise null
		return ($.jController.isPlugin(name)) ? _plugins[name] : null;
	}

	// Check wether a Plugin exists or nor
	$.jController.isPlugin = function(name) {

		return ($.isPlainObject(_plugins[name]));
	}

	// Register Plugin
	$.jController.registerPlugin = function(plugin) {
		
		// Check wether the name has been set
		if (plugin.name) {

			// Create new object of plugin
			_plugins[plugin.name] = {

				paramsList : [],				// With params (list)
				render 	   : plugin.render,		// Register plugin rendering function
				events 	   : plugin.events,		// Register plugin events
				isRender   : false,				// Plugin already rendered ?
			}

			// Add plugin function
			// Ex : $.jController.arc({[...]}) adds an arc into the controller
			$.jController[plugin.name] = function(params) {
				_plugins[plugin.name].paramsList.push (params)
			}
		}
		
	}
// end of closure
})(jQuery);

// End Of Kernel

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
	
	// Plugin Name
	name : "circle",

	// Render Plugin

	render : function(ctx, params) {
		$.jController.arc({
			x: params.x,
			y: params.y,
			r: params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI,
		})
	},

	// Plugin Events
	events : {

		click : function(params){
			var listener = $.jController.getListener("click").response;

			var x0 = params.x
			var y0 = params.y;
			var r  = params.r;

			var x1 = listener.clientX;
			var y1 = listener.clientY;
			
			return (Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r)
		},
		mouseover : function (e,params){
			$.jController.getListener("mouseover");
		}
	}
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
