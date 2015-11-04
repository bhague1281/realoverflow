realOverflow.controller('QuestionCtrl', ['$scope', '$http', 'Auth', 'Sockets', function($scope, $http, Auth, Sockets) {
  $scope.questions = [];
  $scope.error = false;

  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  $http({
    method: 'GET',
    url: '/api/questions'
  }).then(function success(response) {
    console.log(response);
    $scope.questions = response.data;
  }, function error(response) {
    $scope.error = true;
  });

  $scope.submitQuestion = function() {
    Sockets.emitEvent('new question', {
      content: $scope.content,
      userId: Auth.currentUser().id, // replace with current user
      answered: false
    });
    $scope.content = '';
  };

  Sockets.addSocketListener('server question', function(question) {
    console.log(question);
    $scope.$apply(function() {
      $scope.questions.unshift(question);
    });
  });

  $scope.$on('$destroy', function(event) {
    Sockets.removeSocketListener('server question');
  });
}]);