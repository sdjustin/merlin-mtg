'use strict';

// Declare app level module which depends on filters, and services
angular.module('merlin', ['merlin.filters', 'merlin.services', 'merlin.directives', 'merlin.controllers']).
  config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/train', {templateUrl: 'partials/train.html', controller: 'TrainCtrl'});
    $routeProvider.when('/compete', {templateUrl: 'partials/compete.html', controller: 'CompeteCtrl'});
    $routeProvider.when('/play', {templateUrl: 'partials/play.html', controller: 'PlayCtrl'});
    $routeProvider.when('/how-to', {templateUrl: 'partials/howto.html', controller: 'HowToCtrl'});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'ProfileCtrl'});
    $routeProvider.when('/rankings', {templateUrl: 'partials/rankings.html', controller: 'RankingsCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
