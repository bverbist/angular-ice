'use strict';

angular.module('angularIceApp')
    .controller('ExamplesCtrl',
		function ($scope, $location, $anchorScroll) {
            $scope.model = {
                autoSelectDefault: 'some text',
                autoSelectOtherEvent: 'other text',
                bankAccountNr: ''
            };

            $scope.helloWorld = function() {
                return 'Hello ICE !';
            };

            $scope.goToAnchor = function(anchorId) {
                $location.hash(anchorId);

                $anchorScroll();
            };
		}
    );
