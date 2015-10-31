realOverflow.controller('HomeCtrl', ['$scope', '$controller', function($scope, $controller) {
  $controller('QuestionCtrl', {$scope: $scope});
}]);