
// Begin jController Kernel
// create closure
(function($) {

	// jController object
	$.jController = {};

	// Index of objets
	$.jController.internal = {};

	// jController plugins list (private)
	var _plugins = {};

	// jController helpers list (private)
	var _helpers = {};

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
						.events[event]($canvas, params, callback,index);

				}
				
			})
		}

		var renderAll = function () {

			// For each declared plugin
			$.each(_plugins, function(pluginName, pluginObject) {

				// Not render yet
				if (!pluginObject.isRender && pluginObject.params.length != 0) {

					// Construct and render each one
					$.each(pluginObject.params, function(index, params) {
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

	$.jController.import =  function( links, callback ) {
 		// Recursively import files and callback()
 		(function import_recursive(list, callback){
 			if (list.length == 0) {
 				callback();
 			} else {
	 			$.getScript(list[0], function() {
	 				import_recursive(list.slice(1), callback);
	 			}).fail(function(e,b,x){console.log(x)})
 			}
 		}($.makeArray(links), callback))
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
		var eventName  = (options.event  != null) ? "_" + options.event  : "";
		var pluginName = (options.plugin != null) ? "_" + options.plugin : "";
		var index      = (options.index  != null) ? "_" + options.index  : "";
		var trigger    = $.jController.getTriggerPrefix() + eventName + pluginName;

		// Sent a trigger using jQuery
		$(document).trigger(trigger, options.data);
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

				params : [],					// With params (list)
				render 	   : plugin.render,		// Register plugin rendering function
				events 	   : plugin.events,		// Register plugin events
				isRender   : false,				// Plugin already rendered ?

			}

			// Add plugin function
			// Ex : $.jController.arc({[...]}) adds an arc into the controller
			$.jController[plugin.name] = function(state) {
				//_plugins[plugin.name].params.push (plugin.properties(state))
				_plugins[plugin.name].params.push (state)
			}
		}
	}

})(jQuery);
// end of closure
// End jController Kernel
