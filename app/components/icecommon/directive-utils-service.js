'use strict';

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