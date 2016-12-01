angular.module('cloudDemo').controller('playlistDetailController', ['$scope', 'cloudWrapperService', '$location', "$routeParams",
	function($scope, cloudWrapperService, $location, $routeParams) {		
		//inject the wrapper service and put it in our scope
		$scope.cloud = cloudWrapperService.cloud;
		
		$scope.params = $routeParams;
		console.log("route params:", $scope.params);
		$scope.playlistInfo = {};
		$scope.playlist = {};
		$scope.loading = false;

		$scope.cloud.ready(function() {
			//api is ready, but we might not be authenticated
			if(!$scope.cloud.isAuthenticated()) {
				console.log("not logged in, rerouting");
				//send the user to the login page
				$location.path("/");
			} else {
				//logged in, lets call playlists
				$scope.loading = true;			
				$scope.cloud.playlist( 
				{
					uid: $scope.params.uid,
					success: function(success) {
						//successful response, update our scope so files-view.html will render all of the files
						console.log("successful response", success);

						//we use evalAsync here because API calls inside the cloud API are happening outside of
						//angular's control, so we have to play nice with angular and update data in a digest cycle
						$scope.$evalAsync(function() {
							$scope.playlistInfo = success.body.playlistDefinition;
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

				$scope.cloud.playlistItems( 
				{
					uid: $scope.params.uid,
					success: function(success) {
						//successful response, update our scope so files-view.html will render all of the files
						console.log("successful response", success);

						//we use evalAsync here because API calls inside the cloud API are happening outside of
						//angular's control, so we have to play nice with angular and update data in a digest cycle
						$scope.$evalAsync(function() {
							$scope.playlist = success.body.playlist;
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

		$scope.getPlaylistContentWrapper = function(itemid) {
			console.log("itemid", itemid);
			$scope.cloud.getPlaylistContent($scope.params.uid, itemid);			
		}


}]);