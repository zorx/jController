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

	var retrieveEvents = function(params,i,p,name) {

		$.each(params,function(pName,pValue){

			// looking for events on params

			if(typeof $.jController._events[pName] === "object") {

				console.log(pValue,i,p,name);
			}
			
		});
	}

	var renderAll = function () {

		// For each declared plugin
		$.each($.jController._plugins, function(name, p) {

			// Not render yet
			if (!p._render && p.paramsList.length != 0) {

				// Construct and render each one
				$.each(p.paramsList, function(i, params) {
					// @TODO : handle default params by using
					// $.extend({}, default, params) for missing params

					// Retrieve All events from params
					retrieveEvents(params,i,p,name);

					// Render plugin
					p.render(context, params);

				})

				$.jController._plugins[name]._render = true;
				
				renderAll();
			}

		})
	}

	// Recusively render everything
	renderAll();

	return this;
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
		$.jController._plugins[plugin.name]._render = false;
		
		// Add plugin function
		// Ex : $.jController.arc({[...]}) adds an arc into the controller
		$.jController[plugin.name] = function(params) {
			$.jController._plugins[plugin.name].paramsList.push (params)
		}
	}
	
}

// -------- Listeners ----------

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

// -------- Events ----------

// "click" event
$.jController.registerEvent({
	name : "click",
	listener : "click",
	fn : function(ctx, params, listener) {
		var x0 = params.x
		var y0 = params.y;
		var r  = params.r;

		var x1 = listener.clientX;
		var y1 = listener.clientY;
		
		return (Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r);
	}
});

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
