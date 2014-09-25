'use strict';

angular.module('apps')
.controller('AppsGridCtrl', function($scope, $log, AppConfig, AppsRestService) {
	AppConfig.setCurrentApp('Apps', 'fa-cubes', 'apps', 'app/apps/menu.html');
	AppsRestService.all('apps').getList().then(function(apps) {
		$scope.apps = apps;
		// $log.log($scope.apps);
	});
});