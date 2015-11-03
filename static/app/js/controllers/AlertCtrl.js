realOverflow.controller('AlertCtrl', ['$scope', 'Alerts', function($scope, Alerts) {
  $scope.alerts = Alerts.get();

  $scope.closeAlert = function(idx) {
    Alerts.remove(idx);
  };
}]);