'use strict';

describe('iceBankAccountNumber directive:', function() {
    var $scope;
    var element;
    var form;

    function getElementHtml() {
        return '<form name="form">' +
            '<input name="modelName" type="text" ng-model="modelField" ng-trim="false" ice-bank-account-number>' +
            '</form>';
    }

    beforeEach(function() {
        var directiveTester = iceUnit.builder
            .directive('angularIceApp', getElementHtml())
            .withScopeField('modelField', '')
            .build();

        $scope = directiveTester.$scope;
        element = directiveTester.element;

        form = $scope.form;
    });

    describe('IF empty model:', function() {
        it('shows empty text', function() {
            form.modelName.$setViewValue('');
            expect($scope.modelField).toEqual('');
        });
    });

    describe('IF BBAN (starts with digit):', function() {
        it('removes non-digits', function() {
            form.modelName.$setViewValue('1aA ');
            expect($scope.modelField).toEqual('1__-_______-__');
        });

        it('adds - and _ characters to become the ___-_______-__ pattern (3_-7_-2_)', function() {
            form.modelName.$setViewValue('12');
            expect($scope.modelField).toEqual('12_-_______-__');

            form.modelName.$setViewValue('123');
            expect($scope.modelField).toEqual('123-_______-__');

            form.modelName.$setViewValue('1234');
            expect($scope.modelField).toEqual('123-4______-__');

            form.modelName.$setViewValue('123-4');
            expect($scope.modelField).toEqual('123-4______-__');

            form.modelName.$setViewValue('123-45');
            expect($scope.modelField).toEqual('123-45_____-__');

            form.modelName.$setViewValue('123-123456');
            expect($scope.modelField).toEqual('123-123456_-__');

            form.modelName.$setViewValue('123-1234567');
            expect($scope.modelField).toEqual('123-1234567-__');

            form.modelName.$setViewValue('12312345671');
            expect($scope.modelField).toEqual('123-1234567-1_');

            form.modelName.$setViewValue('123-12345671');
            expect($scope.modelField).toEqual('123-1234567-1_');

            form.modelName.$setViewValue('123-1234567-1');
            expect($scope.modelField).toEqual('123-1234567-1_');

            form.modelName.$setViewValue('123-1234567-12');
            expect($scope.modelField).toEqual('123-1234567-12');
        });

        it('removes digits entered after the last group of 2 digits', function() {
            form.modelName.$setViewValue('123-1234567-123');
            expect($scope.modelField).toEqual('123-1234567-12');
        });
    });

    describe('IF IBAN (starts with letter):', function() {
        it('removes non-letters and non-digits', function() {
            form.modelName.$setViewValue('B- 3*C_');
            expect($scope.modelField).toEqual('B3C_ ____ ____ ____ ____ ____ ____ ____ __');
        });

        it('brings non-capital letters to uppercase', function() {
            form.modelName.$setViewValue('nRd');
            expect($scope.modelField).toEqual('NRD_ ____ ____ ____ ____ ____ ____ ____ __');
        });

        describe('IF International IBAN (starts NOT with BE):', function() {
            it('adds space and _ characters to become the ____ ____ ____ ____ ____ ____ ____ ____ __ pattern (each group 4 chars, separated with a space, total of max 30 chars after first group)', function() {
                form.modelName.$setViewValue('NL12');
                expect($scope.modelField).toEqual('NL12 ____ ____ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL123');
                expect($scope.modelField).toEqual('NL12 3___ ____ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 3');
                expect($scope.modelField).toEqual('NL12 3___ ____ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 1234');
                expect($scope.modelField).toEqual('NL12 1234 ____ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 12345');
                expect($scope.modelField).toEqual('NL12 1234 5___ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 1234 1');
                expect($scope.modelField).toEqual('NL12 1234 1___ ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 1234 1234');
                expect($scope.modelField).toEqual('NL12 1234 1234 ____ ____ ____ ____ ____ __');

                form.modelName.$setViewValue('NL12 1234 1234 1234 1234 12345');
                expect($scope.modelField).toEqual('NL12 1234 1234 1234 1234 1234 5___ ____ __');

                form.modelName.$setViewValue('NL12 1234 1234 1234 1234 1234 1234 123456');
                expect($scope.modelField).toEqual('NL12 1234 1234 1234 1234 1234 1234 1234 56');
            });

            it('removes digits entered after the max allowed (34)', function() {
                form.modelName.$setViewValue('NL12 1234 1234 1234 1234 1234 1234 1234 129');
                expect($scope.modelField).toEqual('NL12 1234 1234 1234 1234 1234 1234 1234 12');
            });
        });

        describe('IF Belgian IBAN (starts with BE):', function() {
            it('adds space and _ characters to become the BE__ ____ ____ ____ pattern (4 groups of each 4 chars, separated with a space)', function() {
                form.modelName.$setViewValue('BE');
                expect($scope.modelField).toEqual('BE__ ____ ____ ____');

                form.modelName.$setViewValue('BE34');
                expect($scope.modelField).toEqual('BE34 ____ ____ ____');

                form.modelName.$setViewValue('BE341');
                expect($scope.modelField).toEqual('BE34 1___ ____ ____');

                form.modelName.$setViewValue('BE34 1');
                expect($scope.modelField).toEqual('BE34 1___ ____ ____');

                form.modelName.$setViewValue('BE341234');
                expect($scope.modelField).toEqual('BE34 1234 ____ ____');

                form.modelName.$setViewValue('BE3412341');
                expect($scope.modelField).toEqual('BE34 1234 1___ ____');

                form.modelName.$setViewValue('BE34 1234 1____ ___'); // 3rd group has one _ to much
                expect($scope.modelField).toEqual('BE34 1234 1___ ____');

                form.modelName.$setViewValue('BE3412341234');
                expect($scope.modelField).toEqual('BE34 1234 1234 ____');

                form.modelName.$setViewValue('BE34123412341');
                expect($scope.modelField).toEqual('BE34 1234 1234 1___');

                form.modelName.$setViewValue('BE34 1234 1234 1____');
                expect($scope.modelField).toEqual('BE34 1234 1234 1___');

                form.modelName.$setViewValue('BE34123412341234');
                expect($scope.modelField).toEqual('BE34 1234 1234 1234');
            });

            it('removes digits entered after the last group of 4 digits', function() {
                form.modelName.$setViewValue('BE341234123412341');
                expect($scope.modelField).toEqual('BE34 1234 1234 1234');
            });
        });
    });

});
