var app = angular.module('myApp', [])
app.factory('ParticipantNumber', function(){
	return{
		participantNumber : 0
	}
})

app.controller('numberCtrl', ['$scope', '$http', '$window', '$rootScope', 'ParticipantNumber', function($scope, $http, $window, $rootScope, ParticipantNumber){
		$scope.startExperiment = function(){
		ParticipantNumber.participantNumber = $scope.participantNumber;
		console.log('the participant number: ', $rootScope.participantNumber)

		$window.location.href = '/participants-questionnaire';
	}
}]);