'use strict';

angular.module('apps', ['core'])
.config(function ($stateProvider) {
	$stateProvider
	.state('appsList', {
		url: '/appsList',
		templateUrl: 'app/apps/list.html',
		controller: 'AppsListCtrl',
		authenticate: true
	})
	.state('apps', {
		url: '/apps',
		templateUrl: 'app/apps/grid.html',
		controller: 'AppsGridCtrl',
		authenticate: true
	})
	// sub-state that opens the form inline above of the table
	.state('apps.addInline', {
		url: '/add',
		templateUrl: 'app/apps/addInline.html',
		controller: 'AppsAddCtrl',
		authenticate: true
	})
	// state that opens the form in a separate view
	.state('appsAdd', {
		url: '/addApps',
		templateUrl: 'app/apps/add.html',
		controller: 'AppsAddCtrl',
		authenticate: true
	});
});
