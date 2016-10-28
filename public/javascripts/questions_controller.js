var app = angular.module('myApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});

app.controller('myCtrl', function($scope, $http, questionService) {
	questionService.getQuestions().then(function(data){
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
	
	$scope.participantAnswers = {};

	$scope.nextQuestion = function(){
		// get the selected value

		var currentAnswer = $("input:checked").val();
		$scope.participantAnswers["correct"] = currentAnswer;
		//participantAnswers = participantAnswers + currentAnswer;
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		$scope.participantAnswers["question_id"] = $scope.question.question_id;
		console.log("question id: ",  $scope.question.question_id)
		if (questionNumber + 2 < $scope.questions.length){
			questionNumber = questionNumber+1;
			$scope.question = $scope.questions[questionNumber];
	
		}
		else{
			document.getElementById("nextButton").style.display = "none";
			document.getElementById("submitButton").style.display= "block";
			//enable the submit button as this is the last question
			$("input:radio").change(function () {
		    	$("#submitButton").attr("disabled", false);
	});
				
		}
	}
	$scope.submitQuestions = function(){
		//console.log('submitQuestions', participantAnswers);
		$http.post('http://localhost:3000/research-answers-db', $scope.participantAnswers)/*.then(
			console.log('success'); 
			console.log('failed'));*/
	}
});

app.factory('questionService', function($http, $q){
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
});