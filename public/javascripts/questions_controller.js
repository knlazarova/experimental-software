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
	//get the participant id
	$scope.participant_id=$cookies.get("partNumber")
	//get questions data
	var startTime;
	var questionNumber = 0;
	$scope.isNext = true;
	$scope.participantAnswers = new Array();
	$("input:radio").attr("checked",false);
	questionService.getQuestions().then(function(data){
		$scope.questions=data;
		//get latin square
		latinSquare.getLatinSquare().then(function(latin){
		$scope.orderedQuestions = new Array();
		var latinSquareNumber = 0
		var latinSquareData=latin
		for(var object in latinSquareData){
			if($scope.participant_id == latinSquareData[object]['id']){
				$scope.sequenceQuestions = latinSquareData[object]['order'].split(',')
			}
		}
		// match the sequence of questions for the participant ID
		for( i=0; i<$scope.sequenceQuestions.length; i++){
			var orderedQuestionsId = $scope.sequenceQuestions[i]
			console.log(orderedQuestionsId)
			for( k=0; k<$scope.questions.length; k++){
				//console.log("Question: ",$scope.questions[k]['question_id']);
				//console.log("Id that we want: ",parseInt(orderedQuestionsId));
				if($scope.questions[k]['question_id'] === parseInt(orderedQuestionsId)){
					$scope.orderedQuestions.push($scope.questions[k]);
					break;
				}
			}	
		}
		$scope.question = $scope.orderedQuestions[0]
		// record start time
		startTime = new Date();
	}).catch(function(){
		$scope.error = 'unable to get latin square';
	})
	}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	console.log("participant num from questions controller" + $cookies.get("partNumber"))
	
	//enable the Next button
	// $("input:radio").change(function () {
	// 	$("#nextButton").attr("disabled", false);
	// });

	//data will be $scope.question
	$scope.registerAnswer = function(question, participant){
		var trialObject = {}
		var endTime = new Date();
		// total time it took to answer the question
		var timeTaken = endTime-startTime
		// convert into sec
		timeTaken /= 1000
		console.log(timeTaken)
		var currentAnswer = $("input:checked").val();
		console.log("currentAnswer", currentAnswer)
		trialObject["question_id"] =  question.question_id;

		trialObject["participant_id"] = $scope.participant_id
		trialObject["answer"] = currentAnswer;
		trialObject["time"] = timeTaken;
		trialObject["type"] = question.type;
		trialObject["size"] = question.size;
		trialObject["layout"] = question.layout;
		trialObject["domain_question"] = question.domain_question;

		if (question.correct == currentAnswer){
			trialObject["correct"] = "yes"
		} else{
			trialObject["correct"] = "no"
		}
		console.log("trialObject:", trialObject);
		return trialObject;
		
	}

	$scope.nextQuestion = function(){
		console.log("is next:", $scope.isNext)
		// get the selected value
		$scope.participantAnswers.push($scope.registerAnswer($scope.question, $scope.participant_id));
		console.log("in nextQuestion function")
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		//$("#nextButton").attr("disabled", true);
		startTime = new Date();
		//there are more than one questions left
		//
		if (questionNumber < $scope.orderedQuestions.length - 1){
			questionNumber = questionNumber+1;
			//console.log("questionNumber", questionNumber)
			$scope.question = $scope.orderedQuestions[questionNumber];
			console.log("scope question: ", $scope.question)
		}
		else{

			 //console.log("is next:", $scope.isNext)
			//questionNumber =$scope.orderedQuestions.length - 1;
			//$scope.question = $scope.orderedQuestions[questionNumber];
			console.log("about to call submitQuestions")
			$scope.submitQuestions();
		// show the submit button and hide the next button
			// document.getElementById("nextButton").style.display = "none";
			// document.getElementById("submitButton").style.display= "block";
			//enable the submit button on select
			// $("input:radio").change(function () {
		 //    	$("#submitButton").attr("disabled", false);
			// });
			 
		}
	}

	//send the answers to the database
	$scope.submitQuestions = function(){	
		console.log("in submitQuesitons")
		//$scope.participantAnswers.push($scope.registerAnswer($scope.question, $scope.participant_id));
		$http.post('http://localhost:3000/research-answers-db', $scope.participantAnswers).then(
			function(response){
				console.log('success')
				//go to thank-you
				$window.location.href = '/participants-questionnaire';
		},
		function(response){
			console.log('failed')
		});
		
		
	}
}]);