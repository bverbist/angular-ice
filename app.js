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
                controller: 'ExamplesCtrl',
                controllerAs: 'examples'
            })
            .when('/unitTester', {
                templateUrl: 'examples/unitTester.html',
                controller: 'ExamplesCtrl',
                controllerAs: 'examples'
            })
            .when('/formDirectives', {
                templateUrl: 'examples/formDirectives.html',
                controller: 'ExamplesCtrl',
                controllerAs: 'examples'
            })
            .when('/services', {
                templateUrl: 'examples/services.html',
                controller: 'ExamplesCtrl',
                controllerAs: 'examples'
            })
            .when('/releases', {
                templateUrl: 'examples/releases.html',
                controller: 'ExamplesCtrl',
                controllerAs: 'examples'
            })
            .otherwise({
                redirectTo: '/installation'
            });
    });
