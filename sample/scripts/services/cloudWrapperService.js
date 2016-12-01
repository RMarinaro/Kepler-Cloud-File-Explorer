angular.module("cloudDemo").service('cloudWrapperService', ["$rootScope", "$location", function($rootScope, $location) {
	var service = this;
	service.cloud = thingspace.cloud;
		
	//check your thingspace account for your clientKey, clientSecret, and callbackUrl configuration	
	service.cloud.init({
		clientKey : "fqfIw3Q70bmp1r_WJFO59ewuf1Ma",
		clientSecret : "1Je54Z1X1M7hJJeQIVQB2VkMeJ8a",
		callbackUrl : "https://rmarinaro.github.io/Kepler-Cloud-File-Explorer/sample/index.html", 
		
		//by default the SDK will escape all responses for you, since angular already does this we are going to disable it
		htmlEscape : false, 

		//you can pass an authToken and refreshToken to bypass calling the authorize function, callbacks will get fired as usual
		//authToken : "your cached access token here",
		//refreshToken : "your cached refresh token",

		//authToken: "IXUWTIEWVENARN5IY2LDHGE5TIXUWDLMAMRVKFGFAVTDZU6LUZARJIZUXBBK5YK34YG6WCFPTEP5RYJLSEMC5UBLAYTF7MHYSHA2V6S5XHMMCLRQRPU2B4TPJRRJ35WESAXBXSMDQCEM75WFI36E2CNE33TJF7KOYDO63GNITCPSJB4CDU4P7NOKXWT5PC4WK2BF7I5CRUUNABOJSPEZ3L5EOBFBZVYL3N4OOLABQQMLUDVSD3LX6TFDR43ILMVKDHPY3JZGWZOBYEQYG5OMXE7ILQVJZYWBPGTMUNK3FXAZZJ72F35XENVH2SI7RXNWGMUCUQCQNT2TZPIUQGINB74MCCKEKUDEKHWSVYZOYT5N4Z2VLW25RM5ISG5PH3BS",

		// callback for when the SDK can begin making calls 
		postInitialize : function(initted) {
			/* cant use $rootScope.$apply because if authorization happens locally it can return immediately during a digest cycle
			   calling $scope.apply inside a digest cycle makes angular crash calling so $evalAsync pushes the event onto 
			   current cycle if a digest is happening, otherwise it will push it onto the next digest cycle */
			$rootScope.$evalAsync(function() {
				service.cloud = thingspace.cloud;
			});
		},
		
		// callback for when a user has attempted to complete the authorization flow
		postAuthenticated: function(success, errorCode) {
			if(success){
				$rootScope.$evalAsync(function() {
					service.cloud = thingspace.cloud;
					$location.path("/files");
				});			
			} else{
				//we are going to let the clients of the cloud api just check for getAuthError
				//so we arent going to do anything here
				$rootScope.$evalAsync(function() {
					service.cloud = thingspace.cloud;
				});
			}
		},
		
		//callback for when an auth token expires or gets revoked
		onAuthInvalidated: function() {
			$rootScope.$evalAsync(function() {
				console.log("token went bad, redirecting to login screen");
				$location.path("/");
			});
		}
	});
}]);
