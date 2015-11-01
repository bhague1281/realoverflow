realOverflow.factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {}

  auth.saveToken = function(token) {
    $window.localStorage['realoverflow-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['realoverflow-token'];
  };

  auth.isLoggedIn = function() {
    var token = auth.getToken();
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now()/1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.email;
    }
  };

  auth.signup = function(user) {
    return $http.post('/api/signup', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.login = function(user) {
    return $http.post('/api/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logout = function() {
    $window.localStorage.removeItem('realoverflow-token');
  };

  return auth;
}])