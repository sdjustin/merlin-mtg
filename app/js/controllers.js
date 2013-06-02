'use strict';

/* Controllers */

angular.module('merlin.controllers', []).
	controller('HomeCtrl', [function() {
	
	}])
	.controller('PlayCtrl', ['$scope', 'GameEngineService', function($scope, GameEngineService) {
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
		
		$scope.gameType = 'train';
		
		$scope.createGame = function(){
			GameEngineService.createGame($scope.language, $scope.cardSet, $scope.cardCount, $scope.inverse, $scope.gameType);	
		}
	}])
	.controller('GameCtrl', ['$scope', '$timeout', '$location', 'GameEngineService', function($scope, $timeout, $location, GameEngineService) {
		var gameEngine = GameEngineService.getCurrentCard();
		// Page refresh was hit, go back to play page
		if(gameEngine === false) $location.path('/play');
		$scope.art = gameEngine.toURL();
		$scope.bgList = gameEngine.getBgURLs();
		$scope.cardSetCount = gameEngine.list.length;
		$scope.currentCard = 1;
		$scope.currentBg = $scope.bgList[0];
		$scope.inverseClass = GameEngineService.getInverseClass();
		
		$scope.timer = '00:00:00';
		
		$scope.gameType = GameEngineService.getGameType();
		
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
		
		$scope.showAnswer = function(){
			
		}
		
		$scope.done = function(){
			GameEngineService.setGameTime(jintervals($scope.timer/1000, "{h} hour, {m} min, {s} sec"));
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
		// Page refresh was hit, go back to play page
		if(score.gameTime === 0) $location.path('/play');
		$scope.scoreResults = score;
		
		$scope.again = function(){
			GameEngineService.resetGame();
			$location.path('/game');
		}
		
		$scope.reset = function(){
			$location.path('/play');
		}
	}]);
	
