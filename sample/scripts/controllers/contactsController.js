angular.module('cloudDemo').controller('contactsController', ['$scope', 'cloudWrapperService', '$location',
	function($scope, cloudWrapperService, $location) {		
		//inject the wrapper service and put it in our scope
		$scope.cloud = cloudWrapperService.cloud;
		
		$scope.contacts = [];
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
				$scope.cloud.contacts( 
				{
					success: function(success) {
						//successful response, update our scope so files-view.html will render all of the files
						console.log("successful response", success);

						//we use evalAsync here because API calls inside the cloud API are happening outside of
						//angular's control, so we have to play nice with angular and update data in a digest cycle
						$scope.$evalAsync(function() {
							$scope.contacts = success.body.contactsResponse.account.addrbook.contacts.contact;
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
}]);