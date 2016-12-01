angular.module('cloudDemo').controller('sharesController', ['$scope', 'cloudWrapperService', '$location',
	function($scope, cloudWrapperService, $location) {		
		//inject the wrapper service and put it in our scope
		$scope.cloud = cloudWrapperService.cloud;
		
		$scope.shares = [];
		$scope.loading = false;
		$scope.cloud.ready(function() {
			//api is ready, but we might not be authenticated
			if(!$scope.cloud.isAuthenticated()) {
				console.log("not logged in, rerouting");
				//send the user to the login page
				$location.path("/");
			} else {
				//logged in, lets call contacts
				$scope.loading = true;			
				$scope.cloud.getShares( 
				{
					success: function(success) {
						console.log("success", success);
						//we use evalAsync here because API calls inside the cloud API are happening outside of
						//angular's control, so we have to play nice with angular and update data in a digest cycle
						$scope.$evalAsync(function() {
							$scope.shares = success.body.shares.share;
							$scope.loading = false;
						})
					},
					failure: function(failure) {
						//we got a network error, prompt something to the user here
						console.log("failure", failure);
						$scope.$evalAsync(function() {
							$scope.loading = false;
						});
					}
				});
			}
		});		
	}
]);