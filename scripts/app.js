var app = angular.module('myApp', ['ngRoute','movieCtrls']);
console.log("start");
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/listMovies', {
        templateUrl: 'views/list.html',
        controller: 'movieList'
      }).
      when('/status/:movieId', {
        templateUrl: 'views/status.html',
        controller: 'movieDetails'
      }).
      otherwise({
        redirectTo: '/listMovies'
      });
  }]);
