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

    function setup(skipModuleLoad, selectEvent, deselectEvent) {
        if (typeof skipModuleLoad === 'undefined') {
            skipModuleLoad = false;
        }

        var directiveBuilder = iceUnit.builder
            .directive('angularIceApp', getElementHtml(selectEvent, deselectEvent));

        if (skipModuleLoad) {
            directiveBuilder.skipModuleLoad();
        }

        var directiveTester = directiveBuilder
            .withScopeField('modelField', '')
            .build();

        $scope = directiveTester.$scope;
        element = directiveTester.element;

        form = $scope.form;
    }

    describe('General:', function() {
        beforeEach(function () {
            setup(false);
        });

        it('content is by default not selected', function() {
            var isolateScope = element.find('input').isolateScope();
            expect(isolateScope.isElementSelected).toBe(false);
        });

        it('content is not altered', function() {
            form.modelName.$setViewValue('abc');
            expect($scope.modelField).toEqual('abc');
        });
    });

    describe('IF default event:', function() {
        beforeEach(function () {
            setup();
        });

        it('no error if select and deselect events are not passed to the directive', function() {
            expect(element.html()).toContain(' ice-auto-select-content-on="" ');
            expect(element.html()).not.toContain('ice-deselect-event');
        });
    });

    describe('IF other event (and deselect event overriden):', function() {
        beforeEach(function () {
            angular.mock.module('angularIceApp');

            setup(true, 'mouseover', 'mouseout');
        });

        it('no error if select and deselect events are passed (overridden) to the directive', function() {
            expect(element.html()).toContain(' ice-auto-select-content-on="mouseover" ');
            expect(element.html()).toContain(' ice-deselect-event="mouseout" ');
        });
    });
});
