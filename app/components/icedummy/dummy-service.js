'use strict';

angular
    .module('ice.dummy')
    .factory('iceDummy', function iceDummyFactory(iceDummyResource, $log) {
        var CITY_NAME = 'Leuven';
        var COUNTRY_CODE = 'be';

        var logCurrentWeather = function() {
            iceDummyResource
                .getCurrentWeather(CITY_NAME, COUNTRY_CODE)
                .success(function(data) {
                    $log.info('current weather: ' + data.main.temp);
                })
                .error(function(data, status) {
                    $log.error('getCurrentWeather failed - status: ' + status + ' - data: ' + data);
                });
        };

        return {
            logCurrentWeather: logCurrentWeather
        };
    });