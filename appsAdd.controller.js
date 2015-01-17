'use strict';

angular.module('apps')
.controller('AppsAddCtrl', function ($scope, $log, $location, $translatePartialLoader, AppsService, cfg) {
	cfg.GENERAL.CURRENT_APP = 'apps';
	$translatePartialLoader.addPart('apps');
	$log.log('AppsAddCtrl/cfg = ' + JSON.stringify(cfg, null, '\t'));

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