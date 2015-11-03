realOverflow.controller('HomeCtrl', ['$scope', '$controller', function($scope, $controller) {
  // include the questions to display on the home page
  $controller('QuestionCtrl', {$scope: $scope});
}]);