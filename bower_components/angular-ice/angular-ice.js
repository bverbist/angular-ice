(function() {
'use strict';
angular
    .module('ice.common', []);
angular
    .module('ice.common')
    .factory('iceDirectiveUtils', function iceDirectiveUtilsFactory() {

        var getAttributeOrDefaultValue = function(attrs, attrToGet, defaultVal) {
            var attrValue = attrs[attrToGet];
            if (typeof attrValue === 'undefined' || attrValue === '') {
                attrValue = defaultVal;
            }
            return attrValue;
        };

        return {
            getAttributeOrDefaultValue: getAttributeOrDefaultValue
        };
    });
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

angular
    .module('ice.forms', [
        'ice.common'
    ]);
angular
    .module('ice.forms')
    .directive('iceAutoSelectContentOn', ['iceDirectiveUtils', function(iceDirectiveUtils) {
        var DEFAULT_SELECT_EVENT = 'click';
        var DEFAULT_DESELECT_EVENT = 'blur';

        var SELECTION_RANGE_START = 0;
        var SELECTION_RANGE_END = 9999;

        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {
                var selectEvent = iceDirectiveUtils.getAttributeOrDefaultValue(attrs, 'iceAutoSelectContentOn', DEFAULT_SELECT_EVENT);
                var deselectEvent = iceDirectiveUtils.getAttributeOrDefaultValue(attrs, 'iceDeselectEvent', DEFAULT_DESELECT_EVENT);
                scope.isElementSelected = false;

                function selectElementWorksAlsoOnIOS(element, selectionStart, selectionEnd) {
                    if (element.setSelectionRange) {
                        element.setSelectionRange(selectionStart, selectionEnd);
                    }
                }

                element.on(selectEvent, function() {
                    if (!scope.isElementSelected) {
                        this.select();
                        selectElementWorksAlsoOnIOS(this, SELECTION_RANGE_START, SELECTION_RANGE_END);
                        scope.isElementSelected = true;
                    }
                });

                element.on(deselectEvent, function() {
                    scope.isElementSelected = false;
                    selectElementWorksAlsoOnIOS(this, 0, 0);
                });
            }
        };
    }]);
})();