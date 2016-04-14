realOverflow.factory('HttpRequestInterceptor', ['$window', function($window) {
  return {
    request: function(config) {
      config.headers['Authorization'] = 'JWT ' + $window.localStorage['realoverflow-token'];
      return config;
    }
  }
}]);
