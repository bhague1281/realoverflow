realOverflow.controller('CommentCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $scope.question = {};
  $scope.comments = [];

  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId
  }).success(function(data) {
    console.log(data);
    $scope.question = data;
  });
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId + '/comments'
  }).success(function(data) {
    console.log(data);
    $scope.comments = data;
  });
}]);