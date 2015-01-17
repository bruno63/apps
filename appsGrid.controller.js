'use strict';

angular.module('apps')
.controller('AppsGridCtrl', function($scope, $log, $translatePartialLoader, cfg, AppsService) {
	cfg.GENERAL.CURRENT_APP = 'apps';
	$translatePartialLoader.addPart('apps');
	$log.log('AppsGridCtrl/cfg = ' + JSON.stringify(cfg));

	AppsService.getRawApps().then(function(apps) {
		$scope.apps = apps;
		// $log.log($scope.apps);
	});

	$scope.getAppDesc = function(app) {
		var _desc = app.desc[cfg.GENERAL.CURRENT_LANG_ID] === null ?
			app.desc[cfg.GENERAL.DEFAULT_LANG].text : app.desc[cfg.GENERAL.CURRENT_LANG_ID].text;
		// $log.log('AppsGridCtrl.getAppDesc() = ' + _desc);
		return _desc;
	};

	$scope.getAppName = function(app) {
		var _name = app.name[cfg.GENERAL.CURRENT_LANG_ID] === null ?
			app.name[cfg.GENERAL.DEFAULT_LANG].text : app.name[cfg.GENERAL.CURRENT_LANG_ID].text;
		// $log.log('AppsGridCtrl.getAppName() = ' + _name);
		return _name;
	};

});