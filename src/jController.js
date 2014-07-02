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

	// Private Canvas jQuery object
	var _$canvas;

	// Private Canvas
	var _canvas;

	// Private Canvas context
	var _context;

	// Default value of clearing canvas 
	var _isClearCanvas = true;

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

	// list of events by plugin (for trigger)
	var _onEvent = {};

	// jController events
	var _kernelEvents = {};
	

	// jQuery jController function definition
	$.fn.jController = function (attr) {

		// Init jController canvas
		jController.init(this, attr);
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


	// Create state "object" for plugin
	var state = function(attr, pluginName,index) {

		this.id = index;
		this.attr = attr;
		this.isRender = false;
		// Set internal values
		this.setInternal = function(data) {
			
			var oldData = ($.isPlainObject(_internal[pluginName+index]))
				? _internal[pluginName+index]
				: {};

			_internal[pluginName+index] = $.extend(true,{}, oldData, data);
			

		}
		// Retrieve internal value
		this.getInternal = function(key) {
			var ret = ($.isPlainObject(_internal[pluginName+index])) ? _internal[pluginName+index][key] : undefined;
			return ret;
			
		}
		// Retrieve internal values (all)
		this.getInternals = function() {
			return _internal[pluginName+index];
		}

		/* Idea:
		// Retrieve object path (useful for events detection)
		getPath : function() {
			return self.path; // = function(params)
		}

		*/

		// render another plugin (plugin name, params)
		this.render = function(pluginName, attr) {
			if (! $.isPlainObject(_ephemeral[pluginName])) {
				_ephemeral[pluginName] = {
					instances : [],
				};
			}

			var index = _ephemeral[pluginName].instances.length;
			var _state = new state($.jController.getPlugin(pluginName).construct(attr),pluginName,index);
			_ephemeral[pluginName].instances.push (_state);

			return _state;
		}

		// Remove this instance
		this.remove = function () {

			
			_plugins[pluginName].instances[index] = undefined;
			

			if ($.isPlainObject(_onEvent[pluginName]))
			{
				// Remove all onEvent for this instance
				$.each(_onEvent[pluginName][index],function(listenerName, fn) {
					$.jController
						.getListener(listenerName)
						.off(_onEvent[pluginName][index][listenerName]);
				});

			}
				
		}

		// Trigger
		this.trigger = function (eventName,data) {

			var callback = state[eventName];

			if ($.jController.isEvent(pluginName, eventName) && $.isFunction(callback)) {

				// Callback for event
				var callbackEvent = $.jController
					.getPlugin(pluginName)
					.events[eventName].fn;

				callbackEvent(this,callback,data);
			}
		}

		// Get parent
		this.parent = function () {
			return _plugins[pluginName];
		}

	};

	// jController
	var jController = {
		// Creates canvas for jController
		init : function($obj, attr) {
			// Unique Canvas id
			var id = 'jController_' + $('canvas').length; 

			// Canvas jQuery object
			_$canvas = $('<canvas>')
				.attr(attr.attr)
				.attr({id: id})
				.appendTo($obj);

			// Canvas
			_canvas = _$canvas[0];

			// Context of canvas
			_context = _canvas.getContext("2d");

			// Save kernel events
			$.each(attr.events,function(eventName,callback) {
				_kernelEvents[eventName] = callback;
			})

		},

		// Retrieve All events from instances and listen
		listenEvents : function(state, pluginName) {

			$.each(state.attr, function(key, value) {
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

						if (!$.isPlainObject(_onEvent[pluginName][state.id])) {
							_onEvent[pluginName][state.id] = {};
						}

						// Don't change this, save the execute event function
						_onEvent[pluginName][state.id][listenerName] = function(e) {
							callbackEvent(state,evtCallback,e);
						};

						if ($.jController.isListener(listenerName)) {
							// Don't change this, start listening
							$.jController
								.getListener(listenerName)
								.on(_onEvent[pluginName][state.id][listenerName]);
						} else {
							throw "jController error: can't find <"+listenerName+"> listener";
						}

					}
				}
			});

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
				$.each(plugin.instances, function(index, state) {
					
					if (state != undefined)
					{
						if (! state.isRender)
						{
							// Retrieve all events
							jController.listenEvents(state, pluginName);
							state.isRender = true;
						}

						// Render plugin
						plugin.render(state);
					}

				})
			})

			jController.renderEphemeral();
		},

		// Render Ephemeral plugins
		renderEphemeral : function () {

			var _exit=false;
			// For each declared plugin
			$.each(_ephemeral, function(pluginName, plugin) {

				_exit = true;
				// Construct and render each one
				$.each(plugin.instances, function(index, state) {
					
					if (state != undefined)
					{
						if (! state.isRender)
						{
							_exit = false;
							// Retrieve all events
							jController.listenEvents(state, pluginName);
							state.isRender = true;
						}

						// Render plugin
						$.jController.getPlugin(pluginName).render(state);
					}

				})
			})

			if (!_exit) {
				// Recursive call (for intricate plugins)
				jController.renderEphemeral();
			}
				

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

	$.jController.trigger = function(eventName,data) {
		
		var callback = _kernelEvents[eventName];

		if ($.isFunction(callback)) {

			// execute Callback using data
			callback(data);
		}
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
		
		var pName=plugin.name;

		// Check wether the name has been set
		if (!pName) {throw "What's my name !"}

		var _config = {
			instances  : [],          			// With instances (list)
			getEvent : function(eventName){ 	// Get eventName

				return $.jController.getEvent(pName,eventName);
			},
			isEvent : function(eventName){ 	// Get eventName

				return $.jController.isEvent(pName,eventName);
			}

		}

		// Create new object of plugin
		_plugins[pName] = $.extend(true,{},_config,plugin);
		
		// Add plugin function
		// Ex : $.jController.arc({[...]}) adds an arc into the controller
		$.jController[pName] = function(attr) {

			var index = _plugins[pName].instances.length;
			var _state = new state(plugin.construct(attr),pName,index);
			_plugins[pName].instances.push (_state);

			return _state;
		}
		
	}

})(jQuery); // jController Kernel end
