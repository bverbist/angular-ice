'use strict';

angular
    .module('ice.dummy')
    .factory('iceDummy', function iceDummyFactory(iceDummyResource, $log) {
        var CITY_NAME = 'Leuven';
        var COUNTRY_CODE = 'be';

        $log.info('iceDummy created');

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

        var logCurrentWeatherWithoutSuccessCallback = function() {
            iceDummyResource
                .getCurrentWeather(CITY_NAME, COUNTRY_CODE)
                .error(function(data, status) {
                    $log.error('getCurrentWeather failed - status: ' + status + ' - data: ' + data);
                });
        };

        var currentWeatherByReferenceObject = iceDummyResource.currentWeatherResource.get({
            cityName: CITY_NAME,
            countryCode: COUNTRY_CODE
        }, function successCallback() {
            currentWeatherByReferenceObject.promiseReturnedOk = true;
        }, function errorCallback(httpResponse) {
            currentWeatherByReferenceObject.errorData = httpResponse.data;
            currentWeatherByReferenceObject.errorStatus = httpResponse.status;
        });
        var doCurrentWeatherByReferenceObjectDelete = function() {
            currentWeatherByReferenceObject.$delete();
        };

        var currentWeatherSave = iceDummyResource.currentWeatherResource.save({
            cityName: CITY_NAME,
            countryCode: COUNTRY_CODE
        }, {
            saveField: 'save value'
        }, function successCallback() {
            currentWeatherSave.promiseReturnedOk = true;
        }, function errorCallback(httpResponse) {
            currentWeatherSave.errorData = httpResponse.data;
            currentWeatherSave.errorStatus = httpResponse.status;
        });

        var currentWeatherNew = new iceDummyResource.currentWeatherResource();
        var getCurrentWeatherNew = function() {
            return currentWeatherNew;
        };
        var doCurrentWeatherNewSave = function() {
            currentWeatherNew.$save({
                cityName: CITY_NAME,
                countryCode: COUNTRY_CODE
            }, function successCallback(value) {
                currentWeatherNew = value;
                currentWeatherNew.promiseReturnedOk = true;
            }, function errorCallback(httpResponse) {
                currentWeatherNew.errorData = httpResponse.data;
                currentWeatherNew.errorStatus = httpResponse.status;
            });
        };

        var currentWeatherByCallBack = {};
        var getCurrentWeatherByCallBack = function() {
            return currentWeatherByCallBack;
        };
        var doCurrentWeatherByCallBack = function() {
            iceDummyResource.currentWeatherResource.get({
                cityName: CITY_NAME,
                countryCode: COUNTRY_CODE
            }, function successCallback(value) {
                currentWeatherByCallBack = value;
                currentWeatherByCallBack.promiseReturnedOk = true;
            }, function errorCallback(httpResponse) {
                currentWeatherByCallBack.errorData = httpResponse.data;
                currentWeatherByCallBack.errorStatus = httpResponse.status;
            });
        };

        var currentWeatherByPromise = {};
        var getCurrentWeatherByPromise = function() {
            return currentWeatherByPromise;
        };
        var doCurrentWeatherByPromise = function() {
            iceDummyResource.currentWeatherResource.get({
                cityName: CITY_NAME,
                countryCode: COUNTRY_CODE
            }).$promise.then(function successCallback(value) {
                    currentWeatherByPromise = value;
                    currentWeatherByPromise.promiseReturnedOk = true;
                }, function errorCallback(httpResponse) {
                    currentWeatherByPromise.errorData = httpResponse.data;
                    currentWeatherByPromise.errorStatus = httpResponse.status;
                });
        };

        var githubReposOfUser = iceDummyResource.getGithubReposOfUser(
            'bverbist',
            function successCallback() {
                githubReposOfUser.promiseReturnedOk = true;
            },
            function errorCallback(httpResponse) {
                githubReposOfUser.errorData = httpResponse.data;
                githubReposOfUser.errorStatus = httpResponse.status;
            }
        );

        return {
            logCurrentWeather: logCurrentWeather,
            logCurrentWeatherWithoutSuccessCallback: logCurrentWeatherWithoutSuccessCallback,
            currentWeatherByReferenceObject: currentWeatherByReferenceObject,
            doCurrentWeatherByReferenceObjectDelete: doCurrentWeatherByReferenceObjectDelete,
            currentWeatherSave: currentWeatherSave,
            getCurrentWeatherNew: getCurrentWeatherNew,
            doCurrentWeatherNewSave: doCurrentWeatherNewSave,
            getCurrentWeatherByCallBack: getCurrentWeatherByCallBack,
            doCurrentWeatherByCallBack: doCurrentWeatherByCallBack,
            getCurrentWeatherByPromise: getCurrentWeatherByPromise,
            doCurrentWeatherByPromise: doCurrentWeatherByPromise,
            githubReposOfUser: githubReposOfUser
        };
    });
