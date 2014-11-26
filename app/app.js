'use strict';

angular
    .module('angularIceApp', [
        'ngRoute',
        'ui.bootstrap',
        'ice.forms'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/unitTester', {
                templateUrl: 'examples/unitTester.html',
                controller: 'ExamplesCtrl'
            })
            .when('/formDirectives', {
                templateUrl: 'examples/formDirectives.html',
                controller: 'ExamplesCtrl'
            })
            .otherwise({
                redirectTo: '/unitTester'
            });
    });
