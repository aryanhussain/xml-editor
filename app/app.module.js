(function() {
	'use strict';
	 angular.module('app', [ 'ui.bootstrap', 'ui.router', 'angular-storage',
			'ngAnimate', 'ngFileUpload' , 'angularSpinners'])

	.config(mainConfig);
	mainConfig.$inject = [ '$stateProvider', '$urlRouterProvider',
			'$httpProvider' ]

	function mainConfig($stateProvider, $urlRouterProvider, $httpProvider) {
		/*- Author : Kusum  If user logged on hit any url then it should not redirect to login page */
		$urlRouterProvider.otherwise('/xmlSelection');
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}

})();