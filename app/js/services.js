'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('merlin.services', []).value('version', '0.1').factory('GameEngineService', function($http) {
	var _cardIndex;
	var _currentCardSet;
	var _cardQueue = new Object();
			_cardQueue.s3URL = 'http://s3.amazonaws.com/mtg-merlin-us';
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
		_cardQueue.bgList = _generateUniqueList(4, _currentCardSet.setCount, _currentCardSet.blacklist);
		_cardQueue.bgList.splice(Math.floor(Math.random() * 5), 0, _cardQueue.list[0]);
	};

	return {
		createGame : function(language, cardSet, cardCount, inverse) {
			if(_setCurrentCardSet(language, cardSet)){
				_cardQueue.list = _generateUniqueList(cardCount, _currentCardSet.setCount, _currentCardSet.blacklist);
			}else{
				console.error('Something went wrong with creating game.');	
			}
		},
		nextCard : function(){
			_cardQueue.list.shift();
			_generateRandomBgList();
			return _cardQueue;
		},
		getCurrentCard : function() {
			_generateRandomBgList();
			return _cardQueue;
		}
	};
});
