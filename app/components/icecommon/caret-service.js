'use strict';

angular
    .module('ice.common')
    .factory('iceCaret', function iceCaretFactory() {

        var setPosition = function(element, caretPos) {
            element.value = element.value;
            // this is used to not only get "focus", but to make sure we don't have it everything -selected-
            // (it causes an issue in chrome, and having it doesn't hurt any other browser)

            if (element.createTextRange) {
                var range = element.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;

            } else {
                // also check for element.selectionStart === 0 because in firefox the
                // selectionStart is starting at 0, which in boolean turns to False
                if (element.selectionStart || element.selectionStart === 0) {
                    element.focus();
                    element.setSelectionRange(caretPos, caretPos);
                    return true;

                } else { // should never come here
                    element.focus();
                    return false;
                }
            }
        };

        var setPositionToEnd = function(element) {
            var valueLength = element.value.length;
            return this.setPosition(element, valueLength);
        };

        return {
            setPosition: setPosition,
            setPositionToEnd: setPositionToEnd
        };
    });
