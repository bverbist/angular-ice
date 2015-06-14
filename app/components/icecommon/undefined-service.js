'use strict';

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
