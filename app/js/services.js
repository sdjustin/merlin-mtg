'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('merlin.services', []).value('version', '0.1')
	.factory('UserService', function($http){
	
	})
	.factory('GameEngineService', function($http) {
		var _gameParameters = new Object();
		var _cardIndex;
		var _currentCardSet;
		var _cardQueue = new Object();
				_cardQueue.s3URL = 'cards';//'http://s3.amazonaws.com/merlin-mtg/cards';//'img/sample';
				_cardQueue.toURL = function(){
					return _cardQueue.s3URL+'/'+_cardQueue.language+'/'+_cardQueue.cardSet+'/'+_cardQueue.language+'-'+_cardQueue.cardSet+'-'+_cardQueue.list[0]+'-art.jpg';	
				};
				_cardQueue.getCurrentBgURLs = function(){
					return _contructBgImgURLs(_cardQueue.currentBgList);
				};
				_cardQueue.getNextBgURLs = function(){
					return _contructBgImgURLs(_cardQueue.nextBgList);
				};
		var _score = new Object();
			_score.correctCount = 0;
			_score.gameTime = 0;
			_score.total = 0;
	
		$http.get('card-index.json').success(function(data) {
			_cardIndex = data;
		});
		
		var _contructBgImgURLs = function(list){
			var arr = [];
					
			$.each(list, function(k, v){
				arr.push(_cardQueue.s3URL+'/'+_cardQueue.language+'/'+_cardQueue.cardSet+'/'+_cardQueue.language+'-'+_cardQueue.cardSet+'-'+v+'-bg.jpg');
			});
					
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
		
		var _generateUniqueList = function(listSize, whitelist, excludeValue) {
			var colorArrays = [];
			var typeArrays = [];
			var arrays = [];
			
			$.each(whitelist, function(k, v){
				switch (v){
					case "artifact":
						typeArrays = typeArrays.concat(_currentCardSet.artifact);
						break;
					case "creature":
						typeArrays = typeArrays.concat(_currentCardSet.creature);
						break;
					case "enchantment":
						typeArrays = typeArrays.concat(_currentCardSet.enchantment);
						break;
					case "instant":
						typeArrays = typeArrays.concat(_currentCardSet.instant);
						break;
					case "sorcery":
						typeArrays = typeArrays.concat(_currentCardSet.sorcery);
						break;
					case "white":
						colorArrays = colorArrays.concat(_currentCardSet.white);
						break;
					case "blue":
						colorArrays = colorArrays.concat(_currentCardSet.blue);
						break;
					case "black":
						colorArrays = colorArrays.concat(_currentCardSet.black);
						break;
					case "red":
						colorArrays = colorArrays.concat(_currentCardSet.red);
						break;
					case "green":
						colorArrays = colorArrays.concat(_currentCardSet.green);
						break;
					case "multicolored":
						colorArrays = colorArrays.concat(_currentCardSet.multicolored);
						break;
				}
			});
			
			arrays = _.intersection(colorArrays, typeArrays);
			arrays = _.without(arrays, excludeValue);
			
			return _.shuffle(arrays).slice(0, listSize);
		};
		
		var _generateRandomBgList = function(cardCount){
			var bgList = [];
			for(var i=0; i < cardCount; i++){
				var arr = [];
				
				arr = _generateUniqueList(4, _gameParameters.whiteList, _cardQueue.list[i]);
				arr.splice(Math.floor(Math.random() * 4), 0, _cardQueue.list[i]);
				
				bgList = bgList.concat(arr);
			}
			
			return bgList;
		};
	
		return {
			createGame : function(language, cardSet, cardType, cardColor, cardCount, inverse, gameType) {
				_score.correctCount = 0;
				_score.gameTime = 0;
				_gameParameters.language = language;
				_gameParameters.cardSet = cardSet;
				_gameParameters.cardType = cardType;
				_gameParameters.cardCount = cardCount;
				_gameParameters.inverse = inverse;
				_gameParameters.gameType = gameType;
				_gameParameters.whiteList = cardType.concat(cardColor);
				if(_setCurrentCardSet(language, cardSet)){
					_cardQueue.list = _generateUniqueList(cardCount, _gameParameters.whiteList);
					_cardQueue.bgList = _generateRandomBgList(cardCount);
					_cardQueue.currentBgList = _cardQueue.bgList.splice(0,5);
					_cardQueue.nextBgList = _cardQueue.bgList.slice(0,5);
					_score.total = cardCount;
				}else{
					console.error('Something went wrong with creating game.');	
				}
			},
			resetGame : function(){
				_score.correctCount = 0;
				_score.gameTime = 0;
				if(_setCurrentCardSet(_gameParameters.language, _gameParameters.cardSet)){
					_cardQueue.list = _generateUniqueList(_gameParameters.cardCount, _gameParameters.whiteList);
					_cardQueue.bgList = _generateRandomBgList(_gameParameters.cardCount);
					_cardQueue.currentBgList = _cardQueue.bgList.splice(0,5);
					_cardQueue.nextBgList = _cardQueue.bgList.slice(0,5);
					_score.total = _gameParameters.cardCount;
				}else{
					console.error('Something went wrong with resetting game.');	
				}
			},
			nextCard : function(){
				_cardQueue.list.shift();
				_cardQueue.currentBgList = _cardQueue.bgList.splice(0,5);
				_cardQueue.nextBgList = _cardQueue.bgList.slice(0,5);
				return _cardQueue;
			},
			getCurrentCard : function() {
				// Deals with page refresh, send user back to compete page
				if(typeof _currentCardSet == "undefined") return false;
				
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
