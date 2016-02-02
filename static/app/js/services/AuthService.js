realOverflow.factory('Auth', ['$http', '$window', 'Alerts', '$route', function($http, $window, Alerts, $route) {
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
        // console.log(err);
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
        return payload;
      } catch(err) {
        return false;
      }
    }
  };

  auth.signup = function(user) {
    return $http.post('/api/signup', user).then(function success(response) {
      auth.saveToken(response.data.token);
    }, function error(response) {
      throw response
    });
  };

  auth.login = function(user) {
    return $http.post('/api/login', user).then(function success(response) {
      auth.saveToken(response.data.token);
    }, function error(response) {
      throw response
    });
  };

  auth.logout = function() {
    $window.localStorage.removeItem('realoverflow-token');
    Alerts.add('success', 'You have successfully logged out');
    $route.reload();
  };

  return auth;
}])
