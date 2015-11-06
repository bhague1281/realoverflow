realOverflow.controller('QuestionCtrl', ['$scope', '$http', 'Auth', 'Sockets', function($scope, $http, Auth, Sockets) {
  $scope.questions = [];
  $scope.error = false;
  $scope.scrollDisabled = false;

  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  // $http({
  //   method: 'GET',
  //   url: '/api/questions',
  //   params: {limit: 10}
  // }).then(function success(response) {
  //   console.log(response);
  //   $scope.questions = response.data;
  // }, function error(response) {
  //   $scope.error = true;
  // });

  $scope.submitQuestion = function() {
    Sockets.emitEvent('new question', {
      content: $scope.content,
      userId: Auth.currentUser().id, // replace with current user
      answered: false
    });
    $scope.content = '';
  };

  $scope.loadQuestions = function() {
    $scope.scrollDisabled = true;
    $http({
      method: 'GET',
      url: '/api/questions',
      params: {limit: 20, offset: $scope.questions.length}
    }).then(function success(response) {
      console.log(response);
      $scope.questions.push.apply($scope.questions, response.data);
      if (response.data.length) $scope.scrollDisabled = false;
    }, function error(response) {
      $scope.error = true;
      $scope.scrollDisabled = false;
    });
  }

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