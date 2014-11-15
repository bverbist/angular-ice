'use strict';

describe('iceAutoSelectContentOn directive:', function() {
    var $scope;
    var form;
    var $compile;

    // load the app which contains the directive
    beforeEach(module('angularIceApp'));

    beforeEach(inject(function(_$compile_, $rootScope) {
        $compile = _$compile_;

        $scope = $rootScope.$new();
        $scope.modelField = '';
    }));

    function setup(event) {
        var optionalAttrs = '';
        if (typeof event !== 'undefined') {
            optionalAttrs = '=' + event;
        }

        $compile(
                '<form name="form">' +
                '<input name="modelName" type="text" ng-model="modelField" ng-trim="false" ice-auto-select-content-on' + optionalAttrs + '>' +
                '</form>'
        )($scope);
        $scope.$digest();

        form = $scope.form;
    }

    describe('IF default event:', function() {
        beforeEach(function () {
            setup();
        });

        it('does not alter content', function() {
            form.modelName.$setViewValue('abc');
            expect($scope.modelField).toEqual('abc');
        });
    });

    describe('IF other event:', function() {
        beforeEach(function () {
            setup('focus');
        });

        it('does not alter content', function() {
            form.modelName.$setViewValue('abc');
            expect($scope.modelField).toEqual('abc');
        });
    });
});