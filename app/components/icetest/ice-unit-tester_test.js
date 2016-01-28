/*jshint unused:false*/
var iceUnit = (function() {
    'use strict';

    function isFunction(value){
        return typeof value === 'function';
    }

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

            callbackObject.success = function() {};
            callbackObject.error = function() {};

            promiseMock.error = function(errorCallback) {
                callbackObject.error = errorCallback;
            };

            promiseMock.success = function(successCallback) {
                callbackObject.success = successCallback;

                return {
                    error: promiseMock.error
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
        //    return function ([paramObject], payload, [successCallback], [errorCallback]) {}

        return function (a1, a2, a3, a4) {
            var paramObject, payload, successCallback, errorCallback;

            /* jshint -W086 */ /* (purposefully fall through case statements) */
            switch(arguments.length) {
                case 4:
                    successCallback = a3;
                    errorCallback = a4;
                    //fallthrough
                case 3:
                    //fallthrough
                case 2:
                    if (isFunction(a2)) {
                        if (isFunction(a1)) {
                            successCallback = a1;
                            errorCallback = a2;
                            break;
                        }

                        successCallback = a2;
                        errorCallback = a3;
                        //fallthrough
                    } else {
                        paramObject = a1;
                        payload = a2;
                        successCallback = a3;
                        break;
                    }
                case 1:
                    if (isFunction(a1)) {
                        successCallback = a1;
                    } else if (isPayload) {
                        payload = a1;
                    }
                    else {
                        paramObject = a1;
                    }
                    break;
                case 0:
                    break;
            }
            /* jshint +W086 */ /* (purposefully fall through case statements) */

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
                if (typeof ResourceMock.prototype.$save !== 'function') {
                    // add these if not already added by ResourceMockBuilder.build (see ResourceActionMockBuilder)
                    ResourceMock.prototype.$save = getResourceActionMock(false, false, callbackObject, '$save', ResourceMock, true);
                    ResourceMock.prototype.$remove = getResourceActionMock(false, false, callbackObject, '$remove', ResourceMock, true);
                    ResourceMock.prototype.$delete = getResourceActionMock(false, false, callbackObject, '$delete', ResourceMock, true);
                }
            }

            if (isPayload) {
                callbackObject[actionName].payload = payload;
            }
            if (isInstanceCall) {
                callbackObject[actionName].payload = this;
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
            var $parent = $rootScope.$new();
            angular.extend($parent, this.parentScope);
            $scope = $parent.$new();
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

    function DirectiveConfigBuilder(moduleName, directiveName) {
        this.moduleName = moduleName;
        this.directiveName = directiveName;
        this.provideValues = [];
    }

    DirectiveConfigBuilder.prototype.withMock = function(injectKey, mock) {
        this.provideValues.push({injectKey: injectKey, mock: mock});
        return this;
    };

    DirectiveConfigBuilder.prototype.build = function() {
        var _this = this;
        angular.mock.module(this.moduleName, function($provide) {
            if (_this.provideValues.length > 0) {
                _this.provideValues.forEach(function(provideVal) {
                    $provide.value(provideVal.injectKey, provideVal.mock);
                });
            }
        });

        var directiveArray = injectService(this.directiveName + 'Directive');
        var directive = directiveArray[0];

        return directive;
    };

    function FilterBuilder(moduleName, filterName) {
        this.moduleName = moduleName;
        this.filterName = filterName;
        this.provideValues = [];
    }

    FilterBuilder.prototype.withMock = function(injectKey, mock) {
        this.provideValues.push({injectKey: injectKey, mock: mock});
        return this;
    };

    FilterBuilder.prototype.build = function() {
        var _this = this;
        angular.mock.module(this.moduleName, function($provide) {
            if (_this.provideValues.length > 0) {
                _this.provideValues.forEach(function(provideVal) {
                    $provide.value(provideVal.injectKey, provideVal.mock);
                });
            }
        });

        return injectService(this.filterName + 'Filter');
    };

    function ResourceMockBuilder(callbackObject) {
        this.actions = [
            {name: 'get', isArray: false, isPayload: false, hasInstanceAction: false},
            {name: 'save', isArray: false, isPayload: true, hasInstanceAction: true},
            {name: 'query', isArray: true, isPayload: false, hasInstanceAction: false},
            {name: 'remove', isArray: false, isPayload: true, hasInstanceAction: true},
            {name: 'delete', isArray: false, isPayload: true, hasInstanceAction: true}
        ];
        this.callbackObject = callbackObject;
        this.ResourceMock = function() {};
    }

    ResourceMockBuilder.prototype.withCustomAction = function(actionName, isArray, isPayload, hasInstanceAction) {
        this.actions.push({name: actionName, isArray: isArray, isPayload: isPayload, hasInstanceAction: hasInstanceAction});
        return this;
    };

    ResourceMockBuilder.prototype.build = function() {
        if (this.actions.length > 0) {

            var _this = this;
            this.actions.forEach(function(action) {
                _this.ResourceMock[action.name] = getResourceActionMock(action.isArray, action.isPayload, _this.callbackObject, action.name, _this.ResourceMock, false);

                if (action.hasInstanceAction) {
                    _this.ResourceMock.prototype['$' + action.name] = getResourceActionMock(action.isArray, action.isPayload, _this.callbackObject, '$' + action.name, _this.ResourceMock, true);
                }
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
        directiveConfig: function(moduleName, directiveName) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            if (typeof directiveName === 'undefined') {
                return undefined;
            }
            return new DirectiveConfigBuilder(moduleName, directiveName);
        },
        filter: function(moduleName, filterName) {
            if (typeof moduleName === 'undefined') {
                return undefined;
            }
            if (typeof filterName === 'undefined') {
                return undefined;
            }
            return new FilterBuilder(moduleName, filterName);
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
