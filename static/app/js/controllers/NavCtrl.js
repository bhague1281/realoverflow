realOverflow
.controller('NavCtrl', ['$scope', '$uibModal', 'auth', function($scope, $uibModal, auth) {
  $scope.navCollapsed = true;
  $scope.auth = function() {
    return auth;
  }

  $scope.openLoginModal = function() {
    var loginModal = $uibModal.open({
      animation: true,
      templateUrl: '/app/views/login.html',
      controller: 'LoginInstanceCtrl'
    });

    loginModal.result.then(function(user) {
      console.log(user);
      auth.login(user).then(function() {
        console.log('logged in!');
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
      auth.signup(user).then(function() {
        console.log('Signed up!');
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