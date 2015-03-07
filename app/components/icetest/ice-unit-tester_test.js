/*jshint unused:false*/
var iceUnit = (function() {
    'use strict';

    var injectService = function(serviceName) {
        var service;
        angular.mock.inject(function($injector) {
            service = $injector.get(serviceName);
        });
        return service;
    };

    var getPromiseMock = function(callbackObject) {
        return function() {
            return {
                then: function(successCallback, errorCallback, notifyCallback) {
                    callbackObject.success = successCallback;
                    callbackObject.error = errorCallback;
                    callbackObject.notify = notifyCallback;
                },
                catch: function(errorCallback) {
                    callbackObject.success = null;
                    callbackObject.error = errorCallback;
                }
            };
        };
    };

    var getHttpPromiseMock = function(callbackObject) {
        return function() {
            var promiseMock = getPromiseMock(callbackObject)();

            promiseMock.success = function(successCallback) {
                callbackObject.success = successCallback;

                return {
                    error: function(errorCallback) {
                        callbackObject.error = errorCallback;
                    }
                };
            };

            return promiseMock;
        };
    };

    var extendArray = function(array, otherArray) {
        otherArray.forEach(function(elem) {
            array.push(elem);
        });
    };

    var getResourceActionMock = function(isArray, callbackObject) {
        return function (paramObject, successCallback, errorCallback) {
            var resultReferenceObject;
            if (isArray) {
                resultReferenceObject = [];
                resultReferenceObject.$resolved = false;
            } else {
                resultReferenceObject = {
                    $resolved: false
                };
            }

            callbackObject.success = function(value, responseHeaders) {
                if (isArray) {
                    extendArray(resultReferenceObject, value);
                } else {
                    angular.copy(value, resultReferenceObject);
                }

                resultReferenceObject.$resolved = true;

                successCallback(value, responseHeaders);
            };

            callbackObject.error = function(httpResponse) {
                resultReferenceObject.$resolved = true;

                errorCallback(httpResponse);
            };

            resultReferenceObject.$promise = getPromiseMock(callbackObject)();

            return resultReferenceObject;
        };
    };

    var mock = {
        promise: getPromiseMock,
        $httpPromise: getHttpPromiseMock,
        $resourceAction: getResourceActionMock
    };

    function ControllerScopeBuilder(moduleName, controllerName) {
        this.moduleName = moduleName;
        this.controllerName = controllerName;
        this.parentScope = null;
        this.injectionLocals = {};
        this.loadModule = true;
    }

    ControllerScopeBuilder.prototype.withMock = function(injectKey, mock) {
        this.injectionLocals[injectKey] = mock;
        return this;
    };

    ControllerScopeBuilder.prototype.withParentScope = function(parentScopeObject) {
        this.parentScope = parentScopeObject;
        return this;
    };

    ControllerScopeBuilder.prototype.skipModuleLoad = function() {
        this.loadModule = false;
        return this;
    };

    ControllerScopeBuilder.prototype.build = function() {
        if (this.loadModule === true) {
            angular.mock.module(this.moduleName);
        }

        var $controller = injectService('$controller');
        var $rootScope = injectService('$rootScope');

        var $scope;

        if (this.parentScope === null) {
            $scope = $rootScope.$new();
        } else {
            $scope = this.parentScope;
        }

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

    ServiceBuilder.prototype.build = function() {
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
        this.loadModule = true;
    }

    DirectiveBuilder.prototype.withScopeField = function(fieldName, fieldValue) {
        this.scopeFields.push({name: fieldName, value: fieldValue});
        return this;
    };

    DirectiveBuilder.prototype.skipModuleLoad = function() {
        this.loadModule = false;
        return this;
    };

    DirectiveBuilder.prototype.build = function() {
        if (this.loadModule === true) {
            angular.mock.module(this.moduleName);
        }

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

    function ResourceMockBuilder(callbackObject) {
        this.actions = [
            {name: 'get', isArray: false},
            {name: 'save', isArray: false},
            {name: 'query', isArray: true},
            {name: 'remove', isArray: false},
            {name: 'delete', isArray: false}
        ];
        this.callbackObject = callbackObject;
    }

    ResourceMockBuilder.prototype.withExtraAction = function(actionName, isArray) {
        this.actions.push({name: actionName, isArray: isArray});
        return this;
    };

    ResourceMockBuilder.prototype.build = function() {
        var _this = this;
        return function() {
            var resourceMock = {};

            if (_this.actions.length > 0) {
                _this.actions.forEach(function(action) {
                    _this.callbackObject[action.name] = {};
                    resourceMock[action.name] = getResourceActionMock(action.isArray, _this.callbackObject[action.name]);
                });
            }

            return resourceMock;
        };
    };

    var builder = {
        controllerScope: function(moduleName, controllerName) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            if (typeof controllerName === 'undefined') {
                return undefined;
            }
            return new ControllerScopeBuilder(moduleName, controllerName);
        },
        service: function(moduleName, serviceName) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            if (typeof serviceName === 'undefined') {
                return undefined;
            }
            return new ServiceBuilder(moduleName, serviceName);
        },
        directive: function(moduleName, elementHtml) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            if (typeof elementHtml === 'undefined') {
                return undefined;
            }
            return new DirectiveBuilder(moduleName, elementHtml);
        },
        $resourceMock: function(callbackObject) {
            if (typeof callbackObject === 'undefined') {
                return undefined;
            }
            return new ResourceMockBuilder(callbackObject);
        }
    };

    return {
        inject: injectService,
        mock: mock,
        builder: builder
    };
})();
