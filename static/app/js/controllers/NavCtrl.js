realOverflow
.controller('NavCtrl', ['$scope', '$uibModal', '$route', 'Auth', 'Alerts', 'Sockets', function($scope, $uibModal, $route, Auth, Alerts, Sockets) {
  $scope.navCollapsed = true;
  $scope.Auth = Auth;

  $scope.openLoginModal = function() {
    var loginModal = $uibModal.open({
      animation: true,
      templateUrl: '/app/views/login.html',
      controller: 'LoginInstanceCtrl'
    });

    loginModal.result.then(function(user) {
      Auth.login(user).then(function() {
        Alerts.add('success', 'You have successfully logged in');
        $route.reload();
      }).catch(function(error) {
        Alerts.add('danger', error.data.message);
      });
    });
  };

  $scope.openSignupModal = function() {
    var signupModal = $uibModal.open({
      animation: true,
      templateUrl: '/app/views/signup.html',
      controller: 'SignupInstanceCtrl'
    });

    signupModal.result.then(function(user) {
      Auth.signup(user).then(function() {
        Auth.login(user).then(function() {
          Alerts.add('success', 'You have successfully signed up and logged in');
          $route.reload();
        }).catch(function(error) {
          Alerts.add('danger', error.data.message);
        });
      }).catch(function(error) {
        Alerts.add('danger', error.data.message);
      });
    });
  };
}])
.controller('LoginInstanceCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
  $scope.user = {};

  $scope.submitLogin = function() {
    $uibModalInstance.close($scope.user);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}])
.controller('SignupInstanceCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
  $scope.user = {};

  $scope.submitSignup = function() {
    $uibModalInstance.close($scope.user);
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
