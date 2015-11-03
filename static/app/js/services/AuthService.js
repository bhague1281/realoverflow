realOverflow.factory('Auth', ['$http', '$window', function($http, $window) {
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
      try {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now()/1000;
      } catch (err) {
        console.log(err);
        return false;
      }
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      try {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.email;
      } catch(err) {
        return false;
      }
    }
  };

  auth.signup = function(user) {
    return $http.post('/api/signup', user).then(function success(response) {
      auth.saveToken(response.data.token);
    }, function error(response) {
      console.log(response);
    });
  };

  auth.login = function(user) {
    return $http.post('/api/login', user).then(function success(response) {
      auth.saveToken(response.data.token);
    }, function error(response) {
      console.log(response);
    });
  };

  auth.logout = function() {
    $window.localStorage.removeItem('realoverflow-token');
  };

  return auth;
}])