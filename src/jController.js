
// Defining request/cancel animation frame
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Begin jController Kernel
// create closure
(function($) {

	'use strict';

	// jController object
	$.jController = {};

	// Index of objets
	$.jController.internal = {};

	// Private jController plugins list
	var _plugins = {};

	// Private jController helpers list
	var _helpers = {};
	
	// Private Canvas jQuery object
	var _$canvas;

	// Private Canvas
	var _canvas;

	// Private Canvas context
	var _context;

	// Default value of clearing canvas 
	var _isClearCanvas = true;

	// Frame per second
	var fps = 1;

	// jQuery jController function definition
	$.fn.jController = function (params) {

		// Init jController canvas
		jController.init(this, params);
		
		function animate() {

			setTimeout(function() {
				if (_isClearCanvas)	{

					jController.clearCanvas();
				}

			    // Recusively render everything
			    jController.renderAll();
			    jController.cleanAll();
			    window.requestAnimationFrame(animate);

			}, 1000 / fps);

		}

		animate();

		return this;
	}

	// jController
	var jController = 
	{
		// Creates canvas for jController
		init : function($obj, params)
		{
			// Unique Canvas id
			var id = 'jController_' + $('canvas').length; 

			// Canvas jQuery object
			_$canvas = $('<canvas>').attr(params.attr).attr({id: id}).appendTo($obj);

			// Canvas
			_canvas = _$canvas[0];

			// Context of canvas
			_context = _canvas.getContext("2d");

		},

		// Retrieve All events from paramsList and listen
		listenEvents : function(paramsList, pluginName, self) {

			$.each(paramsList, function(evt, callback) {
				// looking for events on paramsList
				if ($.jController.isEvent(pluginName, evt) &&
					$.isFunction(callback)) {
					// Execute the event					
					$.jController
						.getPlugin(pluginName)
						.events[evt](self, callback);
				}
			});

		},

		// Create self "object" for plugin
		self : function(state, pluginName, index) {

			return {
				id : index,
				plugin : pluginName,
				params : state,
				// Set internal values
				setInternal : function(data) {
					var oldData = ($.isPlainObject($.jController.internal[pluginName][index]))
						? $.jController.internal[pluginName][index]
						: {};
					$.jController.internal[pluginName][index] = $.extend(true,{}, oldData, data);
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

		},

		// Create internal values placeholder for plugin
		initInternal : function(pluginName, index) {

			if (!$.isPlainObject ($.jController.internal[pluginName])) {
				$.jController.internal[pluginName] = {};
			}

			$.jController.internal[pluginName][index] = {};

		},

		// Set every plugins as to be rendered on next frame
		cleanAll : function() {

			// For each declared plugin
			$.each(_plugins, function(pluginName, pluginObject) {
				_plugins[pluginName].isRender = false;

			});
		},

		// Clear canvas
		clearCanvas : function() {

			var ctx = $.jController.getContext();
			ctx.clearRect(0, 0, $.jController.getCanvas().width, $.jController.getCanvas().height);
		},

		// Render all plugins
		renderAll : function() {

			// For each declared plugin
			$.each(_plugins, function(pluginName, pluginObject) {

				// Not render yet
				if (!pluginObject.isRender && pluginObject.paramsList.length != 0) {

					// Construct and render each one
					$.each(pluginObject.paramsList, function(index, state) {
						
						// Create internal values object
						jController.initInternal(pluginName, index);

						// Create "self" (related to the instance) 
						var _self = jController.self(state, pluginName, index);

						// Retrieve all events
						jController.listenEvents(state, pluginName, _self);

						console.log(state);
						// Render plugin
						pluginObject.render(_self);

					})

					// Object render
					_plugins[pluginName].isRender = true;
					
					// render All (allows us to call a plugin into another )
					jController.renderAll();
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
	 				console.log(exception)
	 			})
 			}
 		}($.makeArray(links), callback))
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

	$.jController.clearCanvas = function(status) {
		_isClearCanvas = status;
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
		var options    = $.extend(true,{}, defaults, params);
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
				paramsList  : [],          // With paramsList (list)
				render 	 : plugin.render,  // Register plugin rendering function
				events 	 : plugin.events,  // Register plugin events
				isRender : false,          // Plugin already rendered ?
			}

			// Add plugin function
			// Ex : $.jController.arc({[...]}) adds an arc into the controller
			$.jController[plugin.name] = function(state) {
				_plugins[plugin.name].paramsList.push (plugin.construct(state))
			}
		}
	}

})(jQuery); // jController Kernel end
