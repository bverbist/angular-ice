'use strict';

angular
    .module('ice.common')
    .factory('iceStorage', function iceStorageFactory($window) {

        var setupWebStorage = function(storageType) {
            var webStorage = {
                type: storageType
            };

            webStorage.isSupported = function() {
                return (typeof $window[webStorage.type] !== 'undefined');
            };

            webStorage.set = function(key, value) {
                $window[webStorage.type].setItem(key, value);
            };
            webStorage.setObject = function(key, value) {
                $window[webStorage.type].setItem(key, angular.toJson(value));
            };

            webStorage.get = function(key) {
                return $window[webStorage.type].getItem(key);
            };
            webStorage.getObject = function(key) {
                return angular.fromJson($window[webStorage.type].getItem(key));
            };

            webStorage.remove = function(key) {
                $window[webStorage.type].removeItem(key);
            };

            return webStorage;
        };

        return {
            local: setupWebStorage('localStorage'),
            session: setupWebStorage('sessionStorage')
        };
    });
