'use strict';

describe('ExamplesCtrl:', function() {

    // load the controller's module
    beforeEach(module('angularIceApp'));

    var $scope;

    var createController = function() {
        $scope = iceUnitTester.setupController('ExamplesCtrl').buildAndReturnItsScope();
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
        beforeEach(createController);

    });

});