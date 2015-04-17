// Circle plugin (based on Arc)
$.jController.registerPlugin({
    name: "circle",

    construct: function(params) {
        var defaults = {
            x: 0,
            y: 0,
            r: 0,
        }

        return $.extend({}, defaults, params);
    },

    path: function(self) {
        (self.getInternal('innerArc').getPath())();
    },

    render: function(self) {

        // Circles are full arcs
        var arc = self.render("arc", {
            x: self.attr.x,
            y: self.attr.y,
            r: self.attr.r,
            angleStart: 0,
            angleEnd: 2 * Math.PI,
            color: self.attr.color,
            fill: self.attr.fill,
            line: self.attr.line,
            shadow: self.attr.shadow,
        });

        self.setInternal({
            innerArc: arc
        });
    }
})
