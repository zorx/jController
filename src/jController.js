// jController object
$.jController = new Object();

// jController plugins list (private) [@TODO]
$.jController._plugins = new Object();

// jController Listener list (private) [@TODO]
$.jController._listeners = new Object();

// jController Events list (private) [@TODO]
$.jController._Events = new Object();

// jController Properties list (private) [@TODO]
$.jController._Properties = new Object();



// jQuery jController function definition
$.fn.jController = function (callback) {
 
 	var _canvas = this;
	// Get canvas context
	var ctx = _canvas[0].getContext("2d");
	
	// For each declared listener
	$.each($.jController._listeners, function(name, listener) {

		// start listener and save the response at $.jController._listeners[name].response
		listener.fn(_canvas,function(e){$.jController._listeners[name].response=e;});

	})


	// For each declared plugin
	var each = function () {

			$.each($.jController._plugins, function(name, p) {

			if (!p._render && p.paramsList.length != 0)
			{
				// Construct and render each one
				$.each(p.paramsList, function(i, params) {

					//@TODO : Put default params by using $.extend({},default,params) to skip errors when some params are absent

					// Render plugin
					p.render(ctx, params);

				})
				$.jController._plugins[name]._render = true;
				each();
			}

		})
	}

	each();

	return this;
}



// Register Listener
$.jController.registerListener = function(listener) {
	
	// Check wether the name has been set
	if (listener.name) {

		// Create new object of listener
		$.jController._listeners[listener.name] = new Object();
		
		// Register listener function into _listeners[name].render
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
		$.jController._Events[event.name] = new Object();
		
		// Register event function into _Events[name].render
		$.jController._Events[event.name].fn = event.fn;

		// init response to null
		$.jController._Events[event.name].response = null;

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

		// Register plugin function into _plugins[name].render
		$.jController._plugins[plugin.name].render = plugin.render;

		// whether render is called or not in this plugin
		$.jController._plugins[plugin.name]._render = false;
		
		// add plugin function
		// When we call a plugin Ex : $.jController.arc this one will insert all parameters into $.jController._plugins.arc.params
		$.jController[plugin.name] = function(params) {
			$.jController._plugins[plugin.name].paramsList.push (params)
		}
	}
}




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

// "click" event
$.jController.registerEvent({
	name:"click",
	listener : "click",
	fn : function(ctx,params,listener)
	{
		var x0 = params.x
		var y0 = params.y;
		var r  = params.r;

		var x1 = listener.clientX;
		var y1 = listener.clientY;
		
		return (Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r);
	}
});

// -------- PLUGINS ----------


// TODO : Add >> http://www.w3schools.com/tags/ref_canvas.asp

// Add arc plugin
$.jController.registerPlugin({
	name : "arc",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.arc(params.x, params.y, params.r, params.sAngle, params.eAngle);
		ctx.stroke();
	},
})

// Add circle plugin
$.jController.registerPlugin({
	name : "circle",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.arc(params.x, params.y, params.r, 0, 2 * Math.PI);
		ctx.stroke();
	},
})

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

//@TODO add svg plugin, transform an svg file to canvas code check http://www.professorcloud.com/svg-to-canvas/ [use Canvg library]