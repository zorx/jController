// jController object
$.jController = new Object();

// jController plugins list (private) [@TODO]
$.jController._plugins = new Object();

// jQuery jController function definition
$.fn.jController = function (callback) {
 
	// Get canvas context
	var ctx = this[0].getContext("2d");
	
	// For each declared plugin
	$.each($.jController._plugins, function(name, p) {

		// Construct and render each one
		$.each(p.paramsList, function(i, params) {

			//@TODO : Put default params by using $.extend({},default,params) to skip errors when some params are absent

			// Render plugin
			p.render(ctx, params);
		})

	})

	return this;
}

// Add new plugin
$.jController.registerPlugin = function(plugin) {
	
	// Check wether the name has been set
	if (plugin.name) {
		// Create new object of plugin
		$.jController._plugins[plugin.name] = new Object();

		// With params (list)
		$.jController._plugins[plugin.name].paramsList = [];

		// Register plugin function into _plugins[name].render
		$.jController._plugins[plugin.name].render = plugin.render;
		
		// add plugin function
		// When we call a plugin Ex : $.jController.arc this one will insert all parameters into $.jController._plugins.arc.params
		$.jController[plugin.name] = function(params) {
			$.jController._plugins[plugin.name].paramsList.push (params)
		}
	}

}

/*
@TODO use the same method as registerPlugin to create addEvent (Ex : click,touch etc..) & AddProperty (Ex : draggable:true)
We can use .on & .trigger from jquery cf : http://api.jquery.com/trigger/
Each plugin can use either the default event or a specific one (so we have to edit registerPlugin)

Ex of event :
$.jController.addEvent({
	name:"click",
	render : function()
	{
		
	}

});

*/

// -------- PLUGINS ----------


// TODO : Add >> http://www.w3schools.com/tags/ref_canvas.asp

// Add arc plugin
$.jController.registerPlugin({

	name : "arc",
	render : function(ctx, params) {
		ctx.beginPath();
		ctx.arc(params.x,params.y,params.r,params.sAngle,params.eAngle);
		ctx.stroke();
	},

})

// Add rect plugin
$.jController.registerPlugin({

	name:"rect",
	render : function(ctx, params) {
		ctx.rect(params.x,params.y,params.width,params.height);
		ctx.stroke();
	},

})

//@TODO add svg plugin, transform an svg file to canvas code check http://www.professorcloud.com/svg-to-canvas/ [use Canvg library]