'use strict';

angular.module('app')
    .directive('ngModelOnblur', function () {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attr, ngModelCtrl) {
                if (attr.type === 'radio' || attr.type === 'checkbox')
                    return;
                elm.unbind('input').unbind('keydown').unbind('change');
                elm.bind('blur', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                });

            }
        };
    }).directive('json', jsonDirective).controller('phoenixXmlConversionCtrl', phoenixXmlConversionCtrl);

    phoenixXmlConversionCtrl.$inject = ["$scope","$compile", "$timeout", "$templateCache"];
    jsonDirective.$inject = ["$compile", "$templateCache"];

    function jsonDirective($compile, $templateCache){
        var directive = {
            restrict: 'E',
            scope: {
                child: '=',
                type: '@',
                defaultCollapsed: '=',
                operation: '=',
                canEdit:'='
            },
            controller: 'phoenixXmlConversionCtrl',
			controllerAs: 'ctrl',
            link: function (scope, element, attributes) {
                // recursion
                    var stringName = "Attribute";
                    var objectName = "Element";
                    var arrayName = "Array";
                    var numberName = "Number";
                    var valuesName = "Fields";
                    var pattern = /^\d+$/;
                var switchTemplate =
                    '<span ng-switch on="getType(val)" style="margin-left: 15px;">' +
                    '<json ng-switch-when="Object" child="val" type="object" default-collapsed="defaultCollapsed" can-edit="canEdit"></json>' +
                    '<json ng-switch-when="Array" child="val" type="array" default-collapsed="defaultCollapsed" can-edit="canEdit"></json>' +
                    '<span ng-switch-default class="jsonLiteral c-black"><input type="text" ng-disabled="!canEdit" style="background-color:#f3f6fa !important" ng-model="val" ' +
                    'placeholder="Empty" ng-model-onblur ng-blur="focus[key]=false" ng-focus="focus[key]=true" ng-class="{\'c-blue\':focus[key]}" ng-change="child[key] = val;edit[key]=false"/>' +
                    '</span>' +
                    '</span>';

                // display either "plus button" or "key-value inputs"
                var addItemTemplate =
                    '<div ng-switch on="showAddKey" class="block p-t-5" >' +
                    '<span ng-switch-when="true">';
                if (scope.type === "object") {
                    // input key  ng-blur="onKeyBlur(child)"
                    addItemTemplate += '<input placeholder="Name" type="text" ui-keyup="{\'enter\':\'addItem(child)\'}" ' +
                        'class="form-control input-sm addItemKeyInput" ng-model="$parent.keyName"/> ';
                }
                addItemTemplate +=
                    // value type dropdown
                    '<select ng-model="$parent.valueType" ng-options="option for option in valueTypes" ng-show="operation" class="form-control input-sm"' +
                    'ng-init="$parent.valueType=\'' + stringName + '\'" ui-keydown="{\'enter\':\'addItem(child)\'}"></select>'
                    // input value
                    +
                    // ng-blur="onValueBlur(child)"
                    '<span ng-show="$parent.valueType === \'' + stringName + '\' || $parent.valueType === \'' + valuesName + '\'"> : <input type="text" placeholder="Value" ' +
                    'class="form-control input-sm addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> ' +
                    '<span ng-show="$parent.valueType === \'' + numberName + '\'"> : <input type="text" placeholder="Value" ' +
                    'class="form-control input-sm addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> '
                    // Add button
                    +
                    '<button type="button" class="btn btn-primary btn-sm" ng-click="addItem(child)">Add</button> ' +
                    '<button type="button" class="btn btn-default btn-sm" ng-click="$parent.showAddKey=false">Cancel</button>' +
                    '</span>' +
                    '<span ng-switch-default>'
                    // plus button
                    +
                    '<button ng-show="canEdit" type="button" class="addObjectItemBtn" ng-click="$parent.showAddKey = true"><i class="glyphicon glyphicon-plus"></i></button>' +
                    '</span>' +
                    '</div>';

                // start template
                var template = '';
                
                if (scope.type === "object") {

                    template = '<i ng-click="toggleCollapse()" class="glyphicon" ng-class="chevron"></i>' +
                        '<div class="jsonContents" ng-hide="collapsed">'
                        // repeat
                        +
                        '<span class="block b-b-1" ng-repeat="(key, val) in child" ng-init="valid[key] = true;">'
                        // object key
                        +
                        '<span class="jsonObjectKey">'+
                        '<input ng-disabled="!canEdit" class="keyinput" type="text" ng-model="newkey" ng-init="newkey=key" ' +
                        'ng-blur="moveKey(child, key, newkey);edit[key]=false" ng-focus="editKey(key)" style="background-color:#f3f6fa !important" ng-class="{\'c-black\':val.length > 0 && getType(val) !== \'Array\',\'c-red\':!valid[key],\'c-blue\':edit[key]}"/>'
                        // delete button
                        +
                        '<span style="border: 1px solid;" ng-show="val.length > 0 && getType(val) !== \'Array\'"></span>' +

                        '<i ng-show="canEdit" class="deleteKeyBtn glyphicon glyphicon-trash " ng-click="deleteKey(child, key)"></i>' +
                        '<span class="jsonObjectValue">' + switchTemplate + '</span>' +
                        '</span>'
                        // object value
                        +
                        '</span>'
                        // repeat end
                        +
                        addItemTemplate +
                        '</div>';
                } else if (scope.type === "array") {
                    template = '<i ng-click="toggleCollapse()" class="glyphicon"' +
                        'ng-class="chevron"></i>' +
                        '<div class="jsonContents" ng-hide="collapsed">' +
                        '<ol class="arrayOl" ng-model="child">'
                        // repeat
                        +
                        '<li class="arrayItem" ng-repeat="(key, val) in child">' +
                        '<span style="border: 1px solid;" ng-show="val.length > 0"></span>' +
                        '<i ng-show="canEdit" class="deleteKeyBtn glyphicon glyphicon-trash" ng-click="deleteKey(child, $index)"></i>' +
                        '<span class="jsonObjectValue">' + switchTemplate + '</span>' +
                        '</span>'+
                        '</li>' +
                        '</ol>' +
                        addItemTemplate +
                        '</div>';
                } else {
                    console.error("scope.type was " + scope.type);
                }
                $templateCache.put('objectTree', template);
                var newElement = angular.element(template);
                element.replaceWith(
                    $compile($templateCache.get('objectTree'))(scope)
                );
                

            }
        };
        return directive;
    }

    function phoenixXmlConversionCtrl($scope, $compile, $timeout, $templateCache){
                var stringName = "Attribute";
                var objectName = "Element";
                var arrayName = "Array";
                var numberName = "Number";
                var valuesName = "Fields";
                var pattern = /^\d+$/;
                $scope.valid = {};

                $scope.valueTypes = [stringName, valuesName, objectName, arrayName];
                $scope.sortableOptions = {
                    axis: 'y'
                };
                if ($scope.$parent.defaultCollapsed === undefined) {
                    $scope.collapsed = false;
                } else {
                    $scope.collapsed = $scope.defaultCollapsed;
                }
                if ($scope.collapsed) {
                    $scope.chevron = "glyphicon-chevron-right";
                } else {
                    $scope.chevron = "glyphicon-chevron-down";
                }

                var getType = function (obj) {
                    var type = Object.prototype.toString.call(obj);
                    if (type === "[object Object]") {
                        return "Object";
                    } else if (type === "[object Array]") {
                        return "Array";
                    } else if (type === "[object Boolean]") {
                        return "Boolean";
                    } else if (type === "[object Number]") {
                        return "Number";
                    } else {
                        return "Literal";
                    }
                };
                var isNumber = function (n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                };
                $scope.getType = function (obj) {
                    return getType(obj);
                };
                $scope.toggleCollapse = function () {
                    if ($scope.collapsed) {
                        $scope.collapsed = false;
                        $scope.chevron = "glyphicon-chevron-down";
                    } else {
                        $scope.collapsed = true;
                        $scope.chevron = "glyphicon-chevron-right";
                    }
                };
                $scope.moveKey = function (obj, key, newkey) {
                    if (key !== newkey) {
                        if (pattern.test(newkey)) {
                            logger.error("The name cannot be a complete numeric value");
                            $scope.valid[key] = false;
                            return;
                        } else {
                            if (newkey.charAt(0) !== '_' && typeof obj[key] !== "object") {
                                newkey = "_" + newkey;
                                trimUnderscore();
                            }
                            if(key !== '__text'){
                                $scope.valid[newkey] = true;
                                obj[newkey] = obj[key];
                                delete obj[key];
                            }
                        }
                    }
                };
                $scope.deleteKey = function (obj, key) {
                    if (getType(obj) === "Object") {
                        delete obj[key];
                    } else if (getType(obj) === "Array") {
                        obj.splice(key, 1);
                    } else {
                        console.error("object to delete from was " + obj);
                    }
                };
                $scope.addItem = function (obj) {
                	 
                    if (getType(obj) === "Object") {
                        // check input for key
                        if ($scope.keyName === undefined || $scope.keyName.length === 0) {
                            logger.error("Please fill in a name");
                        } else if ($scope.valueName === undefined || $scope.valueName.length === 0) {
                            logger.error("Please fill in a value");
                        } else if ($scope.keyName.indexOf("$") === 0) {
                            logger.error("The name may not start with $ (the dollar sign)");
                        } else if (pattern.test($scope.keyName)) {
                            logger.error("The name cannot be a complete numeric value");
                        } else {
                            if ($scope.valueType === stringName && $scope.keyName.charAt(0) !== '_') {
                                $scope.keyName = "_" + $scope.keyName;
                            }
                            if (obj[$scope.keyName]) {
                            	$scope.keyName  = $scope.keyName.substr(1);
                                logger.error('An item with the name "' + $scope.keyName +
                                    '" exists already.');
                                trimUnderscore();
                                return;
                            }
                            // add item to object
                            switch ($scope.valueType) {
                                case stringName:
                                    obj[$scope.keyName] = $scope.valueName ? $scope.valueName : "";
                                    break;
                                case objectName:
                                    obj[$scope.keyName] = {};
                                    break;
                                case valuesName:
                                    obj[$scope.keyName] = $scope.valueName ? $scope.valueName : "";
                                    break;
                                case arrayName:
                                    obj[$scope.keyName] = [];
                                    break;
                                default:
                                    break;
                            }
                            //clean-up
                            trimUnderscore();
                            $scope.keyName = "";
                            $scope.valueName = "";
                            $scope.showAddKey = false;
                        }
                    } else if (getType(obj) === "array") {
                        // add item to array
                        switch ($scope.valueType) {
                            case stringName:
                                obj.push($scope.valueName ? $scope.valueName : "");
                                break;
                            case numberName:
                                obj.push($scope.possibleNumber($scope.valueName));
                                break;
                            case objectName:
                                obj.push({});
                                break;
                            case arrayName:
                                obj.push([]);
                                break;
                             default:
                            	 break;
                        }
                        $scope.valueName = "";
                        $scope.showAddKey = false;
                    } else {
                        console.error("object to add to was " + obj);
                    }
                };
                $scope.possibleNumber = function (val) {
                    return isNumber(val) ? parseFloat(val) : val;
                };
                $scope.editKey = function(key){
                    $scope.edit = {};
                    $scope.edit[key] = true;
                };

                $scope.onKeyBlur =  function(obj){
                     if (angular.isDefined( $scope.valueName) && $scope.valueName !== "") {
                            $scope.addItem(obj);
                        }
                };

                $scope.onValueBlur = function(obj){
                    if (angular.isDefined( $scope.keyName) && $scope.keyName !== "") {
                            $scope.addItem(obj);
                        }
                };

                $timeout(function () {
                    var _cdown = $('.glyphicon-chevron-down')[0];
                    $(_cdown).addClass('hide');
                    var _cdel = $('.deleteKeyBtn')[0];
                    $(_cdel).addClass('hide');
                    var len = $('.glyphicon-plus').length;
                    var _gplus = $('.glyphicon-plus')[len - 1];
                    $(_gplus).addClass('hide');
                    var _sp = $('.glyphicon-plus.hide');
                    $(_sp).parents('.block').addClass('hide');
                    var _bb1 = $('.block')[0];
                    $(_bb1).removeClass('b-b-1');
                    trimUnderscore();
                });

                function trimUnderscore(){
                    $timeout(function () {
                        var keyinputs = document.getElementsByClassName("keyinput");
                        for(var i = 0; i < keyinputs.length; i++)
                        {
                            var _vZero = $(keyinputs[i])[0];
                            var _value = $(_vZero).val();
                            if(_value.charAt(0) === '_'){
                                $(_vZero).val(_value.substr(1));
                            }
                        }
                        // Hiding Spinner when all XML json data bind to dom correctly
                        
                    },1);

                }
    }