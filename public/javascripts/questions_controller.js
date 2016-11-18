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

app.factory('latinSquare', ['$http', '$q', function($http, $q){
	var getLatinSquare = function(){
		var defer = $q.defer();
		$http.get('http://localhost:3000/latin-square').then(function(response){
			defer.resolve(response.data);
		}, function(response){
			defer.reject(response);
		});
		return defer.promise;
	};
	return{
		getLatinSquare: getLatinSquare
	};
}]);


app.controller('myCtrl', ['$scope', '$http', '$window','questionService', '$cookies', 'latinSquare', function($scope, $http,  $window, questionService, $cookies, latinSquare){
	// record start time
	var startTime = new Date();
	//get the participant id
	$scope.participant_id=$cookies.get("partNumber")
	//get questions data
	questionService.getQuestions().then(function(data){
		$scope.questions=data;
		//get latin square
		latinSquare.getLatinSquare().then(function(latin){
		//console.log("latin square:", latin)
		$scope.orderedQuestions = new Array();
		var latinSquareNumber = 0
		var latinSquareData=latin
		for(var object in latinSquareData){
			if($scope.participant_id == latinSquareData[object]['id']){
				$scope.sequenceQuestions = latinSquareData[object]['order'].split(',')
			}
		}


		for( i=0; i<$scope.sequenceQuestions.length; i++){
			var orderedQuestionsId = $scope.sequenceQuestions[i]
			console.log(orderedQuestionsId)
			for( k=0; k<$scope.questions.length; k++){
				console.log("Question: ",$scope.questions[k]['question_id']);
				console.log("Id that we want: ",parseInt(orderedQuestionsId));
				if($scope.questions[k]['question_id'] === parseInt(orderedQuestionsId)){
					$scope.orderedQuestions.push($scope.questions[k]);
					break;
				}
			}
			
		}

		console.log('orederedQuestions.', ($scope.orderedQuestions))
	
		$scope.question = $scope.orderedQuestions[0]
	}).catch(function(){
		$scope.error = 'unable to get latin square';
	})
	}).catch(function(){
		$scope.error = 'unable to get the questions';
	})

	console.log("participant num from questions controller" + $cookies.get("partNumber"))
	//get latinSquare


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
		trialObject["type"] = question.type;
		trialObject["size"] = question.size;
		trialObject["layout"] = question.layout;
		trialObject["questionDomain"] = question.questionDomain;

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
		//console.log("registerAnswers: ", registerAnswer($scope.question, $scope.participant_id));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		$("#nextButton").attr("disabled", true);
		var startTime = new Date();
		//there are more than one questions left
		if (questionNumber < $scope.questions.length - 2){
			questionNumber = questionNumber+1;
			$scope.question = $scope.orderedQuestions[questionNumber];
		}
		else{
		questionNumber =$scope.orderedQuestions.length - 1;
		$scope.question = $scope.orderedQuestions[questionNumber];
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