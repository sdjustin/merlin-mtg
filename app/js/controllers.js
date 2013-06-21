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
		    {name:'Magic 2013', value:"m13", category:'Core Sets'}
		];
		$scope.cardSet = 'm13';
		
		$scope.cardTypes = [
			{name:'Artifact', value:'artifact'},
			{name:'Creature', value:'creature'},
			{name:'Enchantments', value:'enchantment'},
			{name:'Instant', value:'instant'},
			{name:'Sorcery', value:'sorcery'},
		];
		$scope.cardType = ['artifact', 'creature', 'enchantment', 'instant', 'sorcery'];
		
		$scope.cardColors = [
			{name:'White', value:'white'},
			{name:'Blue', value:'blue'},
			{name:'Black', value:'black'},
			{name:'Red', value:'red'},
			{name:'Green', value:'green'},
			{name:'Multicolored', value:'multicolored'}
		];
		$scope.cardColor = ['white','blue','black','red','green','multicolored'];
		
		$scope.cardCount = '3';
		
		$scope.gameType = 'train';
		
		$scope.createGame = function(){
			GameEngineService.createGame($scope.language, $scope.cardSet, $scope.cardType, $scope.cardColor, $scope.cardCount, $scope.inverse, $scope.gameType);	
		}
	}])
	.controller('GameCtrl', ['$scope', '$timeout', '$location', 'GameEngineService', function($scope, $timeout, $location, GameEngineService) {
		var gameEngine = GameEngineService.getCurrentCard();
		// Page refresh was hit, go back to play page
		if(gameEngine === false) $location.path('/play');
		$scope.art = gameEngine.toURL();
		$scope.currentBgList = gameEngine.getCurrentBgURLs();
		$scope.nextBgList = gameEngine.getNextBgURLs();
		$scope.cardSetCount = gameEngine.list.length;
		$scope.currentCard = 1;
		$scope.currentBg = $scope.currentBgList[0];
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
			
			if(GameEngineService.getGameType() === 'train'){
				$scope.showAnsweredView = true;
			}else if(GameEngineService.getGameType() === 'compete'){
				nextCard($scope, GameEngineService);
			}
		}
		
		$scope.advanceNextCard = function(){
			$scope.showAnsweredView = false;
			nextCard($scope, GameEngineService);
		}
		
		$scope.showAnswer = function(){
			$scope.currentBgList = [$scope.art.replace('-art','-bg')];
		}
		
		$scope.done = function(){
			GameEngineService.setGameTime(jintervals($scope.timer/1000, "{h} hour, {m} min, {s} sec"));
			$location.path('/done');
		}
		
		function nextCard($scope, GameEngineService){
			if($scope.currentCard === $scope.cardSetCount){
				$scope.done();
			}else{
				var gameEngine = GameEngineService.nextCard();
				$scope.art = gameEngine.toURL();
				$scope.currentBgList = gameEngine.getCurrentBgURLs();
				$scope.nextBgList = gameEngine.getNextBgURLs();
				$scope.currentBg = $scope.currentBgList[0];
				$scope.currentCard++;
			}
		}
	}])
	.controller('HowToCtrl', [function() {
	
	}])
	.controller('ProfileCtrl', [function() {
	
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
	
