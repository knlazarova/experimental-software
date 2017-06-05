var app = angular.module('myApp', ['ngCookies']);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});

//get all the questions for the experiment from the db
app.factory('questionService', ['$http', '$q', function($http, $q){
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

//get Latin square information from the db
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
	var startTime;
	var questionNumber = 0;
	$scope.isNext = true;
	$scope.participantAnswers = new Array();
	$("input:radio").attr("checked",false);
	//get questions data
	questionService.getQuestions().then(function(data){
		$scope.questions=data;
		//get latin square
		latinSquare.getLatinSquare().then(function(latin){
		$scope.orderedQuestions = new Array();
		var latinSquareNumber = 0
		var latinSquareData=latin
		for(var object in latinSquareData){
			//match the participant id with the latin square participant id
			if($scope.participant_id == latinSquareData[object]['id']){
				//assign the correct sequence to a scope variable
				$scope.sequenceQuestions = latinSquareData[object]['order'].split(',')
			}
		}
		// match the sequence of questions for the participant ID
		for( i=0; i<$scope.sequenceQuestions.length; i++){
			var orderedQuestionsId = $scope.sequenceQuestions[i]
			for( k=0; k<$scope.questions.length; k++){
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

	//when click on registerAnswer
	$scope.registerAnswer = function(question, participant){
		var trialObject = {}
		var endTime = new Date();
		// total time it took to answer the question
		var timeTaken = endTime-startTime
		// convert into sec
		timeTaken /= 1000
		//take the participants' answer
		var currentAnswer = $("input:checked").val();
		//add the trial data to a JSON object
		trialObject["question_id"] =  question.question_id;
		trialObject["participant_id"] = $scope.participant_id
		trialObject["answer"] = currentAnswer;
		trialObject["time"] = timeTaken;
		trialObject["type"] = question.type;
		trialObject["size"] = question.size;
		trialObject["layout"] = question.layout;
		trialObject["domain_question"] = question.domain_question;
		//check if the answer is correct
		if (question.correct == currentAnswer){
			trialObject["correct"] = "yes"
		} else{
			trialObject["correct"] = "no"
		}
		return trialObject;
	}


	$scope.nextQuestion = function(){
		// get the selected value
		$scope.participantAnswers.push($scope.registerAnswer($scope.question, $scope.participant_id));
		// Uncheck radio buttons
		$("input:radio").attr("checked",false);
		//start timer
		startTime = new Date();
		//there are more than one questions left
		if (questionNumber < $scope.orderedQuestions.length - 1){
			questionNumber = questionNumber+1;
			$scope.question = $scope.orderedQuestions[questionNumber];
		}
		else{
			$scope.submitQuestions();			 
		}
	}
	//send the answers to the database
	$scope.submitQuestions = function(){	
		$http.post('http://localhost:3000/research-answers-db', $scope.participantAnswers).then(
			function(response){
				console.log('success')
				//go to the demographic questionnaire
				$window.location.href = '/participants-questionnaire';
		},
		function(response){
			console.log('failed')
		});
	}
}]);