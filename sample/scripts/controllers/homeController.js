angular.module('cloudDemo').controller('homeController', 
	['$scope', 'cloudWrapperService',
	function($scope, cloudWrapperService) {
		/* 
			we inject the cloud wrapper service, then put the cloud API in our scope so the 
			homepage can call cloud.authorize() directly, take a look at home-view.html   
		*/
		$scope.cloud = cloudWrapperService.cloud;

		/*
			you can use jquery-like ready handlers to run code once the API is ready, if the api is ready when
			you call ready() your code will be executed synchronously
		*/
		$scope.cloud.ready(function() {
			console.log("ready home controller");
		});
	}]
);