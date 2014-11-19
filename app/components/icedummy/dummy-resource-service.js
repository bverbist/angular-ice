'use strict';

angular
    .module('ice.dummy')
    .factory('iceDummyResource', function iceDummyResourceFactory($http) {
        var TIMEOUT_IN_MILLIS = 2000; //= 2 sec

        var getCurrentWeather = function(cityName, countryCode) {
            return $http({
                method: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + countryCode,
                responseType: 'json',
                timeout: TIMEOUT_IN_MILLIS
            });
        };

        return {
            getCurrentWeather: getCurrentWeather
        };
    });