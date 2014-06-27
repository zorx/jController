
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

		// Retrieve All events from paramsList and listen
		var listenEvents = function(paramsList, pluginName, self) {

			$.each(paramsList, function(evt, callback) {
				// looking for events on paramsList
				if ($.jController.isEvent(pluginName, evt) &&
					$.isFunction(callback)) {
					// Execute the event					
					$.jController
						.getPlugin(pluginName)
						.events[evt]($canvas, self, callback);
				}
			});

		}

		// Create self "object" for plugin
		var self = function(state, pluginName, index) {

			return {
				id : index,
				plugin : pluginName,
				params : state,
				// Set internal values
				setInternal : function(data) {
					var oldData = ($.isPlainObject($.jController.internal[pluginName][index]))
						? $.jController.internal[pluginName][index]
						: {};
					$.jController.internal[pluginName][index] = $.extend({}, oldData, data);
				},
				// Retrieve internal value
				getInternal : function(key) {
					return $.jController.internal[pluginName][index][key]; 
				},
				// Retrieve internal values (all)
				getInternals : function() {
					return $.jController.internal[pluginName][index];
				},
			}

		}

		// Create internal values placeholder for plugin
		var initInternal = function(pluginName, index) {

			if (!$.isPlainObject ($.jController.internal[pluginName])) {
				$.jController.internal[pluginName] = {};
			}

			$.jController.internal[pluginName][index] = {};

		}

		var renderAll = function() {

			// For each declared plugin
			$.each(_plugins, function(pluginName, pluginObject) {

				// Not render yet
				if (!pluginObject.shown && pluginObject.paramsList.length != 0) {

					// Construct and render each one
					$.each(pluginObject.paramsList, function(index, state) {
						
						// Create internal values object
						initInternal(pluginName, index);

						// Create "self" (related to the instance) and retrieve all events
						listenEvents(state, pluginName, new self(state, pluginName, index));

						// Render plugin
						pluginObject.render(context, state);

					})

					// Object render
					_plugins[pluginName].shown = true;
					
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
	 			}).fail(function(jqxhr, settings, exception){
	 				console.log(exception)
	 			})
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
	$.jController.getHelpers = function() {
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
	$.jController.getEvents = function(pluginName) {
		return ($.jController.isPlugin(pluginName) && 
			$.isPlainObject($.jController.getPlugin(pluginName).events))
			? $.jController.getPlugin(pluginName).events
			: null;
	}

	// Retrieve a specific pluginName
	$.jController.getEvent = function(pluginName, eventName) {
		// return the event if exists otherwise null
		return ($.jController.isEvent(pluginName, eventName)) 
			? _plugins[pluginName].events[eventName] 
			: null;
	}

	// Check wether a pluginName Event exists or nor
	$.jController.isEvent = function(pluginName, eventName) {
		return ($.jController.isPlugin(pluginName) &&
			$.isPlainObject(_plugins[pluginName].events) &&
			$.isFunction(_plugins[pluginName].events[eventName]))
	}

	/* -- Plugins config  -- */

	// Retrieve all plugins
	$.jController.getPlugins = function() {
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
				paramsList  : [],         // With paramsList (list)
				render 	: plugin.render,  // Register plugin rendering function
				events 	: plugin.events,  // Register plugin events
				shown   : false,          // Plugin already rendered ?
			}

			// Add plugin function
			// Ex : $.jController.arc({[...]}) adds an arc into the controller
			$.jController[plugin.name] = function(state) {
				_plugins[plugin.name].paramsList.push (plugin.construct(state))
			}
		}
	}

})(jQuery);
// end of closure
// End jController Kernel
