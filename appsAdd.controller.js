'use strict';

angular.module('apps')
.controller('AppsAddCtrl', function ($scope, $log, $location, $translatePartialLoader, AppsService, AppConfig) {
	AppConfig.setCurrentApp('Apps', 'fa-cubes', 'apps', 'app/apps/menu.html');
	$translatePartialLoader.addPart('apps');

	$scope.save = function (isValid) {
		$log.log('entering AppsAddCtrl:save(' + isValid + ')');
		$log.log('new app:');
		$log.log('name    : <' + this.formData.name + '>');
		$log.log('appid   : <' + this.formData.appid + '>');
		$log.log('logo    : <' + this.formData.logo + '>');
		$log.log('category: <' + this.formData.category + '>');
		if (isValid) {
			AppsService.all('apps').post(this.formData).then(function () {
				$location.path('/apps');
			});
		}
		else {
			$scope.submitted = true;
		}
	};
});