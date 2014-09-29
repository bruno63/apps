'use strict';

angular.module('apps')
.controller('AppsGridCtrl', function($scope, $log, $translatePartialLoader, cfg, AppConfig, AppsService) {
	AppConfig.setCurrentApp('Apps', 'fa-cubes', 'apps', 'app/apps/menu.html');
	$translatePartialLoader.addPart('apps');

	AppsService.getRawApps().then(function(apps) {
		$scope.apps = apps;
		// $log.log($scope.apps);
	});

	$scope.getAppDesc = function(app) {
		var _desc = app.desc[AppConfig.getCurrentLang()] == null ?
			app.desc[cfg.DEFAULT_LANG].text : app.desc[AppConfig.getCurrentLang()].text;
		$log.log('AppsGridCtrl.getAppDesc() = ' + _desc);
		return _desc;
	};

	$scope.getAppName = function(app) {
		var _name = app.name[AppConfig.getCurrentLang()] == null ?
			app.name[cfg.DEFAULT_LANG].text : app.name[AppConfig.getCurrentLang()].text;
		$log.log('AppsGridCtrl.getAppName() = ' + _name);
		return _name;
	};


});