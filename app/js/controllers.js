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
		
		$scope.cardCount = '3';
		
		$scope.createGame = function(){
			GameEngineService.createGame($scope.language, $scope.cardSet, $scope.cardCount, $scope.inverse);	
		}
	}])
	.controller('PlayCtrl', ['$scope', '$timeout', '$location', 'GameEngineService', function($scope, $timeout, $location, GameEngineService) {
		var gameEngine = GameEngineService.getCurrentCard();
		// Page refresh was hit, go back to compete page
		if(gameEngine === false) $location.path('/compete');
		$scope.art = gameEngine.toURL();
		$scope.bgList = gameEngine.getBgURLs();
		$scope.cardSetCount = gameEngine.list.length;
		$scope.currentCard = 1;
		$scope.currentBg = $scope.bgList[0];
		$scope.inverseClass = GameEngineService.getInverseClass();
		
		$scope.timer = '00:00:00';
		
		$scope.match = function(){			
			if($scope.art.replace('-art','') === $scope.currentBg.replace('-bg','')){
				GameEngineService.incrementCorrectCount();
				$scope.correctMatch = true;
			}else{
				$scope.correctMatch = false;
			}
			
			if($scope.currentCard === $scope.cardSetCount){
				$scope.done();
				return;
			}
			
			var gameEngine = GameEngineService.nextCard();
			$scope.art = gameEngine.toURL();
			$scope.bgList = gameEngine.getBgURLs();
			$scope.currentBg = $scope.bgList[0];
			$scope.currentCard++;
		}
		
		$scope.done = function(){
			GameEngineService.setGameTime(jintervals($scope.timer/1000, "{M} min, {S} sec"));
			$location.path('/done');
		}
	}])
	.controller('HowToCtrl', [function() {
	
	}])
	.controller('ProfileCtrl', [function() {
	
	}])
	.controller('RankingsCtrl', [function() {
	
	}])
	.controller('DoneCtrl', ['$scope', '$location', 'GameEngineService', function($scope, $location, GameEngineService) {
		var score = GameEngineService.getScore();
		// Page refresh was hit, go back to compete page
		if(score.gameTime === 0) $location.path('/compete');
		$scope.scoreResults = score;
		
		$scope.again = function(){
			GameEngineService.resetGame();
			$location.path('/play');
		}
		
		$scope.reset = function(){
			$location.path('/compete');
		}
	}]);
	
