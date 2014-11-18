'use strict';

describe('ExamplesCtrl:', function() {

    // load the controller's module
    beforeEach(module('angularIceApp'));

    var $controller;
    var $rootScope;
    var $scope;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    var createController = function() {
        $scope = $rootScope.$new();
        $controller('ExamplesCtrl', {
            '$scope': $scope
        });
    };

    describe('on init:', function() {
        it('some fields are put on the scope', function() {
            createController();

            expect($scope.model).toBeDefined();
            expect($scope.model.autoSelectDefault).toBeDefined();
            expect($scope.model.autoSelectOtherEvent).toBeDefined();
        });
    });

    describe('after init:', function() {

    });

});