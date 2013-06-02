'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('merlin.services', []).value('version', '0.1')
	.factory('GameEngineService', function($http) {
		var _gameParameters = new Object();
		var _cardIndex;
		var _currentCardSet;
		var _cardQueue = new Object();
				_cardQueue.s3URL = 'img/sample';//'http://s3.amazonaws.com/mtg-merlin-us';
				_cardQueue.toURL = function(){
					return _cardQueue.s3URL+'/'+_cardQueue.language+'/'+_cardQueue.cardSet+'/'+_cardQueue.language+'-'+_cardQueue.cardSet+'-'+_cardQueue.list[0]+'-art.jpg';	
				};
				_cardQueue.getBgURLs = function(){
					var arr = [];
					
					$.each(_cardQueue.bgList, function(k, v){
						arr.push(_cardQueue.s3URL+'/'+_cardQueue.language+'/'+_cardQueue.cardSet+'/'+_cardQueue.language+'-'+_cardQueue.cardSet+'-'+v+'-bg.jpg');
					});
					
					return arr;
				};
		var _score = new Object();
			_score.correctCount = 0;
			_score.gameTime = 0;
			_score.total = 0;
	
		$http.get('card-index.json').success(function(data) {
			_cardIndex = data;
		});
	
		var _generateUniqueList = function(listSize, upperBound, blacklist) {
			var arr = [];
			while (arr.length < listSize) {
				var randomnumber = Math.ceil(Math.random() * upperBound);
				var found = false;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == randomnumber) {
						found = true;
						break
					}
				}
				if ($.inArray(randomnumber, blacklist) > -1)
					found = true;
				if (!found)
					arr.push(randomnumber);
			}
			
			return arr;
		};
		
		var _setCurrentCardSet = function(language, cardSet) {
			var filtered = $(_cardIndex[language]).filter(function(){
				return this.setCode === cardSet;
		    });
		    if(filtered.length === 1){
		    	_currentCardSet = filtered[0];
		    	_cardQueue.language = language;
				_cardQueue.cardSet = cardSet;
				_cardQueue.list = new Array();
		    }else{
			    console.error('Could not find card set from index');
			   	return false;	
			}
			return true;
		};
		
		var _generateRandomBgList = function(){
			_currentCardSet.blacklist.push(_cardQueue.list[0]);
			_cardQueue.bgList = _generateUniqueList(2, _currentCardSet.setCount, _currentCardSet.blacklist);
			_currentCardSet.blacklist.pop();
			_cardQueue.bgList.splice(Math.floor(Math.random() * 3), 0, _cardQueue.list[0]);
		};
	
		return {
			createGame : function(language, cardSet, cardCount, inverse, gameType) {
				_score.correctCount = 0;
				_score.gameTime = 0;
				_gameParameters.language = language;
				_gameParameters.cardSet = cardSet;
				_gameParameters.cardCount = cardCount;
				_gameParameters.inverse = inverse;
				_gameParameters.gameType = gameType;
				if(_setCurrentCardSet(language, cardSet)){
					_cardQueue.list = _generateUniqueList(cardCount, _currentCardSet.setCount, _currentCardSet.blacklist);
					_score.total = cardCount;
				}else{
					console.error('Something went wrong with creating game.');	
				}
			},
			resetGame : function(){
				_score.correctCount = 0;
				_score.gameTime = 0;
				if(_setCurrentCardSet(_gameParameters.language, _gameParameters.cardSet)){
					_cardQueue.list = _generateUniqueList(_gameParameters.cardCount, _currentCardSet.setCount, _currentCardSet.blacklist);
					_score.total = _gameParameters.cardCount;
				}else{
					console.error('Something went wrong with resetting game.');	
				}
			},
			nextCard : function(){
				_cardQueue.list.shift();
				_generateRandomBgList();
				return _cardQueue;
			},
			getCurrentCard : function() {
				// Deals with page refresh, send user back to compete page
				if(typeof _currentCardSet == "undefined") return false;
				_generateRandomBgList();
				return _cardQueue;
			},
			incrementCorrectCount : function() {
				++_score.correctCount;
			},
			getGameType : function(){
				return _gameParameters.gameType;
			},
			setGameTime : function(gameTime){
				_score.gameTime = gameTime;
			},
			getInverseClass : function(){
				return _gameParameters.inverse;
			},
			getScore : function(){
				return _score;
			}
		};
});
