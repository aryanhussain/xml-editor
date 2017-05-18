(function() {
	'use strict';

	angular.module('app').controller('selectionController',
			selectionController);

	selectionController.$inject = [ '$scope', '$state',
		'$uibModal', '$interval', 'XmlConfigService',
		 '$timeout'];

	function selectionController($scope, $state,
			$uibModal, $interval,XmlConfigService,
			$timeout) {


		$scope.columnDefs = [];
		$scope.gridOptions;
		$scope.deviceOrGroupSelected;
		$scope.message;
		$scope.$on("$destroy", function() {
		});

		$scope.createNew = function() {
			XmlConfigService.setXmlFileName("");
			XmlConfigService.setXmlData("");
			$state.go('xmlEditor');
		};
		
		$scope.uploadNew = function() {
			$scope.isEditMode=false;
			$uibModal.open({
				templateUrl : 'app/xmlConfig/modalUploadXml.html',
				controller : 'ModalUploadXmlController',
				windowClass: 'delete-modal-main bigText'
			});
		};

	}
})();
