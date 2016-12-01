angular.module('cloudDemo').controller('metadataController', ['$scope', 'cloudWrapperService', '$location', '$timeout', '$http', 'Upload',
	function($scope, cloudWrapperService, $location, $timeout, $http, Upload) {		
		$scope.cloud = cloudWrapperService.cloud;
		$scope.cloud.ready(function() {
			if(!$scope.cloud.isAuthenticated()) {	
				$location.path("/");
			} 
		});

		$scope.folders = [];
		//$scope.folders.push(rootFolderHack);

		$scope.loading = false;
		$scope.files = [];
		$scope.path = "/";
		$scope.filePaths = []

		$scope.cd = function(path) {
			if($scope.loading) {
				return;
			}
			$scope.loading = true;
			$scope.path = path;

			$scope.cloud.ready(function() {
				$scope.loading = true;
				$scope.folders.length = 0;
				$scope.files.length = 0;
				$scope.cloud.metadata( {
					path: $scope.path,
					success: function(success) {
						console.log("success", success);
						$scope.$evalAsync(function() {
							$scope.loading = false;
							$scope.fullview = success.body;
							if(success.body.folder.file) {
								$scope.files = success.body.folder.file;
							} else {
								$scope.files.length = 0;
							}
							if(success.body.folder.folder) {
								$scope.folders = success.body.folder.folder;
							} else {
								$scope.folders.length = 0;
							}

							$scope.loading = false;
						})
					},
					failure: function(failure) {
						console.log("failure", failure);
						$scope.$evalAsync(function() {
							$scope.loading = false;
						});
					}
				});
			});
		}

		//watch the path and calculate the exploded paths for easy navigation
		$scope.$watch("path", function() {
			console.log("something found");
			//little bit of vodoo that returns every part of the path other than "/"
			var partsofPath = [];
			var slashIndex = $scope.path.indexOf("/");

			while(slashIndex != -1) {

				var nextSlashIndex = $scope.path.indexOf("/", slashIndex + 1);
				partsofPath.push($scope.path.substring(0,slashIndex+ 1));
				slashIndex = nextSlashIndex;
				
			}

			console.log("partsOfPath", partsofPath);
			$scope.filePaths = partsofPath;
		});

		$scope.pathToFolderString = function(path) {
			if(path == "/") {
				return "/";
			}

			var pathWithoutTrailingSlash = path.substring(0, path.length - 1);
			return pathWithoutTrailingSlash.substring(pathWithoutTrailingSlash.lastIndexOf("/") + 1);
		}




		$scope.cd("/");

	}]);