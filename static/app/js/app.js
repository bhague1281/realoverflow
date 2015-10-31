var realOverflow = angular.module('RealOverflow', ['ngRoute', 'ui.bootstrap']);
var socket = io();

realOverflow.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/index.html',
    controller: 'HomeCtrl'
  })
  .when('/about', {
    templateUrl: 'app/views/about.html',
    controller: 'AboutCtrl'
  })
  .when('/questions', {
    templateUrl: 'app/views/questions.html',
    controller: 'QuestionCtrl'
  })
  .when('/questions/:questionId/comments', {
    templateUrl: 'app/views/comments.html',
    controller: 'CommentCtrl'
  })
  .otherwise({
    templateUrl: 'app/views/404.html'
  })

  $locationProvider.html5Mode(true);
}]);