(function() {
	'use strict';

	angular.module('app').controller('ModalUploadXmlController',
			ModalUploadXmlController);

	ModalUploadXmlController.$inject = [ '$scope', '$uibModalInstance', '$uibModal', '$q', 'Upload', 'XmlConfigService', '$state'];
			
	function ModalUploadXmlController($scope, $uibModalInstance,$uibModal, $q, Upload, XmlConfigService, $state) {
		$scope.uploadXmlFiles = function(files, errFiles) {
			$scope.removeErrors();
			$scope.files = files;
			$scope.errFiles = errFiles;
			$scope.existingFiles = [];			
			var fileChainTrigger = $q.defer();
			$scope.isEditMode=false;
			var fileChain = fileChainTrigger.promise;
			angular.forEach(files, function(file) {
				fileChain = fileChain.then(function(){
					var f = file, uploadedData, r = new FileReader();
					r.onloadend = function(e){
						uploadedData = e.target.result;
						XmlConfigService.setXmlFileName(file.name);
						XmlConfigService.setXmlData(uploadedData);
						$state.go('xmlEditor');
						$scope.cancel();
              		};
					r.readAsBinaryString(f);
				})
			});
			fileChainTrigger.resolve();		
		};
		$scope.removeErrors = function(){
			$scope.existingFiles = [];
			$scope.files = '';
			$scope.errFiles = "";
		};   	
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}
	
})();
