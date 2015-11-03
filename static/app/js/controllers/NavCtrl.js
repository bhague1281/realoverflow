realOverflow
.controller('NavCtrl', ['$scope', '$uibModal', '$route', 'Auth', 'Alerts', function($scope, $uibModal, $route, Auth, Alerts) {
  $scope.navCollapsed = true;
  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  $scope.logout = function() {
    Auth.logout();
    Alerts.add('success', 'You have successfully logged out');
    $route.reload();
  }

  $scope.currentUser = function() {
    return Auth.currentUser();
  }

  $scope.openLoginModal = function() {
    var loginModal = $uibModal.open({
      animation: true,
      templateUrl: '/app/views/login.html',
      controller: 'LoginInstanceCtrl'
    });

    loginModal.result.then(function(user) {
      console.log(user);
      Auth.login(user).then(function() {
        console.log('logged in!');
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
      console.log(user);
      Auth.signup(user).then(function() {
        Auth.login(user).then(function() {
          Alerts.add('success', 'You have successfully signed up and logged in');
          console.log('logged in!');
          $route.reload();
        }).catch(function(error) {
          Alerts.add('danger', error.data.message);
        });
      }).catch(function(error) {
        Alerts.add('danger', 'An error occurred when signing up. Try again.');
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