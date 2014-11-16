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
                var isElementSelected = false;

                function selectElementWorksAlsoOnIOS(element, selectionStart, selectionEnd) {
                    if (element.setSelectionRange) {
                        element.setSelectionRange(selectionStart, selectionEnd);
                    }
                }

                element.on(selectEvent, function() {
                    if (!isElementSelected) {
                        this.select();
                        selectElementWorksAlsoOnIOS(this, SELECTION_RANGE_START, SELECTION_RANGE_END);
                        isElementSelected = true;
                    }
                });

                element.on(deselectEvent, function() {
                    isElementSelected = false;
                    selectElementWorksAlsoOnIOS(this, 0, 0);
                });
            }
        };
    }]);
})();