'use strict';

angular.module('angularIceApp')
    .controller('ExamplesCtrl',
		function ($location, $anchorScroll) {
            var vm = this;

            vm.model = {
                autoSelectDefault: 'some text',
                autoSelectOtherEvent: 'other text',
                bankAccountNr: ''
            };

            vm.helloWorld = function() {
                return 'Hello ICE !';
            };

            vm.goToAnchor = function(anchorId) {
                $location.hash(anchorId);

                $anchorScroll();
            };
		}
    );
