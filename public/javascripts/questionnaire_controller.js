var app = angular.module('myApp', []);

app.controller('questionnaireCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
		$scope.submitQuestionnaire = function(){
		$scope.participantsInfo = {}
		//$scope.participantsInfo['email'] = document.getElementById('email').value
		$scope.participantsInfo['email'] = $scope.email;
		$scope.participantsInfo['name'] = $scope.name
		$scope.participantsInfo['uniDegree'] = $scope.uniDegree
		$scope.participantsInfo['age'] = $scope.age
		
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