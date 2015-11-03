realOverflow
.controller('NavCtrl', ['$scope', '$uibModal', '$route', 'Auth', function($scope, $uibModal, $route, Auth) {
  $scope.navCollapsed = true;
  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  $scope.logout = function() {
    Auth.logout();
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
        $route.reload();
      }).catch(function(error) {
        console.log(error);
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
        console.log('Signed up!');
        $route.reload();
      }).catch(function(error) {
        console.log(error);
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