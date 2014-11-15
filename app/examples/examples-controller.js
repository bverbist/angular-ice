'use strict';

angular.module('angularIceApp')
    .controller('ExamplesCtrl',
		function ($scope) {
            $scope.model = {
                autoSelectDefault: 'some text',
                autoSelectOtherEvent: 'other text'
            };
		}
    );