'use strict';

describe('iceAutoSelectContentOn directive:', function() {
    var $scope;
    var element;
    var form;

    function getElementHtml(selectEvent, deselectEvent) {
        var optionalAttrs = '';
        if (typeof selectEvent !== 'undefined') {
            optionalAttrs += '=' + selectEvent;
        }
        if (typeof deselectEvent !== 'undefined') {
            optionalAttrs += ' ice-deselect-event="' + deselectEvent + '"';
        }

        return '<form name="form">' +
            '<input name="modelName" type="text" ng-model="modelField" ng-trim="false" ice-auto-select-content-on' + optionalAttrs + '>' +
            '</form>';
    }

    function setup(selectEvent, deselectEvent) {
        var directiveTester = iceUnitTester
            .module('angularIceApp')
            .testDirective(getElementHtml(selectEvent, deselectEvent))
            .withScopeField('modelField', '')
            .load();

        $scope = directiveTester.$scope;
        element = directiveTester.element;

        form = $scope.form;
    }

    describe('IF default event:', function() {
        beforeEach(function () {
            setup();
        });

        it('no error if select and deselect events are not passed to the directive', function() {
            expect(element.html()).toContain(' ice-auto-select-content-on="" ');
            expect(element.html()).not.toContain('ice-deselect-event');
        });

        it('does not alter content', function() {
            form.modelName.$setViewValue('abc');
            expect($scope.modelField).toEqual('abc');
        });
    });

    describe('IF other event (and deselect event overriden):', function() {
        beforeEach(function () {
            setup('mouseover', 'mouseout');
        });

        it('no error if select and deselect events are passed (overridden) to the directive', function() {
            expect(element.html()).toContain(' ice-auto-select-content-on="mouseover" ');
            expect(element.html()).toContain(' ice-deselect-event="mouseout" ');
        });

        it('does not alter content', function() {
            form.modelName.$setViewValue('abc');
            expect($scope.modelField).toEqual('abc');
        });
    });
});