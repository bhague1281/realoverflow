realOverflow.controller('CommentCtrl', ['$scope', '$http', '$routeParams', 'Auth', function($scope, $http, $routeParams, Auth) {
  $scope.question = {};
  $scope.comments = [];

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
    socket.emit('new comment', {
      content: $scope.content,
      userId: 1, // replace with currently logged in user
      questionId: $scope.question.id,
      score: 0 // omit later w/a default value
    });
    $scope.content = '';
  };

  //catch any comments coming from the server that relate to this comment
  socket.on('server comment', function(comment) {
    console.log(comment);
    if (comment.questionId === $scope.question.id) {
      $scope.$apply(function() {
        $scope.comments.unshift(comment);
      });
    }
  });
}]);