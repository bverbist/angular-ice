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

    var extendArray = function(array, otherArray, MakeEachElemOfThisType) {
        otherArray.forEach(function(elem) {
            var instanceElem = new MakeEachElemOfThisType();
            angular.copy(elem, instanceElem);
            array.push(instanceElem);
        });
    };

    var getResourceActionMock = function(isArray, isPayload, callbackObject, actionName, ResourceMock, isInstanceCall) {
        if (typeof isInstanceCall === 'undefined') {
            isInstanceCall = false;
        }

        callbackObject[actionName] = {};

        //for GET actions (and non-GET instance actions):
        //    return function ([paramObject], [successCallback], [errorCallback]) {}
        //for non-GET 'class' actions:
        //    return function ([paramObject], postData, [successCallback], [errorCallback]) {}

        return function (a0, a1, a2, a3) {
            //switch(arguments.length) {
            //    case 4:
            //        successCallback = a2;
            //        errorCallback = a3;
            //        break;
            //    case 3:
            //        break;
            //    case 2:
            //        break;
            //    case 1:
            //        break;
            //    case 0:
            //        break;
            //}

            //var paramObject = a0;
            var successCallback, errorCallback;
            if (isPayload) {
                //var postData = a1;
                successCallback = a2;
                errorCallback = a3;
            } else {
                successCallback = a1;
                errorCallback = a2;
            }

            var resultReferenceObject;
            if (isArray) {
                resultReferenceObject = [];
                resultReferenceObject.$resolved = false;
            } else {
                // {}
                resultReferenceObject = new ResourceMock();
                resultReferenceObject.$resolved = false;
            }

            if (!isInstanceCall) {
                ResourceMock.prototype.$save = getResourceActionMock(false, false, callbackObject, '$save', ResourceMock, true);
                ResourceMock.prototype.$remove = getResourceActionMock(false, false, callbackObject, '$remove', ResourceMock, true);
                ResourceMock.prototype.$delete = getResourceActionMock(false, false, callbackObject, '$delete', ResourceMock, true);
            }

            callbackObject[actionName].success = function(value, responseHeaders) {
                if (isArray) {
                    extendArray(resultReferenceObject, value, ResourceMock);
                } else {
                    angular.copy(value, resultReferenceObject);
                }

                resultReferenceObject.$resolved = true;

                if (typeof successCallback !== 'undefined') {
                    successCallback(value, responseHeaders);
                }
            };

            callbackObject[actionName].error = function(httpResponse) {
                resultReferenceObject.$resolved = true;

                if (typeof errorCallback !== 'undefined') {
                    errorCallback(httpResponse);
                }
            };

            resultReferenceObject.$promise = getPromiseMock(callbackObject[actionName])();

            if (isInstanceCall) {
                return resultReferenceObject.$promise;
            }
            return resultReferenceObject;
        };
    };

    var mock = {
        promise: getPromiseMock,
        $httpPromise: getHttpPromiseMock
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
            {name: 'get', isArray: false, isPayload: false},
            {name: 'save', isArray: false, isPayload: true},
            {name: 'query', isArray: true, isPayload: false},
            {name: 'remove', isArray: false, isPayload: true},
            {name: 'delete', isArray: false, isPayload: true}
        ];
        this.callbackObject = callbackObject;
        this.ResourceMock = function() {};
    }

    ResourceMockBuilder.prototype.withCustomAction = function(actionName, isArray, isPayload) {
        this.actions.push({name: actionName, isArray: isArray, isPayload: isPayload});
        return this;
    };

    ResourceMockBuilder.prototype.build = function() {
        if (this.actions.length > 0) {

            this.ResourceMock.prototype.$save = getResourceActionMock(false, false, this.callbackObject, '$save', this.ResourceMock, true);
            this.ResourceMock.prototype.$remove = getResourceActionMock(false, false, this.callbackObject, '$remove', this.ResourceMock, true);
            this.ResourceMock.prototype.$delete = getResourceActionMock(false, false, this.callbackObject, '$delete', this.ResourceMock, true);

            var _this = this;
            this.actions.forEach(function(action) {
                _this.ResourceMock[action.name] = getResourceActionMock(action.isArray, action.isPayload, _this.callbackObject, action.name, _this.ResourceMock);
            });
        }

        return this.ResourceMock;
    };

    function ResourceActionMockBuilder(actionName, callbackObject) {
        this.actionName = actionName;
        this.callbackObject = callbackObject;
        this.isArray = false;
        this.isPayload = false;
        this.ResourceMock = function() {};
    }

    ResourceActionMockBuilder.prototype.acceptsPayload = function(isPayload) {
        if (typeof isPayload === 'undefined') {
            isPayload = true;
        }
        this.isPayload = isPayload;
        return this;
    };

    ResourceActionMockBuilder.prototype.returnsArray = function(isArray) {
        if (typeof isArray === 'undefined') {
            isArray = true;
        }
        this.isArray = isArray;
        return this;
    };

    ResourceActionMockBuilder.prototype.build = function() {
        return getResourceActionMock(this.isArray, this.isPayload, this.callbackObject, this.actionName, this.ResourceMock);
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
        },
        $resourceActionMock: function(actionName, callbackObject) {
            if (typeof actionName === 'undefined') {
                return undefined;
            }
            if (typeof callbackObject === 'undefined') {
                return undefined;
            }
            return new ResourceActionMockBuilder(actionName, callbackObject);
        }
    };

    return {
        inject: injectService,
        mock: mock,
        builder: builder
    };
})();
