var app = angular.module('myApp', []);

app.controller('questionnaireCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
		$scope.submitQuestionnaire = function(){
		$scope.participantsInfo = {}
		$scope.participantsInfo['email'] = document.getElementById('email').value
		$scope.participantsInfo['name'] = document.getElementById('name').value
		$scope.participantsInfo['uniDegree'] = document.getElementById('uniDegree').value
		$scope.participantsInfo['age'] = document.getElementById('age').value
		
		$http.post('http://localhost:3000/participants-info', $scope.participantsInfo).then(
			function(response){
				console.log('success')
		},
		function(response){
			console.log('failed')
		});
		//go to research questions
		console.log($window);
		console.log();
		$window.location.href = '/research-questions';
	}
}]);