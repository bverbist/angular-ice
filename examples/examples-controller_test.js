'use strict';

describe('ExamplesCtrl:', function() {

    describe('on init:', function() {
        var $scope;

        beforeEach(function() {
            angular.mock.module('angularIceApp');
        });

        var buildController = function() {
            $scope = iceUnit.builder
                .controllerAs('angularIceApp', 'ExamplesCtrl', 'examples')
                .skipModuleLoad()
                .returnScope()
                .build();
        };

        it('some fields are put on the scope', function() {
            buildController();

            var vm = $scope.examples;
            expect(vm).toBeDefined();
            expect(vm.model).toBeDefined();
            expect(vm.model.autoSelectDefault).toBeDefined();
            expect(vm.model.autoSelectOtherEvent).toBeDefined();
            expect(vm.model.bankAccountNr).toBeDefined();
        });
    });

    describe('after init:', function() {
        var vm;

        beforeEach(function() {
            vm = iceUnit.builder
                .controllerAs('angularIceApp', 'ExamplesCtrl')
                .build();
        });

        it('helloWorld() returns some dummy text', function() {
            expect(vm.model).toBeDefined();

            var actual = vm.helloWorld();

            expect(actual).toBe('Hello ICE !');
        });

        it('goToAnchor() sets the location hash to the input id and calls $anchorScroll()', function() {
            var $location = iceUnit.inject('$location');
            spyOn($location, 'hash');

            vm.goToAnchor('someId');

            expect($location.hash).toHaveBeenCalledWith('someId');
        });
    });

});
