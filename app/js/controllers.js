'use strict';

/* Controllers */

angular.module('merlin.controllers', []).
	controller('HomeCtrl', [function() {
	
	}])
	.controller('TrainCtrl', [function() {
	
	}])
	.controller('CompeteCtrl', ['$scope', 'GameEngineService', function($scope, GameEngineService) {
		$scope.languages = [
			{name:'English', value:"en"}
		];
		$scope.language = "en";
		
		$scope.cardSets = [
		    {name:'Magic 2013', value:"m13", category:'Core Sets'},
		    {name:'Magic 2012', value:"m12", category:'Core Sets'}
		];
		$scope.cardSet = 'm12';
		
		$scope.cardCount = '25';
		
		$scope.createGame = function(){
			GameEngineService.createGame($scope.language, $scope.cardSet, $scope.cardCount, $scope.inverse);	
		}
	}])
	.controller('PlayCtrl', ['$scope', '$timeout', 'GameEngineService', function($scope, $timeout, GameEngineService) {
		var gameEngine = GameEngineService.getCurrentCard();
		$scope.art = gameEngine.toURL();
		$scope.bgList = gameEngine.getBgURLs();
		$scope.cardSetCount = gameEngine.list.length;
		$scope.currentCard = 1;
		
		$scope.timer = '00:00:00';
		
		$scope.match = function(){
			// TODO check if answer is correct
			
			var gameEngine = GameEngineService.nextCard();
			$scope.art = gameEngine.toURL();
			$scope.bgList = gameEngine.getBgURLs();
			$scope.currentCard++;
		}
		
		$scope.done = function(){
			console.log('done pressed');
		}
	}])
	.controller('HowToCtrl', [function() {
	
	}])
	.controller('ProfileCtrl', [function() {
	
	}])
	.controller('RankingsCtrl', [function() {
	
	}]);