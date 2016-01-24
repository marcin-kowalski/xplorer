var movieCtrls = angular.module('movieCtrls', []);

movieCtrls.controller('movieList', function($scope, $http) {
    $http.get("/list")
    .then(function (response) {		
		$scope.movies = response.data; 
		console.log("responsse: " + $scope.movies[0]);
	});
});

movieCtrls.controller('movieDetails', function($scope, $http, $location) {
	$scope.stop = function() {
		$scope.state = "stopped";
	};
	
	$scope.start = function() {
		$scope.state = "started";
	};
	
	$scope.pause = function() {
		$scope.state = "paused";
	};
	
	$scope.back = function() {
		$location.path="/index.html";
	};
});