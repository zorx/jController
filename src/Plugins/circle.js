// Circle plugin (based on Arc)
$.jController.registerPlugin({
	
	// Plugin Name
	name : "circle",

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
		click : function(canvas,params,callback){
			canvas.on("click",{params:params,callback:callback},function(e){
				var inCircle = $.jController.getHelper("inCircle")
				({
					px : e.pageX - this.offsetLeft,
					py : e.pageY - this.offsetTop,
					x : e.data.params.x,
					y : e.data.params.y,
					radius : e.data.params.r
				});

				if (inCircle)
				{
					e.data.callback();
				}
			});
		},

		mouseover : function (canvas,params,callback){
			
		}
	}
})