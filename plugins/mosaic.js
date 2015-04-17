// Circle plugin (based on Arc)
$.jController.registerPlugin({

    name: "mosaic",

    construct: function(params) {
        var defaults = {
            r: 0,
            trace: false,
            colors: ["rgb(0,0,255)", "rgb(0,255,0)", "rgb(255,0,0)"]
        }

        return $.extend({}, defaults, params);
    },

    path: function(self) {
        (self.getInternal('innerCircle').getPath())();
    },

    render: function(self) {

        self.attr.t = new Date().getTime() * 0.002;
        self.attr.x = Math.sin(self.attr.t) * 192 + 256;
        self.attr.y = Math.cos(self.attr.t * 0.9) * 192 + 256;
        self.attr.c = Math.floor(Math.random() * self.attr.colors.length);

        if (self.attr.trace) {
            $.jController.clearCanvas(false);
        }

        var circle = self.render("circle", {
            x: self.attr.x,
            y: self.attr.y,
            r: self.attr.r,
            color: self.attr.colors[self.attr.c],
            fill: self.attr.colors[self.attr.c],
        });

        self.setInternal({
            innerCircle: circle
        })
    },
})
