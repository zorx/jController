var listEvents = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'pointerdown', 'pointermove', 'pointerup'];

$.each(listEvents, function(index, eventName) {
    $.jController.registerEvent({
        name: eventName,
        listener: eventName,
        fn: function(self, callback, data) {
            var canvas = $.jController.getCanvas();
            if (self.inPath(
                data.offsetX,
                data.offsetY
            )) {
                callback(self, data);
            }
        }
    });
});

var enterEvents = [{
    name: 'mouseenter',
    listener: 'mousemove',
    internal: '_mouseEnter'
}, {
    name: 'pointerenter',
    listener: 'pointermove',
    internal: '_pointerEnter'
}];
$.each(enterEvents, function(index, event) {
    $.jController.registerEvent({
        name: event.name,
        listener: event.listener,
        fn: function(self, callback, data) {
            var canvas = $.jController.getCanvas();
            if (!self.getInternal(event.internal) &&
                self.inPath(
                    data.offsetX,
                    data.offsetY
                )) {
                var obj = {};
                obj[event.internal] = true;
                self.setInternal(obj);
                callback(self, data);
            }
        }
    });
});

var leaveEvents = [{
    name: 'mouseleave',
    listener: 'mousemove',
    internal: '_mouseEnter'
}, {
    name: 'pointerleave',
    listener: 'pointermove',
    internal: '_pointerEnter'
}];

$.each(leaveEvents, function(index, event) {
    $.jController.registerEvent({
        name: event.name,
        listener: event.listener,
        fn: function(self, callback, data) {
            var canvas = $.jController.getCanvas();
            if (self.getInternal(event.internal) && !self.inPath(
                data.offsetX,
                data.offsetY
            )) {
                callback(self, data);
                var obj = {};
                obj[event.internal] = false;
                self.setInternal(obj);
            }
        }
    });
});
