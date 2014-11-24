'use strict';

angular
    .module('ice.forms')
    .directive('iceAutoSelectContentOn', function(iceDirectiveUtils) {
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
    });