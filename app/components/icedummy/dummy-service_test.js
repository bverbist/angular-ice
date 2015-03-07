'use strict';

describe('iceDummy:', function() {

    describe('test by using custom mock + spyOn another service before instantiating your service (to test service calls during instantiation):', function() {
        var getCurrentWeatherCallBacker = {};
        var getCurrentWeatherResourceCallBacker = {};
        var getGithubReposOfUserCallBacker = {};

        var iceDummyResourceMock = {
            getCurrentWeather: iceUnit.mock.$httpPromise(getCurrentWeatherCallBacker),
            getCurrentWeatherResource: iceUnit.builder.$resourceMock(getCurrentWeatherResourceCallBacker).build(),
            getGithubReposOfUser: iceUnit.mock.$resourceAction(true, getGithubReposOfUserCallBacker)
        };

        var iceDummy;
        var $log;

        beforeEach(function() {
            // inject another service which we want to spy on before instantiating our service to test (iceDummy)
            $log = iceUnit.builder
                .service('ice.dummy', '$log')
                .withMock('iceDummyResource', iceDummyResourceMock)
                .build();

            spyOn($log, 'info');
            spyOn($log, 'error');

            spyOn(iceDummyResourceMock, 'getCurrentWeather').and.callThrough();

            iceDummy = iceUnit.inject('iceDummy');
        });

        it('logs message when service is created', function() {
            expect($log.info).toHaveBeenCalledWith('iceDummy created');
        });

        it('logs current temperature as info on success', function() {
            iceDummy.logCurrentWeather();

            expect(iceDummyResourceMock.getCurrentWeather).toHaveBeenCalledWith('Leuven', 'be');

            getCurrentWeatherCallBacker.success(validCurrentWeather);

            expect($log.info).toHaveBeenCalledWith('current weather: 123');
        });

        it('logs error message on failure', function() {
            iceDummy.logCurrentWeather();

            getCurrentWeatherCallBacker.error('backend down', 404);

            expect($log.error).toHaveBeenCalledWith('getCurrentWeather failed - status: 404 - data: backend down');
        });

        describe('var currentWeatherByReferenceObject:', function() {
            it('is an object that only has $promise and $resolved (false) before resource call returns success', function() {
                expect(iceDummy.currentWeatherByReferenceObject.$promise).toBeDefined();
                expect(iceDummy.currentWeatherByReferenceObject.$resolved).toBe(false);
                expect(iceDummy.currentWeatherByReferenceObject.someField).toBeUndefined();

                expect(angular.isObject(iceDummy.currentWeatherByReferenceObject)).toBe(true);
                expect(angular.isArray(iceDummy.currentWeatherByReferenceObject)).toBe(false);
            });

            it('is populated with the return data on success', function() {
                var successValue = {
                    someField: 'some data'
                };

                getCurrentWeatherResourceCallBacker.get.success(successValue);

                expect(iceDummy.currentWeatherByReferenceObject.someField).toBe('some data');
                expect(iceDummy.currentWeatherByReferenceObject.promiseReturnedOk).toBe(true);
                expect(iceDummy.currentWeatherByReferenceObject.$resolved).toBe(true);

                expect(iceDummy.currentWeatherByReferenceObject.errorData).toBeUndefined();
                expect(iceDummy.currentWeatherByReferenceObject.errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                getCurrentWeatherResourceCallBacker.get.error(errorHttpResponse);

                expect(iceDummy.currentWeatherByReferenceObject.errorData).toBe('some error reason');
                expect(iceDummy.currentWeatherByReferenceObject.errorStatus).toBe(400);

                expect(iceDummy.currentWeatherByReferenceObject.someField).toBeUndefined();
                expect(iceDummy.currentWeatherByReferenceObject.$resolved).toBe(true);
            });
        });

        describe('var currentWeatherByCallBack:', function() {
            it('is an empty object before resource call returns success', function() {
                expect(iceDummy.getCurrentWeatherByCallBack()).toBeDefined();
                expect(iceDummy.getCurrentWeatherByCallBack().someField).toBeUndefined();
            });

            it('is populated with the return data on success', function() {
                iceDummy.doCurrentWeatherByCallBack();

                expect(iceDummy.getCurrentWeatherByCallBack().someField).toBeUndefined();
                var successValue = {
                    someField: 'some data'
                };

                getCurrentWeatherResourceCallBacker.get.success(successValue);

                expect(iceDummy.getCurrentWeatherByCallBack().someField).toBe('some data');
                expect(iceDummy.getCurrentWeatherByCallBack().promiseReturnedOk).toBe(true);

                expect(iceDummy.getCurrentWeatherByCallBack().errorData).toBeUndefined();
                expect(iceDummy.getCurrentWeatherByCallBack().errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                iceDummy.doCurrentWeatherByCallBack();

                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                getCurrentWeatherResourceCallBacker.get.error(errorHttpResponse);

                expect(iceDummy.getCurrentWeatherByCallBack().errorData).toBe('some error reason');
                expect(iceDummy.getCurrentWeatherByCallBack().errorStatus).toBe(400);

                expect(iceDummy.getCurrentWeatherByCallBack().someField).toBeUndefined();
            });
        });

        describe('var currentWeatherByPromise:', function() {
            it('is an empty object before resource call returns success', function() {
                expect(iceDummy.getCurrentWeatherByPromise()).toBeDefined();
                expect(iceDummy.getCurrentWeatherByPromise().someField).toBeUndefined();
            });

            it('is populated with the return data on success', function() {
                iceDummy.doCurrentWeatherByPromise();

                expect(iceDummy.getCurrentWeatherByPromise().someField).toBeUndefined();
                var successValue = {
                    someField: 'some data'
                };

                getCurrentWeatherResourceCallBacker.get.success(successValue);

                expect(iceDummy.getCurrentWeatherByPromise().someField).toBe('some data');
                expect(iceDummy.getCurrentWeatherByPromise().promiseReturnedOk).toBe(true);

                expect(iceDummy.getCurrentWeatherByPromise().errorData).toBeUndefined();
                expect(iceDummy.getCurrentWeatherByPromise().errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                iceDummy.doCurrentWeatherByPromise();

                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                getCurrentWeatherResourceCallBacker.get.error(errorHttpResponse);

                expect(iceDummy.getCurrentWeatherByPromise().errorData).toBe('some error reason');
                expect(iceDummy.getCurrentWeatherByPromise().errorStatus).toBe(400);

                expect(iceDummy.getCurrentWeatherByPromise().someField).toBeUndefined();
            });
        });

        describe('var githubReposOfUser:', function() {
            it('is an array that only has $promise and $resolved (false) before resource call returns success', function() {
                expect(iceDummy.githubReposOfUser.$promise).toBeDefined();
                expect(iceDummy.githubReposOfUser.$resolved).toBe(false);
                expect(iceDummy.githubReposOfUser.someField).toBeUndefined();

                expect(angular.isArray(iceDummy.githubReposOfUser)).toBe(true);
                expect(iceDummy.githubReposOfUser.length).toBe(0);
            });

            it('is populated with the return data on success', function() {
                var successValue = [
                    { someField: 'some data' },
                    { someField: 'other data' }
                ];

                getGithubReposOfUserCallBacker.success(successValue);

                expect(iceDummy.githubReposOfUser.length).toBe(2);
                expect(iceDummy.githubReposOfUser.promiseReturnedOk).toBe(true);
                expect(iceDummy.githubReposOfUser.$resolved).toBe(true);

                expect(iceDummy.githubReposOfUser.errorData).toBeUndefined();
                expect(iceDummy.githubReposOfUser.errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                getGithubReposOfUserCallBacker.error(errorHttpResponse);

                expect(iceDummy.githubReposOfUser.errorData).toBe('some error reason');
                expect(iceDummy.githubReposOfUser.errorStatus).toBe(400);

                expect(iceDummy.githubReposOfUser.length).toBe(0);
                expect(iceDummy.githubReposOfUser.$resolved).toBe(true);
            });
        });
    });

    describe('test by using jasmine mock:', function() {
        var promiseCallBacker = {};

        var iceDummyResource, $log;

        var iceDummy;

        beforeEach(function() {
            iceDummy = iceUnit.builder
                .service('ice.dummy', 'iceDummy')
                .build();

            iceDummyResource = iceUnit.inject('iceDummyResource');
            spyOn(iceDummyResource, 'getCurrentWeather').and.callFake(iceUnit.mock.$httpPromise(promiseCallBacker));

            $log = iceUnit.inject('$log');
            spyOn($log, 'info');
            spyOn($log, 'error');
        });

        it('logs current temperature as info on success', function() {
            iceDummy.logCurrentWeather();

            expect(iceDummyResource.getCurrentWeather).toHaveBeenCalledWith('Leuven', 'be');

            promiseCallBacker.success(validCurrentWeather);

            expect($log.info).toHaveBeenCalledWith('current weather: 123');
        });

        it('logs error message on failure', function() {
            iceDummy.logCurrentWeather();

            promiseCallBacker.error('backend down', 404);

            expect($log.error).toHaveBeenCalledWith('getCurrentWeather failed - status: 404 - data: backend down');
        });
    });

    var validCurrentWeather = {
        main: {
            temp: 123
        }
    };

});
