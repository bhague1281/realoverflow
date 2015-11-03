realOverflow.controller('CommentCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $scope.question = {};
  $scope.comments = [];

  //get the question from the API
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId
  }).success(function(data) {
    console.log(data);
    $scope.question = data;
  });

  //get the question's comments from the API (perhaps modify the question show route to include comments)
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId + '/comments'
  }).success(function(data) {
    console.log(data);
    $scope.comments = data;
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