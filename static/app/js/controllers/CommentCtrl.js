realOverflow.controller('CommentCtrl', ['$scope', '$http', '$routeParams', 'Auth', 'Sockets', function($scope, $http, $routeParams, Auth, Sockets) {
  $scope.question = {};
  $scope.comments = [];

  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  }

  //get the question from the API
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId,
    headers: {
      'Authorization': 'JWT ' + Auth.getToken()
    }
  }).then(function success(response) {
    console.log(response);
    $scope.question = response.data;
  }, function error(response) {
    console.log(response);
  });

  //get the question's comments from the API (perhaps modify the question show route to include comments)
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId + '/comments',
    headers: {
      'Authorization': 'JWT ' + Auth.getToken()
    }
  }).then(function success(response) {
    console.log(response);
    $scope.comments = response.data;
  }, function error(response) {
    console.log(response);
  });

  //on comment form submit, emit the new comment
  $scope.submitComment = function() {
    Sockets.emitEvent('new comment', {
      content: $scope.content,
      userId: Auth.currentUser().id,
      questionId: $scope.question.id
    });
    $scope.content = '';
  };

  //catch any comments coming from the server that relate to this comment
  Sockets.addSocketListener('server comment', function(comment) {
    console.log(comment);
    if (comment.questionId === $scope.question.id) {
      $scope.$apply(function() {
        $scope.comments.unshift(comment);
      });
    }
  });

  $scope.$on('$destroy', function(event) {
    Sockets.removeSocketListener('server comment');
  });
}]);