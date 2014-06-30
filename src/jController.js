//http://www.rgraph.net/blog/2013/february/an-example-of-the-html5-canvas-ispointinpath-function.html
// Begin jController Kernel
// create closure
(function($) {

	'use strict';

	// Defining request/cancel animation frame
	// shim layer with setTimeout fallback 
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame     ||
		window.oRequestAnimationFrame       ||
		window.msRequestAnimationFrame      ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	// jController object
	$.jController = {};

	// Index of objets
	var _internal = {};

	// Private jController plugins list
	var _plugins = {};

	// Ephemeral plugins (when we call a plugin from another)
	var _ephemeral = {};

	// Private jController helpers list
	var _helpers = {};

	// Private jController listeners list
	var _listeners = {};

	// Private jController instances list
	var _instances = {};

	// Private jController instances list
	var _ephemeralInstances = {};
	

	// list of events by plugin (for trigger)
	var _onEvent = {};
	
	// Private Canvas jQuery object
	var _$canvas;

	// Private Canvas
	var _canvas;

	// Private Canvas context
	var _context;

	// Default value of clearing canvas 
	var _isClearCanvas = true;

	// jQuery jController function definition
	$.fn.jController = function (params) {

		// Init jController canvas
		jController.init(this, params);

		requestAnimFrame(animate);
		
		return this;
	}

	function animate() {
		if (_isClearCanvas)	{
			jController.clearCanvas();
		}		
		
	    // Recusively render everything
	    jController.renderAll();
	    jController.cleanAll();

	    requestAnimFrame(animate);
	}

	// jController
	var jController = {
		// Creates canvas for jController
		init : function($obj, params)
		{
			// Unique Canvas id
			var id = 'jController_' + $('canvas').length; 

			// Canvas jQuery object
			_$canvas = $('<canvas>')
				.attr(params.attr)
				.attr({id: id})
				.appendTo($obj);

			// Canvas
			_canvas = _$canvas[0];

			// Context of canvas
			_context = _canvas.getContext("2d");

		},

		// Retrieve All events from configInstances and listen
		listenEvents : function(state, pluginName, self) {

			$.each(state, function(key, value) {
				// Looking for events on state
				if ($.jController.isEvent(pluginName, key) &&
					$.isFunction(value)) {

					// Key is an EventName
					var eventName = key;
					// Value is a callback
					var evtCallback = value;
					
					// Listener Name					
					var listenerName = $.jController
						.getPlugin(pluginName)
						.events[eventName].listener;
					
					// Callback for event
					var callbackEvent = $.jController
						.getPlugin(pluginName)
						.events[eventName].fn;

					if (listenerName != undefined) {
						
						if (!$.isPlainObject(_onEvent[pluginName])) {
							_onEvent[pluginName] = {};
						}

						if (!$.isPlainObject(_onEvent[pluginName][self.id])) {
							_onEvent[pluginName][self.id] = {};
						}

						// Don't change this, save the execute event function
						_onEvent[pluginName][self.id][listenerName] = function(e) {
							callbackEvent(self,evtCallback,e);
						};

						if ($.jController.isListener(listenerName)) {
							// Don't change this, start listening
							$.jController
								.getListener(listenerName)
								.on(_onEvent[pluginName][self.id][listenerName]);
						} else {
							throw "jController error: can't find <"+listenerName+"> listener";
						}

					} else {
						// Execute the event (Maybe not ! @TODO)
						//callbackEvent(self,evtCallback);
					}
					
				}
			});

		},

		// Create self "object" for plugin
		self : function(state, pluginName, index) {

			return {
				id : index,
				params : state,
				// Set internal values
				setInternal : function(data) {
					
					var oldData = ($.isPlainObject(_internal[pluginName+index]))
						? _internal[pluginName+index]
						: {};

					_internal[pluginName+index] = $.extend(true,{}, oldData, data);
					

				},
				// Retrieve internal value
				getInternal : function(key) {
					var ret = ($.isPlainObject(_internal[pluginName+index])) ? _internal[pluginName+index][key] : undefined;
					return ret;
					
				},
				// Retrieve internal values (all)
				getInternals : function() {
					return _internal[pluginName+index];
				},

				// render another plugin (plugin name, params)
				render : function(pluginName, params) {
					if (! $.isPlainObject(_ephemeral[pluginName ])) {
						_ephemeral[pluginName] = {
							configInstances : [],
							isRender : false, // Plugin already rendered ?
						};
					}

					var i = _ephemeral[pluginName].configInstances.length;

					_ephemeral[pluginName].configInstances
						.push (_plugins[pluginName].construct(params));


					if (!$.isPlainObject(_ephemeralInstances[pluginName])) {					
						_ephemeralInstances[pluginName] = {};
					}
					_ephemeralInstances[pluginName][i] = jController.self(params, pluginName, i);

					return _ephemeralInstances[pluginName][i];
				},

				// Remove this instance
				remove : function () {

					
					_plugins[pluginName].configInstances[index] = undefined;
					

					if ($.isPlainObject(_onEvent[pluginName]))
					{
						// Remove all onEvent for this instance
						$.each(_onEvent[pluginName][index],function(listenerName, fn) {
							$.jController
								.getListener(listenerName)
								.off(_onEvent[pluginName][index][listenerName]);
						});
					}

					_instances[pluginName][index]=undefined;
						
				},

				// Trigger
				trigger : function (eventName,data) {

					$.jController.trigger({
						event:  eventName, 			// Triggered event
						plugin: pluginName, 		// Triggered plugin type
						index:  index, 				// Triggered plugin index
						data:   data,   			// Sent data
					});
				},

				// Get parent
				parent : function () {
					return _plugins[pluginName];
				}

			}

		},

		// Set every plugins as to be rendered on next frame
		cleanAll : function() {

			// For each declared plugin
			_ephemeral = {};
		},

		// Clear canvas
		clearCanvas : function() {
			$.jController
				.getContext()
				.clearRect(0, 0,
					$.jController.getCanvas().width,
					$.jController.getCanvas().height);
		},

		// Render all plugins
		renderAll : function() {

			// For each declared plugin
			$.each(_plugins, function(pluginName, plugin) {
				
				// Construct and render each one
				$.each(plugin.configInstances, function(index, state) {
					
					if (state != undefined)
					{
						// Create "self" (related to the instance) 
						var _self = _instances[pluginName][index];

						if (! state.__isRender)
						{
							// Retrieve all events
							jController.listenEvents(state, pluginName, _self);
							state.__isRender = true;
						}

						// Render plugin
						plugin.render(_self);
					}

				})
			})

			jController.renderEphemeral();
		},

		// Render Ephemeral plugins
		renderEphemeral : function () {

			// For each declared plugin
			$.each(_ephemeral, function(pluginName, plugin) {
				// Not render yet
				if (! plugin.isRender && plugin.configInstances.length != 0) {

					// Construct and render each one
					$.each(plugin.configInstances, function(index, state) {
						
						if (state != undefined)
						{
							// Create "self" (related to the instance) 
							var _self = _ephemeralInstances[pluginName][index];

							if (! state.__isRender)
							{
								// Retrieve all events
								jController.listenEvents(state, pluginName, _self);
								state.__isRender = true;
							}

							// Render plugin
							$.jController.getPlugin(pluginName).render(_self);
						}

					})

					// Object render
					_ephemeral[pluginName].isRender = true;
					
					// Recursive call (for intricate plugins)
					jController.renderEphemeral();
				}
			})

		}
	}

	// Import Js files
	$.jController.import =  function(links, callback) {
 		// Recursively import files and callback()
 		(function importRecursive(list, callback){
 			if (list.length == 0) {
 				callback();
 			} else {
	 			$.getScript(list[0], function() {
	 				importRecursive(list.slice(1), callback);
	 			}).fail(function(jqxhr, settings, exception){
	 				throw "jController error: on import, " + exception;
	 			})
 			}
 		}($.makeArray(links), callback));
	}

	$.jController.getCanvasObject = function() {
		return _$canvas;
	}

	$.jController.getCanvas = function() {
		return _canvas;
	}

	$.jController.getContext = function() {
		return _context;
	}

	$.jController.clearCanvas = function(flag) {
		_isClearCanvas = flag;
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
			data:   [],   // Sent data
		};

		// merge default & params
		var options    = $.extend(true,{}, defaults, params);
		var eventName  = (options.event  != null) ? "_" + options.event  : "";
		var pluginName = (options.plugin != null) ? "_" + options.plugin : "";
		var index      = (options.index  != null) ? "_" + options.index  : "";
		var trigger    = $.jController.getTriggerPrefix() + eventName + pluginName + index;

		console.log(trigger, options.data);
		// Sent a trigger using jQuery
		$(document).trigger(trigger, options.data);
	}

	/* -- Listeners config -- */

	// Retrieve all listeners
	$.jController.getListeners = function() {
		return _listeners;
	}

	// Retrieve listener by name
	$.jController.getListener = function(name) {
		// return the listener if exists otherwise undefined
		return _listeners[name];
	}

	// Check wether a listener exists or nor
	$.jController.isListener = function(name) {
		return ($.isPlainObject(_listeners[name]) &&
				$.isFunction(_listeners[name].on) &&
				$.isFunction(_listeners[name].off));
	}

	// Register a listener
	$.jController.registerListener = function(listener) {
		// Check wether the name has been set
		if (listener.name) {
			// Register listener functions
			_listeners[listener.name] = {
				on  : listener.on,
				off : listener.off,
			}
		}
	}

	/* -- Helpers config -- */

	// Retrieve all helpers
	$.jController.getHelpers = function() {
		return _helpers;
	}

	// Retrieve helper by name
	$.jController.getHelper = function(name) {
		// return existing helper (undefined otherwise)
		return _helpers[name];
	}

	// Check wether a helper exists or nor
	$.jController.isHelper = function(name) {
		return ($.isFunction(_helpers[name]));
	}

	// Register a helper
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

	// Retrieve a specific pluginName event
	$.jController.getEvent = function(pluginName, eventName) {
		// return existing event (null otherwise)
		return ($.jController.isEvent(pluginName, eventName)) 
			? _plugins[pluginName].events[eventName] 
			: null;
	}

	// Check pluginName event existence
	$.jController.isEvent = function(pluginName, eventName) {
		return ($.jController.isPlugin(pluginName) &&
			$.isPlainObject(_plugins[pluginName].events) &&
			$.isPlainObject(_plugins[pluginName].events[eventName]) &&
			$.isFunction(_plugins[pluginName].events[eventName].fn))
	}

	/* -- Plugins config  -- */

	// Retrieve all plugins
	$.jController.getPlugins = function() {
		return _plugins;
	}

	// Retrieve plugin by name
	$.jController.getPlugin = function(name) {
		// return the plugin if exists otherwise undefined
		return _plugins[name];
	}

	// Check wether a Plugin exists or nor
	$.jController.isPlugin = function(name) {
		return ($.isPlainObject(_plugins[name]));
	}

	// Register Plugin
	$.jController.registerPlugin = function(plugin) {
		// Check wether the name has been set
		if (plugin.name) {

			var _config = {
				configInstances  : [],          			// With configInstances (list)
				isRender : false,          			// Plugin already rendered ?
				getEvent : function(eventName){ 	// Get eventName

					return $.jController.getEvent(plugin.name,eventName);
				},
				isEvent : function(eventName){ 	// Get eventName

					return $.jController.isEvent(plugin.name,eventName);
				}

			}

			// Create new object of plugin
			_plugins[plugin.name] = $.extend(true,{},_config,plugin);
			
			// Add plugin function
			// Ex : $.jController.arc({[...]}) adds an arc into the controller
			$.jController[plugin.name] = function(state) {
				
				// Instance already rendered ?
				state.__isRender = false;

				var pluginName = plugin.name;
				var index = _plugins[pluginName].configInstances.length;

				_plugins[pluginName].configInstances.push (plugin.construct(state));

				if (!$.isArray(_instances[pluginName])) {					
					_instances[pluginName] = [];
				}
				_instances[pluginName][index] = jController.self(state, pluginName, index);

				return _instances[pluginName][index];
			}
		}
	}

})(jQuery); // jController Kernel end
