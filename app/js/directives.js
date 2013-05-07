'use strict';

/* Directives */


angular.module('merlin.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('previous', [function(){
  	return {
  		restrict: 'A',
  		link: function(scope, element, attrs){
  			$(element).on('click', function(){
  				var $current = $('.current');
				$current.removeClass('current').hide();
				if($current.prev().size() !== 0){
					$current.prev().addClass('current').show();
				}else{
					$('#card-bgs li:last-child').addClass('current').show();
				}
  			});
  		}
  	}
  }]).
  directive('next', [function(){
  	return {
  		restrict: 'A',
  		link: function(scope, element, attrs){
  			$(element).on('click', function(){
	  			var $current = $('.current');
				$current.removeClass('current').hide();
				if($current.next().size() !== 0){
					$current.next().addClass('current').show();
				}else{
					$('#card-bgs li:first-child').addClass('current').show();
				}
			});
  		}
  	}
  }]).
  directive('timer', [function(){
  	return {
  		restrict: 'A',
  		link: function(scope, element, attrs){
  			$(element).stopwatch().stopwatch('start');
		}
  	}
  }]);
