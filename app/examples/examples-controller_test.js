'use strict';

describe('ExamplesCtrl:', function() {

    var $scope;

    describe('on init:', function() {
        beforeEach(function() {
            angular.mock.module('angularIceApp');
        });

        var buildController = function() {
            $scope = iceUnit
                .controllerScopeBuilder('angularIceApp', 'ExamplesCtrl')
                .skipModuleLoad()
                .build();
        };

        it('some fields are put on the scope', function() {
            buildController();

            expect($scope.model).toBeDefined();
            expect($scope.model.autoSelectDefault).toBeDefined();
            expect($scope.model.autoSelectOtherEvent).toBeDefined();
        });
    });

    describe('after init:', function() {
        beforeEach(function() {
            $scope = iceUnit
                .controllerScopeBuilder('angularIceApp', 'ExamplesCtrl')
                .build();
        });

        it('helloWorld() returns some dummy text', function() {
            var actual = $scope.helloWorld();

            expect(actual).toBe('Hello ICE !');
        });

        it('goToAnchor() sets the location hash to the input id and calls $anchorScroll()', function() {
            var $location = iceUnit.inject('$location');
            spyOn($location, 'hash');

            $scope.goToAnchor('someId');

            expect($location.hash).toHaveBeenCalledWith('someId');
        });
    });

});
