var app = angular.module('myApp', []);


app.controller('numberCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
		$scope.startExperiment = function(){
		var participantNumber = $scope.participantNumber;
		console.log('the participant number: ',participantNumber)
		//$window.location.href = '/welcome';
	}
}]);