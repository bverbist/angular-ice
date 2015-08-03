'use strict';

describe('iceBankAccountNumber directive (link function):', function() {
    var iceBankAccountNumber;
    var iceCaret, iceBankAccountFormatter, ngModelController;

    var ELEMENT_0 = {
        value: 'elementVal'
    };

    function doLink() {
        var scope = {};
        var element = [ELEMENT_0];
        var attrs = {};
        ngModelController = {
            $parsers: [
                function otherParser() {
                    return 'otherParser';
                }
            ],
            $formatters: [
                function otherFormatter() {
                    return 'otherFormatter';
                }
            ],
            $setViewValue: function() {},
            $render: function() {}
        };
        iceBankAccountNumber.link(scope, element, attrs, ngModelController);
    }

    beforeEach(function() {
        iceBankAccountNumber = iceUnit.builder
            .directiveConfig('ice.bank', 'iceBankAccountNumber')
            .build();

        iceCaret = iceUnit.inject('iceCaret');

        iceBankAccountFormatter = iceUnit.inject('iceBankAccountFormatter');
        spyOn(iceBankAccountFormatter, 'filterAndFormat').and.callThrough();

        doLink();
    });

    it('has expected configuration', function() {
        //console.log(JSON.stringify(iceBankAccountNumber));
        expect(iceBankAccountNumber.restrict).toBe('A');
        expect(iceBankAccountNumber.require).toBe('?ngModel');
        expect(iceBankAccountNumber.priority).toBe(0);
        expect(iceBankAccountNumber.index).toBe(0);
        expect(iceBankAccountNumber.name).toBe('iceBankAccountNumber');

        expect(iceBankAccountNumber.scope).toBeUndefined();
        expect(iceBankAccountNumber.templateUrl).toBeUndefined();

        expect(iceBankAccountNumber.link).toBeDefined();
    });

    describe('for View/DOM to Model update:', function() {
        describe('the bank account number parser', function() {
            var parser;

            beforeEach(function() {
                parser = ngModelController.$parsers[0];

                spyOn(ngModelController, '$setViewValue');
                spyOn(ngModelController, '$render');
                spyOn(iceCaret, 'setPosition');
            });

            it('is added to the beginning of the array', function() {
                expect(ngModelController.$parsers.length).toBe(2);
                expect(ngModelController.$parsers[1]()).toBe('otherParser');
            });

            it('returns the formatted bban if input an unformatted bban value', function() {
                expect(parser('12312')).toBe('123-12_____-__');

                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('12312');
            });

            it('returns the formatted iban if input an unformatted iban value', function() {
                expect(parser('BE12123')).toBe('BE12 123_ ____ ____');

                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('BE12123');
            });

            it('does no render (which would cause the cursor to jump to the end) or cursor repositioning IF outcome same as input', function() {
                expect(parser('BE12 123_ ____ ____')).toBe('BE12 123_ ____ ____');

                expect(ngModelController.$setViewValue).not.toHaveBeenCalled();
                expect(ngModelController.$render).not.toHaveBeenCalled();
                expect(iceCaret.setPosition).not.toHaveBeenCalled();
            });

            it('(re)renders (which causes the cursor to jump to the end) and as a result also repositions the cursor IF outcome not the same as input', function() {
                expect(parser('BE12123')).toBe('BE12 123_ ____ ____');

                expect(ngModelController.$setViewValue).toHaveBeenCalledWith('BE12 123_ ____ ____');
                expect(ngModelController.$render).toHaveBeenCalled();
                expect(iceCaret.setPosition).toHaveBeenCalled();
            });

            describe('repositions the cursor', function() {
                it('to the next position when a character was added and if the next position is not a [-] or [ ]', function() {
                    parser('BE'); //to BE__ ____ ____ ____
                    iceCaret.setPosition.calls.reset();

                    parser('BE1'); //to BE1_ ____ ____ ____

                    expect(iceCaret.setPosition).toHaveBeenCalledWith(ELEMENT_0, 3); // positioned after the 1
                });

                it('to after the next [-] or [ ] when a character was added and if the next position is a [-] or [ ]', function() {
                    parser('BE1'); //to BE1_ ____ ____ ____
                    iceCaret.setPosition.calls.reset();

                    parser('BE12'); //to BE12 ____ ____ ____

                    expect(iceCaret.setPosition).toHaveBeenCalledWith(ELEMENT_0, 5); // positioned after the space
                });

                it('to the previous position when a character was removed and if the previous position is not a [-] or [ ]', function() {
                    parser('BE1278'); //to BE12 78__ ____ ____
                    iceCaret.setPosition.calls.reset();

                    parser('BE127'); //to BE12 7___ ____ ____

                    expect(iceCaret.setPosition).toHaveBeenCalledWith(ELEMENT_0, 6); // positioned after the 7
                });

                it('to before the previous [-] or [ ] when a character was removed and if the previous position is a [-] or [ ]', function() {
                    parser('BE127'); //to BE12 7___ ____ ____
                    iceCaret.setPosition.calls.reset();

                    parser('BE12'); //to BE12 ____ ____ ____

                    expect(iceCaret.setPosition).toHaveBeenCalledWith(ELEMENT_0, 4); // positioned  after the 2
                });
            });
        });
    });

    describe('for Model to View/DOM update:', function() {
        describe('the bank account number formatter', function() {
            var formatter;

            beforeEach(function() {
                formatter = ngModelController.$formatters[0];
            });

            it('is added to the beginning of the array', function() {
                expect(ngModelController.$formatters.length).toBe(2);
                expect(ngModelController.$formatters[1]()).toBe('otherFormatter');
            });

            it('returns the formatted bban if input an unformatted bban value', function() {
                expect(formatter('12312')).toBe('123-12_____-__');
                expect(formatter('123123456712')).toBe('123-1234567-12');

                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('12312');
                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('123123456712');
            });

            it('returns the formatted iban if input an unformatted iban value', function() {
                expect(formatter('BE12123')).toBe('BE12 123_ ____ ____');
                expect(formatter('BE12123412341234')).toBe('BE12 1234 1234 1234');

                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('BE12123');
                expect(iceBankAccountFormatter.filterAndFormat).toHaveBeenCalledWith('BE12123412341234');
            });
        });
    });

});
