realOverflow.controller('QuestionCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth) {
  $scope.questions = [];
  $scope.error = false;

  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  $http({
    method: 'GET',
    url: '/api/questions',
    headers: {
      'Authorization': 'JWT ' + Auth.getToken()
    }
  }).then(function success(response) {
    console.log(response);
    $scope.questions = response.data;
  }, function error(response) {
    $scope.error = true;
  });

  $scope.submitQuestion = function() {
    socket.emit('new question', {
      content: $scope.content,
      userId: Auth.currentUser().id, // replace with current user
      answered: false,
      score: 0 // replace w/a default value
    });
    $scope.content = '';
  };

  socket.on('server question', function(question) {
    console.log(question);
    $scope.$apply(function() {
      $scope.questions.unshift(question);
    });
  });

  $scope.$on('$destroy', function(event) {
    socket.removeAllListeners();
  });
}]);