// Add rect plugin
$.jController.registerPlugin({
    name: "rect",

    construct: function(params) {
        var defaults = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        }

        return $.extend({}, defaults, params);
    },

    render: function(self) {
        var params = self.attr;
        $.jController
            .getHelper("canvasDraw")({
                color: params.color,
                fill: params.fill,
                line: params.line,
                shadow: params.shadow,
                draw: function() {
                    $.jController.getContext().rect(params.x, params.y, params.w, params.h);
                }
            })
    }
});
