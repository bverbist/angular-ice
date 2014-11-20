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

    function ControllerBuilder(controllerName) {
        this.controllerName = controllerName;
        this.injectionLocals = {};
    }

    ControllerBuilder.prototype.withMock = function(key, value) {
        this.injectionLocals[key] = value;
        return this;
    };

    ControllerBuilder.prototype.buildAndReturnItsScope = function() {
        var $controller = injectService('$controller');
        var $rootScope = injectService('$rootScope');

        var $scope = $rootScope.$new();
        this.injectionLocals.$scope = $scope;

        $controller(this.controllerName, this.injectionLocals);

        return $scope;
    };

    function ServiceBuilder(serviceName) {
        this.moduleName = '';
        this.serviceName = serviceName;
        this.provideValues = [];
    }

    ServiceBuilder.prototype.andLoadModule = function(moduleName) {
        this.moduleName = moduleName;
        return this;
    };

    ServiceBuilder.prototype.withMock = function(injectKey, mock) {
        this.provideValues.push({injectKey: injectKey, mock: mock});
        return this;
    };

    ServiceBuilder.prototype.build = function() {
        if (this.moduleName === '') {
            throw 'moduleName not set';
        }

        var _this = this;
        angular.mock.module(this.moduleName, function($provide) {
            if (_this.provideValues.length > 0) {
                _this.provideValues.forEach(function(provideVal) {
                    $provide.value(provideVal.injectKey, provideVal.mock);
                });
            }
        });

        return injectService(this.serviceName);
    };

    var getHttpPromiseMock = function(promiseCallBacker) {
        return function() {
            return {
                success: function(functionOnSuccess) {
                    promiseCallBacker.success = functionOnSuccess;

                    return {
                        error: function(functionOnError) {
                            promiseCallBacker.error = functionOnError;
                        }
                    };
                },
                then: function(functionOnSuccess, functionOnError) {
                    promiseCallBacker.success = functionOnSuccess;
                    promiseCallBacker.error = functionOnError;
                }
            };
        };
    };

    return {
        inject: injectService,
        setupController: function(controllerName) {
            if (typeof controllerName === 'undefined') {
                return undefined;
            }
            return new ControllerBuilder(controllerName);
        },
        setupService: function(serviceName) {
            if (typeof serviceName === 'undefined') {
                return undefined;
            }
            return new ServiceBuilder(serviceName);
        },
        getHttpPromiseMock: getHttpPromiseMock
    };
})();