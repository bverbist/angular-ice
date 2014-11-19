/*jshint unused:false*/
var iceUnitTester = (function() {
    'use strict';

    var injectService = function(serviceName) {
        var service;
        angular.mock.inject(function($injector) {
            service = $injector.get(serviceName);
        });
        return service;
    };

    function ControllerBuilder(ctrlName) {
        this.ctrlName = ctrlName;
        this.injectionLocals = {};
    }

    ControllerBuilder.prototype.withInjected = function(key, value) {
        this.injectionLocals[key] = value;
        return this;
    };

    ControllerBuilder.prototype.buildAndReturnItsScope = function() {
        var $controller = injectService('$controller');
        var $rootScope = injectService('$rootScope');

        var $scope = $rootScope.$new();
        this.injectionLocals.$scope = $scope;

        $controller(this.ctrlName, this.injectionLocals);

        return $scope;
    };

    return {
        inject: injectService,
        setupController: function(ctrlName) {
            if (typeof ctrlName === 'undefined') {
                return undefined;
            }
            return new ControllerBuilder(ctrlName);
        }
    };
})();