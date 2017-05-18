(function() {
	'use strict';

	angular.module('app').factory('XmlConfigService', XmlConfigService);

	XmlConfigService.$inject = [ '$http', 'store'];

	function XmlConfigService($http, store) {

		var service = {
				
				
				getXmlFileName:getXmlFileName,
				setXmlFileName:setXmlFileName,
				getXmlData:getXmlData,
				setXmlData:setXmlData,
				
		};

		return service;

		
		
		function getXmlData(){
			return store.get('currentXml');
		}
		function setXmlData(xml){
			store.set('currentXml', xml);
		}
		function getXmlFileName(){
			return store.get('currentXmlFileName');
		}
		function setXmlFileName(name){
			store.set('currentXmlFileName', name);
		}		
		
		
	}
})();