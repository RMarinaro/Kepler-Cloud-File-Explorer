angular.module('cloudDemo').directive('uploader', ['$location', 'cloudWrapperService', 'Upload',
	function($location, cloudWrapperService, Upload) {
	return {
		restrict: 'E',
		templateUrl: 'partials/uploader-partial.html', 
		link: function($scope, element, attrs) {
			$scope.cloud = cloudWrapperService.cloud;
			$scope.progressPercentage = 0;
			$scope.isUploading = false;

			$scope.uploadFile = function(file){
		        console.log(file);
		        $scope.progressPercentage = 0;
		       	$scope.isUploading = true;
		        $scope.calculateSHA256(file, function(sha256) {
		        	console.log("sha256 from helper", sha256);
		        	var size = file.size;
		        	if(size < 104857600) { //100 mb
		        		console.log("doing UNCHUNKED upload for file of size:", file.size);
		        		doUploadUnchunked(file, sha256);
		        	} else{ 
		        		console.log("doing CHUNKED upload for file of size:", file.size);
		        		doUploadChunked(file, sha256);
		        	}
		        });
		    };

		    function doUploadChunked(file, sha256) {
				$scope.cloud.fileuploadIntent({
	        		checksum: sha256, 
	        		chunk: true,
	        		name: file.name,
	        		path: '/VZMOBILE',
	        		size: file.size,
	        		success: function(success) {
	        			console.log(success);
	        			var uploadUrl = success.body.uploadurls.uploadurl;
	        			var commiturl = success.body.uploadurls.commiturl;
	        			var chunksUploaded = 0;
	        			var totalChunksToUpload = 1;

	        			processFile(file, function(buffer, currentChunk, totalCunks, doneCallback) {
	        				chunksUploaded = currentChunk;
	        				totalChunksToUpload = totalCunks;
	        				Upload.http({
						    	url: uploadUrl + "&checksum=" + encodeURIComponent(sha256) + "&offset=" + currentChunk,
							    data: buffer, 
							    headers: {
							    	'Authorization': 'Bearer ' + $scope.cloud.getAuth().authToken,
							    	'Content-Type': 'application/octet-stream' 
							    }
							}).then(function (resp) {
							    doneCallback();
							}, function (resp) {
							    console.log('Error status: ' + resp.status);
							    doneCallback();
							}, function (evt) {
								if(evt.loaded != 0) {
									$scope.progressPercentage = 100 * (((evt.loaded / evt.total)  + chunksUploaded - 1) / totalChunksToUpload);

								}
							});
	        			}, function() {
						    $scope.cloud.commitChunkedUpload({
						    	commiturl: commiturl,
						    	success: function(success) {
								    console.log('Success ' + 'uploaded. Response: ', success.body);
								    uploadFinished(true);
						    	}, 
        						failure: function(failure) {
        							console.log('failed ' + 'uploaded. Response: ', failure.body);
					    			uploadFinished(false);
        						}
						    });
	        			});
	        		},
	        		failure: function(failure) {
	        			console.log("start upload fail", failure);
	        		}
	        	});	        		
		    } 


		    function doUploadUnchunked(file, sha256) {
		    	$scope.cloud.fileuploadIntent({
	        		checksum: sha256, 
	        		chunk: false,
	        		name: file.name,
	        		path: '/VZMOBILE',
	        		size: file.size,
	        		success: function(success) {
	        			console.log("start upload success", success);
	        			var uploadUrl = success.body.uploadurls.uploadurl;
				    	console.log('uploadUrl', uploadUrl);
				    	console.log("file", file);
						Upload.http({
						    url: uploadUrl + "&checksum=" + encodeURIComponent(sha256),
						    data: file, 
						    headers: {
						    	'Authorization': 'Bearer ' + $scope.cloud.getAuth().authToken,
						    	'Content-Type': 'application/octet-stream' 
						    },
						}).then(function (resp) {
						    console.log('Success uploaded. Response: ', resp.data);
						    uploadFinished(true);
						}, function (resp) {
						    console.log('Error status: ' + resp.status);
						    uploadFinished(false);
						}, function (evt) {
						    $scope.progressPercentage = 100.0 * evt.loaded / evt.total;
						});
	        		}, 
	        		failure: function(failure) {
	        			console.log("start upload fail", failure);
	        		}
	        	});
		    }


		    function uploadFinished(success) {
		    	//might not happen on the digest cycle, so we use this method to make sure it does
		    	$scope.$evalAsync(function() {
		    		$scope.isUploading = false;
			    	if(success){
			    		var message = "Upload complete";
			    	} else {
			    		var message = "Upload failed";
			    	}
					$.snackbar({content: message, style: "centered-snackbar"});
					angular.element("#fileUploaderInput").val(null);
					angular.element("#fileUploaderText").val(null);
		    	});
		    }


		    $scope.calculateSHA256 = function(file, callback) {
		    	var fileReader = new FileReader();
		    	fileReader.onload = function (e) {
			    	var sha = sha256(e.target.result);
			    	console.log("sha256", sha);
			    	callback(sha);
		    	 }
		    	fileReader.readAsArrayBuffer(file);
		    };


		    function processFile(file, logicCallback, doneCallback) {
				var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
				  	chunkSize = 2097152,                             // Read in chunks of 2MB
				    chunks = Math.ceil(file.size / chunkSize),
				    currentChunk = 0,
				    fileReader = new FileReader();

				fileReader.onload = function (e) {
				    console.log('read chunk nr', currentChunk + 1, 'of', chunks);
				    currentChunk++;
				 	logicCallback(e.target.result, currentChunk, chunks, function() {
					    if (currentChunk < chunks) {
					        loadNext();
					    } else {
					        console.log('finished loading all chunks');
					        doneCallback();
					    }			 		
				 	});
				};

			    fileReader.onerror = function () {
			        console.warn('oops, something went wrong.');
			    };

			    function loadNext() {
			        var start = currentChunk * chunkSize,
			            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

			        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
			    }

				loadNext();
			}
		}
	}
}]);