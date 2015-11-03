realOverflow.controller('CommentCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $scope.question = {};
  $scope.comments = [];

  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId
  }).success(function(data) {
    console.log(data);
    $scope.question = data;
  });
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId + '/comments'
  }).success(function(data) {
    console.log(data);
    $scope.comments = data;
  });

  $scope.submitComment = function() {
    socket.emit('new comment', {
      content: $scope.content,
      userId: 1,
      questionId: $scope.question.id,
      score: 0
    });
    $scope.content = '';
  };

  socket.on('server comment', function(comment) {
    console.log(comment);
    if (comment.questionId === $scope.question.id) {
      $scope.$apply(function() {
        $scope.comments.unshift(comment);
      });
    }
  });
}]);