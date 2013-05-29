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
			$location.path('/done');
		}
	}])
	.controller('HowToCtrl', [function() {
	
	}])
	.controller('ProfileCtrl', [function() {
	
	}])
	.controller('RankingsCtrl', [function() {
	
	}])
	.controller('DoneCtrl', [function() {
	
	}]);
	
