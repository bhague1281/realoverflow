realOverflow.controller('HomeCtrl', ['$scope', '$controller', function($scope, $controller) {
  $scope.pageClass = 'page-home';
  // include the questions to display on the home page
  $controller('QuestionCtrl', {$scope: $scope});
}]);