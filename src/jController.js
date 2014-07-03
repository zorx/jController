
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

	// Ephemeral plugins (nested plugin calls)
	var _ephemeral = {};

	// Private jController helpers list
	var _helpers = {};

	// Plugins events list (triggerable)
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
	var state = function(attr, pluginName, index) {

		this.id = index;
		this.attr = attr;
		this.isRender = false;

		// Set internal values
		this.setInternal = function(data) {
			
			var _data = ($.isPlainObject(_internal[pluginName+index]))
				? _internal[pluginName+index]
				: {};

			_internal[pluginName+index] = $.extend(true, {}, _data, data);
		}

		// Retrieve internal value
		this.getInternal = function(key) {
			return ($.isPlainObject(_internal[pluginName+index]))
				? _internal[pluginName+index][key]
				: undefined;
		}

		// Retrieve internal values (all)
		this.getInternals = function() {
			return _internal[pluginName+index];
		}

		// @TODO
		this.getPath = function() {
			var path = _plugins[pluginName].path
			var self = this;
			return ($.isFunction(path))
				? function() { path(self) }
				: function() {}
		}

		this.inPath = function(x, y) {
			var self = this;
			var ctx = $.jController.getContext();

			// Save
			ctx.save();
			ctx.beginPath();

			// Draw path
			(self.getPath())();

			// Check in
			var result = ctx.isPointInPath(x, y);

			// Restore
			ctx.closePath();
			ctx.restore();

			return result;
		}

		// Render another plugin (plugin name, params)
		this.render = function(pluginName, attr) {
			if (! $.isPlainObject(_ephemeral[pluginName])) {
				_ephemeral[pluginName] = {
					instances : [],
				};
			}

			var index  = _ephemeral[pluginName].instances.length;
			var _state = new state(
				$.jController.getPlugin(pluginName).construct(attr),
				pluginName,
				index
			);

			_ephemeral[pluginName].instances.push(_state);

			return _state;
		}

		// Remove this instance
		this.remove = function () {

			_plugins[pluginName].instances[index] = undefined;

			if ($.isPlainObject(_onEvent[pluginName]))
			{
				// Remove all onEvent for this instance
				$.each(_onEvent[pluginName][index],function(listenerName, fn) {
					$.jController.getCanvas().removeEventListener(listenerName, _onEvent[pluginName][index][listenerName], false);
				});

			}
				
		}

		// Trigger
		this.trigger = function (eventName, data) {

			var callback = state[eventName];

			if ($.jController.isEvent(pluginName, eventName) &&
				$.isFunction(callback)) {

				// Callback for event
				var callbackEvent = $.jController
					.getPlugin(pluginName)
					.events[eventName].fn;

				callbackEvent(this, callback, data);
			}
		}

		// Get parent (plugin "class")
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
			$.each(attr.events, function(eventName, callback) {
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
							callbackEvent(state, evtCallback, e);
						};

						$.jController.getCanvas().addEventListener(listenerName, _onEvent[pluginName][state.id][listenerName], false);
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

			var _exit = false;
			// For each declared plugin
			$.each(_ephemeral, function(pluginName, plugin) {

				_exit = true;
				// Construct and render each one
				$.each(plugin.instances, function(index, state) {
					
					if (state != undefined && ! state.isRender) {
						
						_exit = false;
						// Retrieve all events
						jController.listenEvents(state, pluginName);
						state.isRender = true;
					
						// Render plugin
						$.jController.getPlugin(pluginName).render(state);
					}

				})
			})

			if (! _exit) {
				// Recursive call (for intricate plugins)
				jController.renderEphemeral();
			}
		}
	}

	/* enhance $.getSctipt to handle mutiple scripts */
	$.jController.import = function( resources, callback ) {
	 
	    var scripts = [];
	 	
	 	$.each(resources,function (i,src)
	 	{
	 		$.each(src.files,function (j,file)
		 	{
		 		scripts.push($.getScript( src.dir+file));
		 	})
	 	})

	    $.when.apply( null, scripts ).then(function() {
	        $(document).ready(callback);
	    });
	};


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

	$.jController.trigger = function(eventName, data) {
		
		var callback = _kernelEvents[eventName];

		if ($.isFunction(callback)) {
			// Execute callback using data
			callback(data);
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
		
		var pName = plugin.name;

		// Check wether the name has been set
		if (! pName) {
			throw "jController error: can't register plugin without name !";
		}

		var defaults = {
			// With instances (list)
			instances  : [],
			getEvent : function(eventName) {
				// Get eventName
				return $.jController.getEvent(pName, eventName);
			},
			isEvent : function(eventName) {
				// Get eventName
				return $.jController.isEvent(pName, eventName);
			},
		}

		// Create new object of plugin
		_plugins[pName] = $.extend(true, {}, defaults, plugin);

		// Add plugin function
		// Ex : $.jController.arc({[...]}) adds an arc into the controller
		$.jController[pName] = function(attr) {

			var index = _plugins[pName].instances.length;
			var _state = new state(plugin.construct(attr), pName, index);
			_plugins[pName].instances.push (_state);

			return _state;
		}
		
	}

})(jQuery); // jController Kernel end
