realOverflow.controller('QuestionCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.questions = [];

  $http({
    method: 'GET',
    url: '/api/questions'
  }).success(function(data) {
    console.log(data);
    $scope.questions = data;
  });

  $scope.submitQuestion = function() {
    socket.emit('new question', {
      content: $scope.content,
      userId: 1, // replace with current user
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
}]);