realOverflow.controller('QuestionCtrl', ['$scope', '$http', 'Auth', 'Sockets', 'Alerts', function($scope, $http, Auth, Sockets, Alerts) {
  $scope.pageClass = 'page-questions';
  $scope.questions = [];
  $scope.error = false;
  $scope.scrollDisabled = false;
  $scope.searchFilter = '';
  $scope.newQuestion = {
    content: '',
    userId: Auth.currentUser() ? Auth.currentUser().id : null
  }
  $scope.Auth = Auth;

  $scope.submitQuestion = function() {
    Sockets.emitEvent('new question', $scope.newQuestion);
    $scope.newQuestion.content = '';
  };

  $scope.loadQuestions = function() {
    if ($scope.scrollDisabled) return;
    $scope.scrollDisabled = true;
    $http({
      method: 'GET',
      url: '/api/questions',
      params: {limit: 20, offset: $scope.questions.length}
    }).then(function success(response) {
      // console.log(response);
      $scope.questions.push.apply($scope.questions, response.data);
      if (response.data.length) $scope.scrollDisabled = false;
    }, function error(response) {
      $scope.error = true;
      $scope.scrollDisabled = false;
    });
  }

  $scope.loadQuestions();

  $scope.up = function(idx) {
    $http({
      method: 'POST',
      url: '/api/questions/' + $scope.questions[idx].id + '/up'
    }).then(function success(response) {
      // console.log(response);
      $scope.questions[idx].score += 1;
    }, function error(response) {
      Alerts.add('danger', 'You must be logged in to vote.');
    });
  };

  $scope.down = function(idx) {
    $http({
      method: 'POST',
      url: '/api/questions/' + $scope.questions[idx].id + '/down'
    }).then(function success(response) {
      // console.log(response);
      $scope.questions[idx].score -= 1;
    }, function error(response) {
      Alerts.add('danger', 'You must be logged in to vote.');
    });
  };

  Sockets.addSocketListener('server question', function(question) {
    // console.log(question);
    $scope.$apply(function() {
      $scope.questions.unshift(question);
    });
  });

  $scope.$on('$destroy', function(event) {
    Sockets.removeSocketListener('server question');
  });
}]);
