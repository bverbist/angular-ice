'use strict';

describe('iceCaret:', function() {

    var iceCaret;

    beforeEach(module('ice.common'));

    beforeEach(function() {
        iceCaret = iceUnitTester.inject('iceCaret');
    });

    describe('setPosition():', function() {
        var element;

        beforeEach(function() {
            element = {
                value: '12345',
                focus: function() {}
            };

            spyOn(element, 'focus').and.callThrough();
        });

        describe('if input element has createTextRange:', function() {
            var range;

            beforeEach(function() {
                range = {
                    move: function() {},
                    select: function() {}
                };
                element.createTextRange = function() {
                    return range;
                };
            });

            it('creates a text range on the element + moves the character to the wanted position on it + selects it', function() {
                spyOn(element, 'createTextRange').and.callThrough();
                spyOn(range, 'move').and.callThrough();
                spyOn(range, 'select').and.callThrough();

                iceCaret.setPosition(element, 3);

                expect(element.focus).not.toHaveBeenCalled();
                expect(element.createTextRange).toHaveBeenCalled();
                expect(range.move).toHaveBeenCalledWith('character', 3);
                expect(range.select).toHaveBeenCalled();
            });

            it('returns true (setting position was a success)', function() {
                expect(iceCaret.setPosition(element, 3)).toEqual(true);
            });
        });

        describe('if input element does not have createTextRange but has selectionStart:', function() {
            beforeEach(function() {
                element.selectionStart = 3;
                element.setSelectionRange = function() {};

                spyOn(element, 'setSelectionRange').and.callThrough();
            });

            it('focuses the element + sets selectionRange with the start and end position equal to the wanted position', function() {
                iceCaret.setPosition(element, 4);

                expect(element.focus).toHaveBeenCalled();
                expect(element.setSelectionRange).toHaveBeenCalledWith(4, 4);
            });

            it('also in this case if selectionStart equals 0', function() {
                element.selectionStart = 0;

                iceCaret.setPosition(element, 2);

                expect(element.focus).toHaveBeenCalled();
                expect(element.setSelectionRange).toHaveBeenCalledWith(2, 2);
            });

            it('returns true (setting position was a success)', function() {
                expect(iceCaret.setPosition(element, 2)).toEqual(true);
            });
        });

        describe('if input element does not have createTextRange and not selectionStart (unexpected):', function() {
            it('focuses the element', function() {
                iceCaret.setPosition(element, 4);

                expect(element.focus).toHaveBeenCalled();
            });

            it('returns false (setting position was NOT a success)', function() {
                expect(iceCaret.setPosition(element, 2)).toEqual(false);
            });
        });
    });

    describe('setPositionToEnd()', function() {
        it('sets the caret position of the input element to the end of the text', function() {
            spyOn(iceCaret, 'setPosition').and.returnValue(true);
            var element = {
                value: 'abcdefg'
            };
            expect(element.value.length).toEqual(7);

            var actual = iceCaret.setPositionToEnd(element);

            expect(iceCaret.setPosition).toHaveBeenCalledWith(element, 7);
            expect(actual).toEqual(true);
        });
    });

});