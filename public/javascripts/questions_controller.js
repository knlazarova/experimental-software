var app = angular.module('myApp', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{');
  $interpolateProvider.endSymbol('}');
});

app.controller('myCtrl', function($scope, questionService) {
	questionService.getQuestions().then(function(data){
		$scope.questions=data;
		console.log(JSON.stringify(data));
		$scope.question=$scope.questions[0];
	}).catch(function(){
		$scope.error = 'unable to get the questions';
	})
	var questionNumber = 0;
	//$scope.questionImage = 'images/' + $scope.question.image;
	$scope.nextQuestion = function(){
		console.log('in nextQuestion')
		if (questionNumber + 1 < $scope.questions.length){
			questionNumber = questionNumber+1;
			$scope.question = $scope.questions[questionNumber];
			//$scope.questionImage = "images/"+$scope.question.image;
			//console.log($scope.questionImage);
		}
		else{
			console.log('in elsee')
			//next turns into submit and sends data to db
		}
		
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

	/* $scope.firstName = "John";
	 $scope.lastName = "Doe";
	$http({
  method: 'GET',
  url: 'http://localhost:3000/db-questions'
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.questions = response.data; 

    console.log('success', response.data);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log('theres been an error')
  });
   
    

});*/

// function doOnSuccessCallback(response) {
//     var log = [];  
//     angular.forEach(response.data, function(item, key) {
//           console.log('I found this!' + response.config.newItem + " " + item.title);
//           if(item.title == response.config.newItem){
//             console.log('matching ' + item);
//             this.push(item);
//         }
//     }, log);
//     console.log(log);
//     return log; 
//   }