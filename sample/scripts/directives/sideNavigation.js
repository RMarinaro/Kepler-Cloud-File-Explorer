angular.module('cloudDemo').directive('sideNavigation', ['$location',  function($location) {
	return {
		restrict: 'E',
		scope: true, //we want it's own scope
		templateUrl: 'partials/side-navigation-partial.html', 
		link: function($scope, element, attrs) {
			$scope.path = $location.path();
			console.log("nav path", $scope.path);
			$scope.go = function(url) {
				$location.path(url);
			}
		}
	}
}]);