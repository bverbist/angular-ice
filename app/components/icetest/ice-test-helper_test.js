/*jshint unused:false*/
var iceTestHelper = (function() {
    'use strict';

    function IceTestHelper() {}

    IceTestHelper.prototype.injectService = function(serviceName) {
        var service;
        inject(function($injector) {
            service = $injector.get(serviceName);
        });
        return service;
    };

    IceTestHelper.prototype.createCtrlAndReturnItsScope = function(ctrlName, injectionLocalsObj) {
        if (typeof injectionLocalsObj === 'undefined') {
            injectionLocalsObj = {};
        }

        var $controller = this.injectService('$controller');
        var $rootScope = this.injectService('$rootScope');

        var $scope = $rootScope.$new();
        injectionLocalsObj.$scope = $scope;

        $controller(ctrlName, injectionLocalsObj);

        return $scope;
    };

    return new IceTestHelper();
})();