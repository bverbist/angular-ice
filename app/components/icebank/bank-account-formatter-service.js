'use strict';

angular
    .module('ice.bank')
    .factory('iceBankAccountFormatter', function iceBankAccountFormatterFactory(iceUndefined, iceStringUtils) {
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
    });
