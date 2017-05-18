(function() {
	'use strict';
	
    angular.module('app').config(xmlExternalConfig);

    xmlExternalConfig.$inject = [ '$stateProvider'];

	function xmlExternalConfig($stateProvider) {
		$stateProvider.state('xmlSelection', {
			url : '/xmlSelection',
			views : {
				'content@' : {
					templateUrl : 'app/xmlConfig/selection.html',
					controller : 'selectionController'
				}
			},		
			data: {
				pageHeading : 'Xml Config',
				pageSubHeading : ''
			}
		}).state('xmlEditor', {
			url : '/xmlEditor',
			views : {
				'content@' : {
					templateUrl : 'app/xmlConfig/XmlEditor.html',
					controller : 'XmlEditorController'
				}
			},		
			data: {
				pageHeading : 'Xml Editor',
				pageSubHeading : ''
			}

		});
	}

})();