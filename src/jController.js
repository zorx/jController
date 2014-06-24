// Create jController object
$.jController = new Object();

// @private : _plugins object contains the function & parameters that will be used in this function
$.jController._plugins = new Object();

// JQuery Plugin definition.
$.fn.jController = function( callback ) {
 
 	// Get context of canvas
 	var _ctx = this[0].getContext("2d");
	
	// get all plugins previously used
 	$.each($.jController._plugins,function(PluginName,p){
 		
 		// smaller is better isn't ?
 		var n = PluginName;

 		// Get all params
 		$.each(p.paramsList,function(i,params){

 			//@TODO : Put default params by using $.extend({},default,params) to skip errors when some params are absent
 			// call the plugin function with params
 			p.fn(_ctx,params);	
 		})
 		

 	});

 	return this;
};

// Add new plugin
$.jController.addPlugin = function(plugin) 
{
	// check wether the name has been set
    if (plugin.name)
    {
    	// Create new object of plugin
    	$.jController._plugins[plugin.name] = new Object();

    	//Create paramsList[] this will contain all params of PluginName
    	$.jController._plugins[plugin.name].paramsList = []

        // Register plugin function into _plugins[name].fn
        $.jController._plugins[plugin.name].fn = plugin.fn;
        
        // add plugin function
        // When we call a plugin Ex : $.jController.arc this one will insert all parameters into $.jController._plugins.arc.params
        $.jController[plugin.name] = function(params)
        {
           $.jController._plugins[plugin.name].paramsList.push (params);
        }

        //console.log($.jController);
    }
}

//@TODO use the same method as addPlugin to create addEvent (Ex : click,touch etc..) & AddProperty (Ex : draggable:true)

// -------- PLUGINS ----------


// TODO : Add >> http://www.w3schools.com/tags/ref_canvas.asp

// Add arc plugin
$.jController.addPlugin({
	name:"arc",
	fn : function(ctx,params)
	{
		// Data processing

		// smaller is better isn't ?
		var p = params;

		// canvas api
		ctx.beginPath();
		ctx.arc(p.x,p.y,p.r,p.sAngle,p.eAngle);
		ctx.stroke();
	}

});

// Add rect plugin
$.jController.addPlugin({
	name:"rect",
	fn : function(ctx,params)
	{
		// smaller is better isn't ?
		var p = params;
		
		// canvas api
		ctx.rect(p.x,p.y,p.width,p.height);
		ctx.stroke();
	}

});

//@TODO add svg plugin, transform an svg file to canvas code check http://www.professorcloud.com/svg-to-canvas/ [use Canvg library]