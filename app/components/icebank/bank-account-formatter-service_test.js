'use strict';

describe('iceBankAccountFormatter:', function() {

    var iceBankAccountFormatter;

    beforeEach(function() {
        iceBankAccountFormatter = iceUnit.builder
            .service('ice.bank', 'iceBankAccountFormatter')
            .build();
    });

    describe('filterAndFormat()', function() {
        describe('IF empty/undefined/null input:', function() {
            it('returns empty text', function() {
                expect(iceBankAccountFormatter.filterAndFormat('')).toEqual('');

                expect(iceBankAccountFormatter.filterAndFormat(undefined)).toEqual('');

                expect(iceBankAccountFormatter.filterAndFormat(null)).toEqual('');
            });
        });

        describe('IF BBAN (starts with digit):', function() {
            it('removes non-digits', function() {
                expect(iceBankAccountFormatter.filterAndFormat('1aA ')).toEqual('1__-_______-__');
            });

            it('adds - and _ characters to become the ___-_______-__ pattern (3_-7_-2_)', function() {
                expect(iceBankAccountFormatter.filterAndFormat('12')).toEqual('12_-_______-__');

                expect(iceBankAccountFormatter.filterAndFormat('123')).toEqual('123-_______-__');

                expect(iceBankAccountFormatter.filterAndFormat('1234')).toEqual('123-4______-__');

                expect(iceBankAccountFormatter.filterAndFormat('123-4')).toEqual('123-4______-__');

                expect(iceBankAccountFormatter.filterAndFormat('123-45')).toEqual('123-45_____-__');

                expect(iceBankAccountFormatter.filterAndFormat('123-123456')).toEqual('123-123456_-__');

                expect(iceBankAccountFormatter.filterAndFormat('123-1234567')).toEqual('123-1234567-__');

                expect(iceBankAccountFormatter.filterAndFormat('12312345671')).toEqual('123-1234567-1_');

                expect(iceBankAccountFormatter.filterAndFormat('123-12345671')).toEqual('123-1234567-1_');

                expect(iceBankAccountFormatter.filterAndFormat('123-1234567-1')).toEqual('123-1234567-1_');

                expect(iceBankAccountFormatter.filterAndFormat('123-1234567-12')).toEqual('123-1234567-12');
            });

            it('removes digits entered after the last group of 2 digits', function() {
                expect(iceBankAccountFormatter.filterAndFormat('123-1234567-123')).toEqual('123-1234567-12');
            });
        });

        describe('IF IBAN (starts with letter):', function() {
            it('removes non-letters and non-digits', function() {
                expect(iceBankAccountFormatter.filterAndFormat('B- 3*C_')).toEqual('B3C_ ____ ____ ____ ____ ____ ____ ____ __');
            });

            it('brings non-capital letters to uppercase', function() {
                expect(iceBankAccountFormatter.filterAndFormat('nRd')).toEqual('NRD_ ____ ____ ____ ____ ____ ____ ____ __');
            });

            describe('IF International IBAN (starts NOT with BE):', function() {
                it('adds space and _ characters to become the ____ ____ ____ ____ ____ ____ ____ ____ __ pattern (each group 4 chars, separated with a space, total of max 30 chars after first group)', function() {
                    expect(iceBankAccountFormatter.filterAndFormat('NL12')).toEqual('NL12 ____ ____ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL123')).toEqual('NL12 3___ ____ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 3')).toEqual('NL12 3___ ____ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234')).toEqual('NL12 1234 ____ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 12345')).toEqual('NL12 1234 5___ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1')).toEqual('NL12 1234 1___ ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234')).toEqual('NL12 1234 1234 ____ ____ ____ ____ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234 1234 1234 12345')).toEqual('NL12 1234 1234 1234 1234 1234 5___ ____ __');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234 1234 1234 1234 1234 123456')).toEqual('NL12 1234 1234 1234 1234 1234 1234 1234 56');
                });

                it('removes digits entered after the max allowed (34)', function() {
                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234 1234 1234 1234 1234 1234 129')).toEqual('NL12 1234 1234 1234 1234 1234 1234 1234 12');
                });

                it('an optional international iban format can be passed as input (if gui field not long enough to display all the underscores)', function() {
                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234', '____ ____ ____ ____ ____')).toEqual('NL12 1234 1234 ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('NL12 1234 1234 1234 1234 5', '____ ____ ____ ____ ____')).toEqual('NL12 1234 1234 1234 1234 5');
                });
            });

            describe('IF Belgian IBAN (starts with BE):', function() {
                it('adds space and _ characters to become the BE__ ____ ____ ____ pattern (4 groups of each 4 chars, separated with a space)', function() {
                    expect(iceBankAccountFormatter.filterAndFormat('BE')).toEqual('BE__ ____ ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34')).toEqual('BE34 ____ ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE341')).toEqual('BE34 1___ ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34 1')).toEqual('BE34 1___ ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE341234')).toEqual('BE34 1234 ____ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE3412341')).toEqual('BE34 1234 1___ ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34 1234 1____ ___')).toEqual('BE34 1234 1___ ____'); // 3rd group has one _ to much

                    expect(iceBankAccountFormatter.filterAndFormat('BE3412341234')).toEqual('BE34 1234 1234 ____');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34123412341')).toEqual('BE34 1234 1234 1___');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34 1234 1234 1____')).toEqual('BE34 1234 1234 1___');

                    expect(iceBankAccountFormatter.filterAndFormat('BE34123412341234')).toEqual('BE34 1234 1234 1234');
                });

                it('removes digits entered after the last group of 4 digits', function() {
                    expect(iceBankAccountFormatter.filterAndFormat('BE341234123412341')).toEqual('BE34 1234 1234 1234');
                });
            });
        });
    });

});
