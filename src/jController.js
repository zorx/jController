// Begin jController Kernel
// create closure
(function($) {

	// jController object
	$.jController = {};

	// jController plugins list (private)
	var _plugins = {};

	// jController helpers list (private)
	var _helpers = {};

	// jController Properties list (private)
	var _properties = {};

	// jQuery jController function definition
	$.fn.jController = function (callback) {
	 
		// Get canvas & context
	 	var $canvas = this;
		var context = $canvas[0].getContext("2d");

		// Retrieve All events from params and listen
		var listenEvents = function(params, index, plugin) {

			$.each(params, function(key, value) {

				// looking for events on params
				if ($.jController.isEvent(plugin, key) &&
					$.isFunction(value)) {

					// key in this case is an event
					var event = key;

					// value in this case is a callback
					var callback = value;

					$.jController
						.getPlugin(plugin)
						.events[event]($canvas, params, callback);
				}
				
			})
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
						listenEvents(params, index, pluginName);

						// Render plugin
						pluginObject.render(context, params);

					})

					// Object render
					_plugins[pluginName].isRender = true;
					
					// render All (allows us to call a plugin into another )
					renderAll();
				}

			})
		}

		// Recusively render everything
		renderAll();

		return this;
	}

	/* -- Trigger -- */

	$.jController.getTriggerPrefix = function() {
		// jController own triggers prefix
		return "jController";
	}

	$.jController.trigger = function(params) {
		// Default trigger params
		var defaults = {
			event:  null, // Triggered event
			plugin: null, // Triggered plugin type
			index:  null, // Triggered plugin index
			data:   []    // Sent data
		};

		// merge default & params
		var options    = $.extend({}, defaults, params);
		var eventName  = (options.event  != null) ? "_"+options.event  : "";
		var pluginName = (options.plugin != null) ? "_"+options.plugin : "";
		var index      = (options.index  != null) ? "_"+options.index  : "";

		// Sent a trigger using jQuery
		$(document).trigger($.jController.getTriggerPrefix()+eventName+pluginName+options.data);
	}

	/* -- Helpers config -- */

	// Retrieve all events
	$.jController.getAllHelpers = function() {
		return _helpers;
	}

	// Retrieve events by name
	$.jController.getHelper = function(name) {
		// return the helper if exists otherwise null
		return ($.jController.isHelper(name)) ? _helpers[name] : null;
	}

	// Check wether an Event exists or nor
	$.jController.isHelper = function(name) {
		return ($.isFunction(_helpers[name]));
	}

	// Register Event
	$.jController.registerHelper = function(helper) {
		// Check wether the name has been set
		if (helper.name) {
			// Register helper function
			_helpers[helper.name] = helper.fn;
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
			$.isFunction(_plugins[pluginName].events[eventName]))
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

// End jController Kernel

// -------- Create Helpers ----------

// inCircle helper, whether we are in a circle or not

$.jController.registerHelper({
	name : "inCircle",
	fn : function(params) {
		var p = params;

		var r  = p.radius;
		var dx = p.px - p.x;
		var dy = p.py - p.y;
		
		return (Math.pow(dx,2)+Math.pow(dy,2) < Math.pow(r,2))
	},
})

// -------- Create Plugins ----------

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
			angleEnd: 2 * Math.PI
		})
	},

	// Plugin Events
	events : {
		click : function(canvas,params,callback){
			canvas.on("click",{params:params,callback:callback},function(e){
				var inCircle = $.jController.getHelper("inCircle")
				({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					x : e.data.params.x,
					y : e.data.params.y,
					radius : e.data.params.r
				});

				if (inCircle)
				{
					e.data.callback();
				}
			});
		},

		mouseover : function (canvas,params,callback){
			
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
	}
})

// @TODO : SVG plugin, Image plugin, etc.
