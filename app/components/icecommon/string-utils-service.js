'use strict';

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
