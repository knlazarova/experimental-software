var app = angular.module('myApp', ['ngCookies'])

app.controller('numberCtrl', ['$scope', '$http', '$window', '$cookies',  function($scope, $http, $window, $cookies){
		$scope.startExperiment = function(num){
			$cookies.put("partNumber", num);
		$window.location.href = '/welcome';
	}
}]);

app.controller('questionnaireCtrl', ['$scope', '$http', '$window', '$cookies',  function($scope, $http, $window, $cookies){
  	console.log("partNumber", $cookies.get("partNumber"))
	$scope.submitQuestionnaire = function(){
		//object to hold participant's information
		$scope.participantsInfo = {}
		$scope.participantsInfo['participantId'] = $cookies.get("partNumber")
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
		//go to debrief page
		$window.location.href = '/thank-you';
	}
}])