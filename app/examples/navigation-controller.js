'use strict';

angular.module('angularIceApp')
    .controller('NavigationCtrl',
		function ($scope, $location) {
            $scope.goTo = function(path) {
                $location.path(path);
            };
		}
    );