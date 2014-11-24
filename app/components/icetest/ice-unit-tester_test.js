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

    var getPromiseMock = function(promiseCallBacker) {
        return function() {
            return {
                then: function(successCallback, errorCallback, notifyCallback) {
                    promiseCallBacker.success = successCallback;
                    promiseCallBacker.error = errorCallback;
                    promiseCallBacker.notify = notifyCallback;
                },
                catch: function(errorCallback) {
                    promiseCallBacker.success = null;
                    promiseCallBacker.error = errorCallback;
                }
            };
        };
    };

    var getHttpPromiseMock = function(promiseCallBacker) {
        var _this = this;
        return function() {
            var promiseMock = _this.getPromiseMock(promiseCallBacker)();

            promiseMock.success = function(successCallback) {
                promiseCallBacker.success = successCallback;

                return {
                    error: function(errorCallback) {
                        promiseCallBacker.error = errorCallback;
                    }
                };
            };

            return promiseMock;
        };
    };

    function ControllerBuilder(moduleName, controllerName) {
        this.moduleName = moduleName;
        this.controllerName = controllerName;
        this.injectionLocals = {};
    }

    ControllerBuilder.prototype.withMock = function(injectKey, mock) {
        this.injectionLocals[injectKey] = mock;
        return this;
    };

    ControllerBuilder.prototype.loadAndReturnScope = function() {
        angular.mock.module(this.moduleName);

        var $controller = injectService('$controller');
        var $rootScope = injectService('$rootScope');

        var $scope = $rootScope.$new();
        this.injectionLocals.$scope = $scope;

        $controller(this.controllerName, this.injectionLocals);

        return $scope;
    };

    function ServiceBuilder(moduleName, serviceName) {
        this.moduleName = moduleName;
        this.serviceName = serviceName;
        this.provideValues = [];
    }

    ServiceBuilder.prototype.withMock = function(injectKey, mock) {
        this.provideValues.push({injectKey: injectKey, mock: mock});
        return this;
    };

    ServiceBuilder.prototype.load = function() {
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

    function DirectiveBuilder(moduleName, elementHtml) {
        this.moduleName = moduleName;
        this.elementHtml = elementHtml;
        this.scopeFields = [];
    }

    DirectiveBuilder.prototype.withScopeField = function(fieldName, fieldValue) {
        this.scopeFields.push({name: fieldName, value: fieldValue});
        return this;
    };

    DirectiveBuilder.prototype.load = function() {
        angular.mock.module(this.moduleName);

        var $compile = injectService('$compile');
        var $rootScope = injectService('$rootScope');

        var $scope = $rootScope.$new();
        if (this.scopeFields.length > 0) {
            this.scopeFields.forEach(function(scopeField) {
                $scope[scopeField.name] = scopeField.value;
            });
        }

        var element = $compile(this.elementHtml)($scope);
        $scope.$digest();

        return {
            $scope: $scope,
            element: element
        };
    };

    function UnitTestBuilder(moduleName) {
        this.moduleName = moduleName;
    }

    UnitTestBuilder.prototype.testController = function(controllerName) {
        if (typeof controllerName === 'undefined') {
            return undefined;
        }
        return new ControllerBuilder(this.moduleName, controllerName);
    };

    UnitTestBuilder.prototype.testService = function(serviceName) {
        if (typeof serviceName === 'undefined') {
            return undefined;
        }
        return new ServiceBuilder(this.moduleName, serviceName);
    };

    UnitTestBuilder.prototype.testDirective = function(elementHtml) {
        if (typeof elementHtml === 'undefined') {
            return undefined;
        }
        return new DirectiveBuilder(this.moduleName, elementHtml);
    };

    return {
        inject: injectService,
        getPromiseMock: getPromiseMock,
        getHttpPromiseMock: getHttpPromiseMock,
        module: function(moduleName) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            return new UnitTestBuilder(moduleName);
        }
    };
})();