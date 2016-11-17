var app = angular.module('myApp', ['ngCookies']);


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

// app.factory('getId', ['$http', '$q', function($http, $q){
// 	console.log('in factory id')
// 	var getId = function(){
// 		var defer = $q.defer();
// 		$http.get('http://localhost:3000/get-participantId').then(function(response){
// 			defer.resolve(response.data);
// 		}, function(response){
// 			console.log("error in factory getID");
// 			defer.reject(response);
// 		});
// 		return defer.promise;
// 	};
// 	return{
// 		getId: getId
// 	};
// }]);

app.controller('myCtrl', ['$scope', '$http', '$window','questionService', '$cookies', function($scope, $http,  $window, questionService, $cookies){
	// record start time
	var startTime = new Date();
	//get questions data
	questionService.getQuestions().then(function(data){
	$scope.questions=data;
	$scope.question=$scope.questions[0];
}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	//get the participant id
	$scope.participant_id=$cookies.get("partNumber")
	console.log("participant num from questions controller":, $cookies.get("partNumber"))
	

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
		// total time it took to answer the question
		var timeTaken = endTime-startTime
		// convert into sec
		timeTaken /= 1000
		var currentAnswer = $("input:checked").val();
		trialObject["question_id"] =  question.question_id;
		trialObject["participant_id"] = $scope.participant_id
		trialObject["answer"] = currentAnswer;
		trialObject["time"] = timeTaken;
		if (question.correct == currentAnswer){
			trialObject["correct"] = "yes"
		} else{
			trialObject["correct"] = "no"
		}
		return trialObject;
		console.log("trialObject:", trialObject);
	}

	$scope.nextQuestion = function(){
		// get the selected value
		$scope.participantAnswers.push(registerAnswer($scope.question, $scope.participant_id));
		console.log("registerAnswers: ", registerAnswer($scope.question, $scope.participant_id));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		$("#nextButton").attr("disabled", true);
		var startTime = new Date();
		//there are more than one questions left
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
		}
	}
	$scope.submitQuestions = function(){	
		$scope.participantAnswers.push(registerAnswer($scope.question, $scope.participant_id));
		$http.post('http://localhost:3000/research-answers-db', $scope.participantAnswers).then(
			function(response){
				console.log('success')
		},
		function(response){
			console.log('failed')
		});
		//go to thank-you
		$window.location.href = '/participants-questionnaire';
	}
}]);