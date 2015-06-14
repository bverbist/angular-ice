'use strict';

/**
 * USAGE:
 *   <input type="text" ng-model="someModelVar" ng-trim="false" ice-bank-account-number ...
 */

angular
    .module('ice.bank')
    .directive('iceBankAccountNumber', function(iceStringUtils, iceCaret, iceBankAccountFormatter) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    // do nothing if no ng-model
                    return;
                }

                var ALLOWED_CHARS_IBAN = '0-9A-Z';

                function getPositionWhereCursorShouldGo(oldValue, newValue) {
                    function getPositionOfFirstUnderscore() {
                        var index = newValue.indexOf('_');
                        if (index > -1) {
                            return index;
                        }
                        return newValue.length;
                    }

                    function isIndexCharACharAddedForFormatting(index) {
                        if (typeof charsNewVal[index] !== 'undefined') {
                            if (charsNewVal[index] === '-' || charsNewVal[index] === ' ') {
                                return true;
                            }
                        }
                        return false;
                    }

                    var charsOldVal = oldValue.split('');
                    var charsNewVal = newValue.split('');

                    var unformattedOldVal = iceStringUtils.onlyKeepAllowedChars(oldValue, ALLOWED_CHARS_IBAN);
                    var unformattedNewVal = iceStringUtils.onlyKeepAllowedChars(newValue, ALLOWED_CHARS_IBAN);

                    for (var i = 0; i < charsNewVal.length; i++) {
                        if (i >= charsOldVal.length || charsNewVal[i] !== charsOldVal[i]) {
                            if (unformattedNewVal.length >= unformattedOldVal.length) {
                                // when adding
                                if (isIndexCharACharAddedForFormatting(i + 1)) {
                                    // go behind next char if that is a [ ] or [-]
                                    return i + 2;
                                }
                                // go behind added char
                                return i + 1;
                            } else {
                                // when removing
                                if (isIndexCharACharAddedForFormatting(i - 1)) {
                                    // go before previous char if that is a [ ] or [-]
                                    return i - 1;
                                }
                                // go before removed char
                                return i;
                            }
                        }
                    }

                    return getPositionOfFirstUnderscore();
                }

                var oldVal = '';

                // for View/DOM to Model update
                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    var reformatted = iceBankAccountFormatter.filterAndFormat(viewValue);
                    var positionCursor = getPositionWhereCursorShouldGo(oldVal, reformatted);

                    if (reformatted !== viewValue) {
                        // in this case render needed - remark: that will cause the cursor to jump to the end
                        ngModelCtrl.$setViewValue(reformatted);
                        ngModelCtrl.$render();

                        iceCaret.setPosition(element[0], positionCursor);
                    }

                    oldVal = reformatted;

                    return reformatted;
                });

                // for Model to View/DOM update
                ngModelCtrl.$formatters.unshift(function(value) {
                    oldVal = iceBankAccountFormatter.filterAndFormat(value);
                    return oldVal;
                });
            }
        };
    });
