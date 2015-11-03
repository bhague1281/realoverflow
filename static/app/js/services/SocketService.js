realOverflow.service('Sockets', [function() {
  var socket = io();
  var events = [];

  return {
    addSocketListener: function(event, callback) {
      if (events.indexOf(event) === -1) {
        events.push(event);
        socket.on(event, callback);
        return true;
      } else {
        return false;
      }
    },
    removeSocketListener: function(event) {
      var idx = events.indexOf(event)
      if (idx > -1) {
        socket.removeAllListeners(event);
        events.splice(idx, 1);
        return true;
      } else {
        return false;
      }
    },
    emitEvent: function(event, payload) {
      socket.emit(event, payload);
    },
    getEvents: function() {
      return events;
    }
  }
}]);