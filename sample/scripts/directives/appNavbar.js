angular.module('cloudDemo').directive('appNavbar', ['$location', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'partials/navbar-partial.html', 
		link: function($scope, element, attrs) {
			$scope.go = function(url) {
				$location.path(url);
			}
		}
	}
}]);