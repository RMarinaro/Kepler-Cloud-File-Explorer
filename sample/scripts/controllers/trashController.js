angular.module('cloudDemo').controller('trashController', ['$scope', 'cloudWrapperService', '$location', '$uibModal',
	function($scope, cloudWrapperService, $location, $uibModal) {		
		//inject the wrapper service and put it in our scope
		$scope.cloud = cloudWrapperService.cloud;
		
		$scope.files = [];
		$scope.folders = [];
		$scope.loading = false;


		$scope.getTrash = function() {
			$scope.cloud.ready(function() {
				//api is ready, but we might not be authenticated
				if(!$scope.cloud.isAuthenticated()) {
					console.log("not logged in, rerouting");
					//send the user to the login page
					$location.path("/");
				} else {
					//logged in, lets call contacts
					$scope.loading = true;			
					$scope.cloud.getTrash( 
					{
						virtualfolder: "VZMOBILE",
						success: function(success) {
							console.log("success", success);
							//we use evalAsync here because API calls inside the cloud API are happening outside of
							//angular's control, so we have to play nice with angular and update data in a digest cycle
							$scope.$evalAsync(function() {
								$scope.files = success.body.trashCan.file;
								$scope.folders = success.body.trashCan.folder;
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

		$scope.getTrash();

		//empty trash handler
		$scope.emptyTrash = function() {
			var modalInstance = $uibModal.open({
		      templateUrl: 'partials/modals/empty-trash-modal-partial.html',
		      scope: $scope,
		      controller: 'emptyTrashController'
		    });

 			modalInstance.result.then(function () {
      			$scope.cloud.emptyTrash({
      				virtualfolder: "VZMOBILE",
      				success: function(success) {
						console.log("success", success);
						$scope.getTrash(); //refresh the trash

      				}, 
      				failure: function(failure) {
      					console.log("failure", failure);
      				}
      			})

    		}, function () {
      			//dont need to do anything, the user dismissed the modal
    		});				    
		}


		//restore click handler for files and folders
		$scope.restore = function(file) {
			var path = file.parentPath + '/' + file.name;
			console.log("path", path);
		    var modalInstance = $uibModal.open({
		      templateUrl: 'partials/modals/restore-modal-partial.html',
		      scope: $scope,
		      controller: 'restoreFileController',
		      resolve: {
		        file: function() {
		        	return file;
		        }
		      }
		    });

 			modalInstance.result.then(function (file) {
      			console.log("file", file);

      			$scope.cloud.restore({
      				path: path,
      				success: function(success) {
						console.log("success", success);
						$scope.getTrash(); //refresh the trash

      				}, 
      				failure: function(failure) {
      					console.log("failure", failure);
      				}
      			})

    		}, function () {
      			//dont need to do anything, the user dismissed the modal
    		});		    
		}

}]);