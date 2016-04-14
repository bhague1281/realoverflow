realOverflow.controller('CommentCtrl', ['$scope', '$http', '$window', '$routeParams', 'Auth', 'Sockets', 'Alerts', function($scope, $http, $window, $routeParams, Auth, Sockets, Alerts) {
  $scope.pageClass = 'page-comments';
  $scope.question = {};
  $scope.comments = [];
  $scope.room = '';
  $scope.newComment = {
    content: '',
    userId: Auth.currentUser() ? Auth.currentUser().id : null,
    questionId: null
  }

  $scope.loggedIn = function() {
    return Auth.isLoggedIn();
  };

  $scope.goBack = function() {
    $window.history.back();
  }

  //get the question from the API
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId
  }).then(function success(response) {
    $scope.question = response.data;
    $scope.newComment.questionId = $scope.question.id;
    $scope.room = 'question' + $scope.question.id;
    Sockets.emitEvent('join room', {room: $scope.room});
  }, function error(response) {
    // console.log(response);
  });

  //get the question's comments from the API (perhaps modify the question show route to include comments)
  $http({
    method: 'GET',
    url: '/api/questions/' + $routeParams.questionId + '/comments'
  }).then(function success(response) {
    $scope.comments = response.data;
  }, function error(response) {
    // console.log(response);
  });

  //on comment form submit, emit the new comment
  $scope.submitComment = function() {
    Sockets.emitEvent('new comment', $scope.newComment);
    $scope.newComment.content = '';
  };

  $scope.up = function(idx) {
    $http({
      method: 'POST',
      url: '/api/questions/' + $scope.question.id + '/up'
    }).then(function success(response) {
      $scope.question.score += 1;
    }, function error(response) {
      Alerts.add('danger', 'You must be logged in to vote.');
    });
  };

  $scope.down = function(idx) {
    $http({
      method: 'POST',
      url: '/api/questions/' + $scope.question.id + '/down'
    }).then(function success(response) {
      $scope.question.score -= 1;
    }, function error(response) {
      Alerts.add('danger', 'You must be logged in to vote.');
    });
  };

  //catch any comments coming from the server that relate to this comment
  Sockets.addSocketListener('server comment', function(comment) {
    if (comment.questionId === $scope.question.id) {
      $scope.$apply(function() {
        $scope.comments.unshift(comment);
      });
    }
  });

  $scope.$on('$destroy', function(event) {
    Sockets.removeSocketListener('server comment');
    Sockets.emitEvent('leave room', {room: $scope.room});
  });
}]);
