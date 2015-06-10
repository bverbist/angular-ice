'use strict';

angular
    .module('angularIceApp', [
        'ngRoute',
        'ui.bootstrap',
        'ice.forms',
        'ice.bank'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/installation', {
                templateUrl: 'examples/installation.html',
                controller: 'ExamplesCtrl'
            })
            .when('/unitTester', {
                templateUrl: 'examples/unitTester.html',
                controller: 'ExamplesCtrl'
            })
            .when('/formDirectives', {
                templateUrl: 'examples/formDirectives.html',
                controller: 'ExamplesCtrl'
            })
            .when('/services', {
                templateUrl: 'examples/services.html',
                controller: 'ExamplesCtrl'
            })
            .when('/releases', {
                templateUrl: 'examples/releases.html',
                controller: 'ExamplesCtrl'
            })
            .otherwise({
                redirectTo: '/installation'
            });
    });
