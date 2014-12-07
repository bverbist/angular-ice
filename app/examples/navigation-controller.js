'use strict';

angular.module('angularIceApp')
    .controller('NavigationCtrl',
		function ($scope, $location) {
            $scope.activeTab = {
                installation: false,
                unitTester: false,
                formDirectives: false
            };

            $scope.initFirstActiveTab = function() {
                var currentPathWithoutSlash = $location.path().replace('/', '');
                $scope.activeTab[currentPathWithoutSlash] = true;
            };

            $scope.goTo = function(path) {
                $location.path(path);
            };
		}
    );