'use strict';

describe('ExamplesCtrl:', function() {

    var $scope;

    var createController = function() {
        $scope = iceUnitTester
            .controllerScopeBuilder('angularIceApp', 'ExamplesCtrl')
            .build();
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