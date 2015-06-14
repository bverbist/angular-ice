(function() {
'use strict';
angular
    .module('ice.common', []);

angular
    .module('ice.forms', [
        'ice.common'
    ]);

angular
    .module('ice.bank', [
        'ice.common'
    ]);

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
    .module('ice.common')
    .factory('iceStorage', ['$window', function iceStorageFactory($window) {

        var setupWebStorage = function(storageType) {
            var webStorage = {
                type: storageType
            };

            webStorage.isSupported = function() {
                return (typeof $window[webStorage.type] !== 'undefined');
            };

            webStorage.set = function(key, value) {
                $window[webStorage.type].setItem(key, value);
            };
            webStorage.setObject = function(key, value) {
                $window[webStorage.type].setItem(key, angular.toJson(value));
            };

            webStorage.get = function(key) {
                return $window[webStorage.type].getItem(key);
            };
            webStorage.getObject = function(key) {
                return angular.fromJson($window[webStorage.type].getItem(key));
            };

            webStorage.remove = function(key) {
                $window[webStorage.type].removeItem(key);
            };

            return webStorage;
        };

        return {
            local: setupWebStorage('localStorage'),
            session: setupWebStorage('sessionStorage')
        };
    }]);

angular
    .module('ice.common')
    .factory('iceStringUtils', function iceStringUtilsFactory() {

        var onlyKeepAllowedChars = function(inputString, allowedCharacters) {
            var regexAllowedChars = new RegExp('^[' + allowedCharacters + ']$');

            function isAllowedCharacter(s) {
                return s.search(regexAllowedChars) > -1;
            }

            var inputCharacters = inputString.split('');
            inputCharacters = inputCharacters.filter(isAllowedCharacter);
            return inputCharacters.join('');
        };

        var adjustToMaxNrOfChars = function(inputString, maxNrOfChars) {
            return inputString.substr(0, maxNrOfChars);
        };

        return {
            onlyKeepAllowedChars: onlyKeepAllowedChars,
            adjustToMaxNrOfChars: adjustToMaxNrOfChars
        };
    });

angular
    .module('ice.common')
    .factory('iceUndefined', function iceUndefinedFactory() {

        var isUndefined = function(input) {
            return (typeof input === 'undefined');
        };

        var isNull = function(input) {
            return (input === null);
        };

        var setIfUndefinedOrNull = function(input, valueIfUndefined) {
            if (this.isUndefined(input) || this.isNull(input)) {
                return valueIfUndefined;
            }
            return input;
        };

        return {
            isUndefined: isUndefined,
            isNull: isNull,
            setIfUndefinedOrNull: setIfUndefinedOrNull
        };
    });

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
angular
    .module('ice.bank')
    .factory('iceBankAccountFormatter', ['iceUndefined', 'iceStringUtils', function iceBankAccountFormatterFactory(iceUndefined, iceStringUtils) {
        var FORMAT_BBAN = '___-_______-__';
        var FORMAT_IBAN_BE = '____ ____ ____ ____';
        var FORMAT_IBAN_INT = '____ ____ ____ ____ ____ ____ ____ ____ __';

        var ALLOWED_CHARS_BBAN = '0-9';
        var ALLOWED_CHARS_IBAN = '0-9A-Z';

        var MAX_CHARS_BBAN = 12;
        var MAX_CHARS_IBAN_BE = 16;
        var MAX_CHARS_IBAN_INT = 34;

        var isIBAN = function(input) {
            return input.search(/^[a-zA-Z]+.*$/) > -1;
        };

        var isBelgianIBAN = function(input) {
            return input.search(/^BE.*$/) > -1;
        };

        function filterCharsIBAN(input) {
            var filtered = input.toUpperCase();
            filtered = iceStringUtils.onlyKeepAllowedChars(filtered, ALLOWED_CHARS_IBAN);
            return filtered;
        }

        function filterCharsBBAN(input) {
            return iceStringUtils.onlyKeepAllowedChars(input, ALLOWED_CHARS_BBAN);
        }

        function addSpaceAfterEachIbanGroup(input) {
            var formatted = '';
            for (var i = 0; i < input.length; i++) {
                if (i !== 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += input.charAt(i);
            }
            return formatted;
        }

        function addDashAfterEachBbanGroup(input) {
            var formatted = '';
            for (var i = 0; i < input.length; i++) {
                if (i === 3 || i === 10) {
                    formatted += '-';
                }
                formatted += input.charAt(i);
            }
            return formatted;
        }

        function addCharsToMatchFormat(input, format) {
            if (input !== '' && input.length < format.length) {
                input += format.substr(input.length);
            }
            return input;
        }

        function getMaxNrOfCharsIBAN(input) {
            if (isBelgianIBAN(input)) {
                return MAX_CHARS_IBAN_BE;
            }
            return MAX_CHARS_IBAN_INT;
        }

        function getFormatIBAN(input, optionalInternationalIbanFormat) {
            if (isBelgianIBAN(input)) {
                return FORMAT_IBAN_BE;
            }
            return (optionalInternationalIbanFormat || FORMAT_IBAN_INT);
        }

        function formatIBAN(input, optionalInternationalIbanFormat) {
            var formatted = iceStringUtils.adjustToMaxNrOfChars(input, getMaxNrOfCharsIBAN(input));
            formatted = addSpaceAfterEachIbanGroup(formatted);
            formatted = addCharsToMatchFormat(formatted, getFormatIBAN(formatted, optionalInternationalIbanFormat));
            return formatted;
        }

        function formatBBAN(input) {
            var formatted = iceStringUtils.adjustToMaxNrOfChars(input, MAX_CHARS_BBAN);
            formatted = addDashAfterEachBbanGroup(formatted);
            formatted = addCharsToMatchFormat(formatted, FORMAT_BBAN);
            return formatted;
        }

        var filterAndFormat = function(bankAccountNr, optionalInternationalIbanFormat) {
            var reformatted = iceUndefined.setIfUndefinedOrNull(bankAccountNr, '');

            if (this.isIBAN(reformatted)) {
                reformatted = filterCharsIBAN(reformatted);
                return formatIBAN(reformatted, optionalInternationalIbanFormat);
            }

            reformatted = filterCharsBBAN(reformatted);
            return formatBBAN(reformatted);
        };

        return {
            isIBAN: isIBAN,
            isBelgianIBAN: isBelgianIBAN,
            filterAndFormat: filterAndFormat
        };
    }]);

/**
 * USAGE:
 *   <input type="text" ng-model="someModelVar" ng-trim="false" ice-bank-account-number ...
 */

angular
    .module('ice.bank')
    .directive('iceBankAccountNumber', ['iceStringUtils', 'iceCaret', 'iceBankAccountFormatter', function(iceStringUtils, iceCaret, iceBankAccountFormatter) {
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
    }]);

})();