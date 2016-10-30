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
			defer.reject(response);
		});
		return defer.promise;
	};
	return{
		getId: getId
	};
}]);

app.controller('myCtrl', ['$scope', '$http', '$window','questionService', 'getId', function($scope, $http,  $window, questionService, getId){
	console.log('in controller')
		questionService.getQuestions().then(function(data){
		$scope.questions=data;
		$scope.question=$scope.questions[0];
	}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	getId.getId().then(function(idInfo){
		console.log('idInfo:', idInfo);
		$scope.participant_id=idInfo;
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
	function registerAnswer(data){
		var trialObject = {}
		var currentAnswer = $("input:checked").val();
		trialObject["question_id"] =  data.question_id;
		trialObject["participant_id"] = $scope.participant_id;
		trialObject["correct"] = currentAnswer;
		trialObject["time"] = 13;
		return trialObject;
	}

	$scope.nextQuestion = function(){
		// get the selected value
		$scope.participantAnswers.push(registerAnswer($scope.question));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
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
		$scope.participantAnswers.push(registerAnswer($scope.question));
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

//app.controller('myCtrl', function($scope, $http, questionService, $window) {
/*	questionService.getQuestions().then(function(data){
		$scope.questions=data;
		$scope.question=$scope.questions[0];
	}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	var questionNumber = 0;
	//enable the Next button
	$("input:radio").change(function () {
		$("#nextButton").attr("disabled", false);
	});
	$scope.participantAnswers = new Array();
	//data will be $scope.question
	function registerAnswer(data){
		var trialObject = {}
		var currentAnswer = $("input:checked").val();
		trialObject["question_id"] =  data.question_id;
		trialObject["participant_id"] = 13;
		trialObject["correct"] = currentAnswer;
		trialObject["time"] = 13;
		return trialObject;
	}

	$scope.nextQuestion = function(){
		// get the selected value
		$scope.participantAnswers.push(registerAnswer($scope.question));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
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
		$scope.participantAnswers.push(registerAnswer($scope.question));
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
	}*/
//});

