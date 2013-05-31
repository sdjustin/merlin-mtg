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
				$current.removeClass('current');
				if($current.prev().size() !== 0){
					$current.prev().addClass('current').show();
				}else{
					$('#card-bgs li:last-child').addClass('current').show();
				}
				scope.currentBg = $('.current').find('img').attr('src');
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
				$current.removeClass('current');
				if($current.next().size() !== 0){
					$current.next().addClass('current').show();
				}else{
					$('#card-bgs li:first-child').addClass('current').show();
				}
				scope.currentBg = $('.current').find('img').attr('src');
			});
  		}
  	}
  }]).
  directive('match', [function(){
  	return {
  		restrict: 'A',
  		link: function(scope, element, attrs){
  			$(element).on('click', function(){
	  			$('.current').removeClass('current');
	  			$('#card-bgs li').first().addClass('current');
	  			$('.right, .wrong').hide();
	  			if(scope.correctMatch){
	  				$('.right').fadeIn().delay(2000).fadeOut();
	  			}else{
	  				$('.wrong').fadeIn().delay(2000).fadeOut();
	  			}
			});
  		}
  	}
  }]).
  directive('timer', [function(){
  	return {
  		restrict: 'A',
  		link: function(scope, element, attrs){
  			$(element).stopwatch().on('tick.stopwatch', function(e, elapsed){
  				scope.timer = elapsed;
  			}).stopwatch('start');
		}
  	}
  }]);
