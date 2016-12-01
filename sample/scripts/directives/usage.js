angular.module('cloudDemo').directive('usage', ['$location', 'cloudWrapperService', 
	function($location, cloudWrapperService) {
	return {
		restrict: 'E',
		templateUrl: 'partials/usage-partial.html', 
		link: function($scope, element, attrs) {
			$scope.go = function(url) {
				$location.path(url);
			}
			$scope.cloud = cloudWrapperService.cloud;
			$scope.usagePercent = 0;
			$scope.usage = {};
			$scope.used = "";
			$scope.max = "";
			$scope.cloud.ready(function() {
				$scope.cloud.account({
					success: function(success) {
						//need to tell angular something changed outside it's lifecycle
						$scope.$apply(function() {
							console.log("account call", success);
							$scope.usagePercent =  success.body.usage.quotaUsed / success.body.usage.quota * 100;
							$scope.usage = success.body.usage;
							$scope.used = formatBytes(success.body.usage.quotaUsed, 2);
							$scope.max = formatBytes(success.body.usage.quota, 2);
						});
					},
					failure: function(failure) {

					}
				})

			});


			function formatBytes(bytes,decimals) {
			   if(bytes == 0) return '0 Byte';
			   var k = 1024; // or 1000 for vendor sizing
			   var dm = decimals || 3;
			   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			   var i = Math.floor(Math.log(bytes) / Math.log(k));
			   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			}
		}
	}
}]);