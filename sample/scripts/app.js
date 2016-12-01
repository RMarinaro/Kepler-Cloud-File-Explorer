angular.module('cloudDemo', ['ngRoute', 'ngFileUpload', 'ui.bootstrap'])
.config(function($routeProvider){
	$routeProvider
	.when('/files',{
		templateUrl: 'views/files-view.html'
	})
    .when('/explorer',{
        templateUrl: 'views/file-explorer-view.html'
    })
    .when('/contacts',{
        templateUrl: 'views/contacts-view.html'      
    })
    .when('/playlists',{
        templateUrl: 'views/playlists-view.html'      
    })
    .when('/playlists/:uid', {
        templateUrl: 'views/playlist-detail-view.html'
    })
    .when('/trash',{
        templateUrl: 'views/trash-view.html'      
    })    
    .when('/shares',{
        templateUrl: 'views/shares-view.html'      
    })        
	.when('/',{
		templateUrl: 'views/home-view.html'
	});
})
