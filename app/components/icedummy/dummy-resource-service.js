'use strict';

angular
    .module('ice.dummy')
    .factory('iceDummyResource', function iceDummyResourceFactory($http, $resource) {
        var TIMEOUT_IN_MILLIS = 2000; //= 2 sec

        var getCurrentWeather = function(cityName, countryCode) {
            return $http({
                method: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + countryCode,
                responseType: 'json',
                timeout: TIMEOUT_IN_MILLIS
            });
        };

        var getCurrentWeatherResource = function() {
            return $resource('http://api.openweathermap.org/data/2.5/weather?q=:cityName,:countryCode');
        };

        var githubResource = $resource('https://api.github.com/users/:username/repos');

        var getGithubReposOfUser = function(username, successCallback, errorCallback) {
            return githubResource.query(
                {
                    username: username
                },
                successCallback,
                errorCallback
            );
        };

        return {
            getCurrentWeather: getCurrentWeather,
            getCurrentWeatherResource: getCurrentWeatherResource,
            githubResource: githubResource,
            getGithubReposOfUser: getGithubReposOfUser
        };
    });
