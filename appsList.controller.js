'use strict';

var appCategories = {
	ACHome: 1,
	Productivity: 2,
	Test: 3,
	System: 4,
	Games: 5,
	Finance: 6
};

angular.module('apps')
.filter('mapCategories', function($log) {
	var appCategoriesReversed = {
		1: 'Home',
		2: 'Productivity',
		3: 'Test',
		4: 'System',
		5: 'Games',
		6: 'Finance'
	};

	return function(input) {
		if (input < 1 || input > appCategoriesReversed.length) {
			$log.log('**** ERROR: apps.mapCategories(' + input + ') -> input is out of bounds');
			return '';
		} else {
			// $log.log('apps.mapCategories(' + input + ') = ' + appCategoriesReversed[input]);
			return appCategoriesReversed[input];
		}
	};
})
.controller('AppsListCtrl', function ($rootScope, $scope, $filter, $http, $log, $translatePartialLoader, $timeout, $interval, uiGridConstants, cfg) {
	cfg.GENERAL.CURRENT_APP = 'apps';
	$translatePartialLoader.addPart('apps');
	$log.log('AppsListCtrl/cfg = ' + JSON.stringify(cfg, null, '\t'));

	$scope.saveRow = function( rowEntity ) {
		var _uri = '/api/apps/' + rowEntity.id;
		$log.log('AppsListCtrl.saveRow(' + rowEntity.toJSON() + ') -> $http.put(' + _uri + ')');
		var promise = $http.put(_uri);
		$scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );
	};

	$scope.gridOptions = {
		minRowsToShow: 20,
		enableSorting: true,
		enableFiltering: true,
		enableHiding: true,
		enableColumnMenus: true,
		enableGridMenu: true,
		// pagingPageSizes: [25, 50, 75],
		// pagingPageSize: 25,
		enableCellEditOnFocus: true,
		enableSelectAll: true,

		columnDefs: [
			{	name: 'id', field: '_id', displayName: 'ID', enableCellEdit: false, visible: false, width: '*' },
			{	name: 'appid', field: 'appid', displayName: 'APPID', visible: true, width: '*',
					sort: { direction: uiGridConstants.ASC } },
			{ 	name: 'logo', field: 'logo', displayName: 'Logo', visible: true, width: '*' }, 
			{ 	name: 'category', field: 'category', displayName: 'Category', visible: true, width: '*',
					cellFilter: 'mapCategories',
					editDropdownFilter: 'translate',
					editableCellTemplate: 'ui-grid/editDropdownEditor',
					editDropdownOptionsArray: [
						{ id: 1, value: 'Home' },
						{ id: 2, value: 'Productivity' },
						{ id: 3, value: 'Test' },
						{ id: 4, value: 'System' },
						{ id: 5, value: 'Games' },
						{ id: 6, value: 'Finance' },
					]
			}
		],
		// Importing Data
		importerDataAddCallback: function (grid, newObjects) {
			$scope.data = $scope.data.concat( newObjects );
		},
		// pdf export
		exporterPdfDefaultStyle: { fontSize: 9},
		exporterPdfTableStyle: { margin: [0, 5, 0, 15]},
		exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red'},
		exporterPdfHeader: { text: 'Application Registry', style: 'headerStyle'},
		exporterPdfFooter: function(currentPage, pageCount) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
		},
		
		exporterPdfCustomFormatter: function(docDefinition) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
		},
		exporterPdfOrientation: 'portrait',
		exporterPdfPageSize: 'A4',
		exporterPdfMaxGridWidth: 500,

		// csv export -> not working, default 'download.csv' is taken
		exporterCsvFilename: 'appreg.csv',
		exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),

		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
			// force grid to resize 
			$timeout(function() {
				gridApi.core.handleWindowResize();
			});
			/*
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				$scope.msg.lastCellEdited = 'edited row id: ' + rowEntity.id + ' Column: ' + colDef.name + ' newValue: ' + newValue + ' oldValue: ' + oldValue;
				$scope.apply();
			});
*/
		}
	};

	var _listUri = '/api/apps';
	$http.get(_listUri)
	.success(function(data, status) {
		for (var i = 0; i < data.length; i++) {
			// convert the category string expressions into indexes in order to work with dropdown list
			data[i].category = appCategories[data[i].category];
		}
		$scope.gridOptions.data = data;
		$log.log('**** SUCCESS: GET(' + _listUri + ') returns with ' + status);
    	// $log.log('data=<' + JSON.stringify(data) + '>');
	})
	.error(function(data, status) {
  		// called asynchronously if an error occurs or server returns response with an error status.
    	$log.log('**** ERROR:  GET(' + _listUri + ') returns with ' + status);
    	// $log.log('data=<' + JSON.stringify(data) + '>');
  	});	


	$scope.addData = function() {
//		var n = $scope.gridOptions.data.length + 1;
		$log.log('appreg.addData is not yet implemented; please add entries manually in appreg.seed on server side');
		/*
		$scope.gridOptions.data.push({
			'datum': new Date().toLocaleDateString(AppConfig.getCurrentLanguageKey()),
			'from': 'myself',
			'to': 'you',
			'ptype': $translate('PTBirthday'),
			'comment': 'bla'
		});
*/
	};

	$scope.removeFirstRow = function() {
//		if ($scope.gridOptions.data.length > 0) {
			$scope.gridOptions.data.splice(0, 1);
//		}
	};

  	$scope.export = function() {
  		if ($scope.exportFormat === 'csv') {
  			var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location'));
  			$scope.gridApi.exporter.csvExport($scope.exportRowType, $scope.exportColumnType, myElement);
  		} else if ($scope.exportFormat === 'pdf') {
  			$scope.gridApi.exporter.pdfExport($scope.exportRowType, $scope.exportColumnType);
  		} else {
  			$log.log('**** ERROR: PresentsListCtrl.export(): unknown exportFormat: ' + $scope.exportFormat);
  		}
  	};

  	$scope.getLang = function() {
  		return cfg.GENERAL.LANGS[cfg.GENERAL.CURRENT_LANG_ID];
  	};
});
