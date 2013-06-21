'use strict';

// Declare app level module which depends on filters, and services
angular.module('merlin', ['merlin.filters', 'merlin.services', 'merlin.directives', 'merlin.controllers']).
  config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/play', {templateUrl: 'partials/play.html', controller: 'PlayCtrl'});
    $routeProvider.when('/game', {templateUrl: 'partials/game.html', controller: 'GameCtrl'});
    $routeProvider.when('/how-to', {templateUrl: 'partials/howto.html', controller: 'HowToCtrl'});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
    $routeProvider.when('/done', {templateUrl: 'partials/done.html', controller: 'DoneCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
