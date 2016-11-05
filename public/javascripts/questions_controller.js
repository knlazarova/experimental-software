var app = angular.module('myApp', []);


app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});


app.factory('questionService', ['$http', '$q', function($http, $q){
	console.log('in factory')
	var getQuestions = function(){
		var defer = $q.defer();
		$http.get('http://localhost:3000/db-questions').then(function(response){
			defer.resolve(response.data);
		}, function(response){
			defer.reject(response);
		});
		return defer.promise;
	};
	return{
		getQuestions: getQuestions
	};
}]);

app.factory('getId', ['$http', '$q', function($http, $q){
	console.log('in factory id')
	var getId = function(){
		var defer = $q.defer();
		$http.get('http://localhost:3000/get-participantId').then(function(response){
			defer.resolve(response.data);
		}, function(response){
			console.log("error in factory getID");
			defer.reject(response);
		});
		return defer.promise;
	};
	return{
		getId: getId
	};
}]);

app.controller('myCtrl', ['$scope', '$http', '$window','questionService', 'getId', function($scope, $http,  $window, questionService, getId){
	
	// record start time
	var startTime = new Date();
	questionService.getQuestions().then(function(data){
	$scope.questions=data;
	$scope.question=$scope.questions[0];
}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	getId.getId().then(function(idData){
		$scope.participant_id=idData;
		$scope.participant_id=$scope.participant_id[0];
	}).catch(function(){
		$scope.error = 'unable to get the id';
	})
	var questionNumber = 0;
	//enable the Next button
	$("input:radio").change(function () {
		$("#nextButton").attr("disabled", false);
	});
	$scope.participantAnswers = new Array();
	//data will be $scope.question
	function registerAnswer(question, participant){
		
		var trialObject = {}
		var endTime = new Date();
		var timeTaken = endTime-startTime
		// in sec
		timeTaken /= 1000
		var currentAnswer = $("input:checked").val();
		trialObject["question_id"] =  question.question_id;
		trialObject["participant_id"] = participant.participant_id;
		trialObject["correct"] = currentAnswer;
		trialObject["time"] = timeTaken;
		return trialObject;
		console.log("trialObject:", trialObject);
	}

	$scope.nextQuestion = function(){
		// get the selected value
		$scope.participantAnswers.push(registerAnswer($scope.question, $scope.participant_id));
		console.log("registerAnswers: ", registerAnswer($scope.question, $scope.participant_id));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		var startTime = new Date();
		//$scope.participantAnswers["question_id"] = $scope.question.question_id;
		console.log("question id: ",  $scope.question.question_id)
		if (questionNumber < $scope.questions.length - 2){
			questionNumber = questionNumber+1;
			$scope.question = $scope.questions[questionNumber];
		}
		else{
		questionNumber = $scope.questions.length - 1;
		$scope.question = $scope.questions[questionNumber];
		// show the submit button and hide the next button
			document.getElementById("nextButton").style.display = "none";
			document.getElementById("submitButton").style.display= "block";
			//enable the submit button on select
			$("input:radio").change(function () {
		    	$("#submitButton").attr("disabled", false);
	});
		//$scope.participantAnswers.push(registerAnswer($scope.question));		
		}
	}
	$scope.submitQuestions = function(){	
		$scope.participantAnswers.push(registerAnswer($scope.question, $scope.participant_id));
		console.log(JSON.stringify($scope.participantAnswers));
		$http.post('http://localhost:3000/research-answers-db', $scope.participantAnswers).then(
			function(response){
				console.log('success')
		},
		function(response){
			console.log('failed')
		});
		//go to thank-you
		$window.location.href = '/thank-you';
	}
}]);