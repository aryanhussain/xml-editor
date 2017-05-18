(function () {
    'use strict';

    angular.module('app')
        .controller('XmlEditorController', XmlEditorController);

    XmlEditorController.$inject = ['$scope', 'XmlConfigService',
        '$filter', '$timeout', '$state'
    ];

    function XmlEditorController($scope, XmlConfigService, $filter, $timeout, $state) {
        var x2js = new X2JS({
        	// XML attributes. Default is "_"
        	attributePrefix : "",
            enableToStringFunc: false
        });
        // Showing Spinner on Page loads whenever user create or upload a new XML

        function init() {
            var xmlString = XmlConfigService.getXmlData();
            if(xmlString){
            	xmlString = xmlString.substring(xmlString.indexOf("<"));
            }
            $scope.newFileName = XmlConfigService.getXmlFileName();
            filenameValidator($scope.newFileName);
            $scope.xmlToJsonText = x2js.xml_str2json(xmlString);
            if ($scope.xmlToJsonText === null) {
                $scope.xmlToJsonText = {
                    "masterNode": {}
                };
            }
            else{
            	var rootTagName = Object.keys($scope.xmlToJsonText)[0];
                if(angular.isString($scope.xmlToJsonText[rootTagName])){
                     $scope.xmlToJsonText[rootTagName] = {};
                }
            }
        }

        $timeout(function () {
            init();
        });

        var xmlDataWatcher = $scope.$watch('xmlToJsonText', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                newValue = angular.copy(newValue);
                $scope.xmlString = x2js.json2xml( newValue);
                if($scope.xmlString !== null){
                    $scope.xmlString = new XMLSerializer().serializeToString($scope.xmlString);
                }
            }
        },true);

        $scope.resetEditor = function () {
            $state.go($state.current, {}, {reload: true});
        };

        function filenameValidator(filename){
         $scope.newFileModal=filename.substr(0, filename.lastIndexOf(".")) + ".xml";
        }

        // Cancelling Watch when state destroyed
        $scope.$on('$destroy', function(){
			xmlDataWatcher();
		});

        $scope.saveXml = function() {
			if ($(".c-red").length > 0) {
				logger.error("Not a valid Xml");
			} else {
				var file = new Blob([ $scope.xmlString ], {
					type : "text/xml;charset=utf-8"
				});
				
			}
            var hiddenElement = document.createElement('a');
				hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent($scope.xmlString);
				hiddenElement.target = '_blank';
				hiddenElement.download = "download.xml";
				document.body.appendChild(hiddenElement);
				hiddenElement.click(); 	
		};
    }
})();
