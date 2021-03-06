var app = angular.module('myApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});


app.factory('answerService', ['$http', '$q', function($http, $q){
	var getAnswers = function(){
		var defer = $q.defer();
		$http.get('http://localhost:3000/research-answers-db').then(function(response){
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

app.controller('researchAnswersCtrl', ['$scope', '$http','answerService', function($scope, $http, answerService){
	answerService.getAnswers().then(function(data){
	//assign the answers to data
	$scope.answers=data;
}).catch(function(){
		$scope.error = 'unable to get the answers';
	})
}]);