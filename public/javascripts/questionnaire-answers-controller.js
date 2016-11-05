//questionnaire-answers-controller.js

var app = angular.module('myApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});


app.factory('answerService', ['$http', '$q', function($http, $q){
	console.log('in factory')
	var getAnswers = function(){
		var defer = $q.defer();
		$http.get('http://localhost:3000/questionnaire-answers-db').then(function(response){
			defer.resolve(response.data);
		}, function(response){
			defer.reject(response);
		});
		return defer.promise;
	};
	return{
		getAnswers: getAnswers
	};
}]);

app.controller('questionnaireAnswersCtrl', ['$scope', '$http','answerService', function($scope, $http, answerService){

	answerService.getAnswers().then(function(data){
	$scope.answers=data;
	for (var i = $scope.answers.length - 1; i >= 0; i--) {
		$scope.answer = $scope.answers[i];
		$scope.participant_id = $scope.answer.participant_id;
	}
	//$scope.question=$scope.questions[0];
}).catch(function(){
		$scope.error = 'unable to get the questions';
	})

}]);