
// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	// Plugin Name
	name : "circle",
	properties : function(params)
	{
		var defaults= {
			x:0,
			y:0,
			r:0

		}
		return $.extend({},defaults,params);

	},
	// Render Plugin
	render : function(ctx, params) {
		$.jController.arc({
			x: params.x,
			y: params.y,
			r: params.r,
			angleStart: 0,
			angleEnd: 2 * Math.PI
		})
	},

	// Plugin Events
	events : {
		click : function($canvas, params, callback,index) {
			$canvas.on("click", {params: params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				})) {
					callback(e);
				}
			});
		},

		mousemove : function ($canvas, params, callback,index) {
			$canvas.on("mousemove", {params: params, callback: callback}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				})) {
					callback(e);
				}
			});
		},

		mousein : function ($canvas, params, callback,index) {
			$.jController.internal[index] = {_in:false}
			//[@TODO] Add getter/setter internal
			// params => self {id:index,params:params,plugin:pluginName}


			$canvas.on("mousemove", {params: params, callback: callback,index:index}, function(e) {
				if ($.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				}) && !$.jController.internal[e.data.index]._in) {
					
					$.jController.internal[e.data.index]._in=true;
						callback(e);
					
				}
			});
		},

		mouseout : function ($canvas, params, callback,index) {
			
			$canvas.on("mousemove", {params: params, callback: callback,index:index}, function(e) {
				if (!$.jController.getHelper("inCircle")({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					cx : params.x,
					cy : params.y,
					cr : params.r,
				}) && $.jController.internal[e.data.index]._in) {
					
					callback(e);
					$.jController.internal[e.data.index]._in=false;

				}
			});
		}
	}
})