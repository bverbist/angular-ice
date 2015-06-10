'use strict';

describe('iceDummy:', function() {

    describe('test by using custom mock + spyOn another service before instantiating your service (to test service calls during instantiation):', function() {
        var getCurrentWeatherCallBacker = {};
        var currentWeatherResourceCallBacker = {};
        var getGithubReposOfUserCallBacker = {};

        var iceDummyResourceMock = {
            getCurrentWeather: iceUnit.mock.$httpPromise(getCurrentWeatherCallBacker),
            currentWeatherResource: iceUnit.builder.$resourceMock(currentWeatherResourceCallBacker).build(),
            getGithubReposOfUser: iceUnit.builder.$resourceActionMock('query', getGithubReposOfUserCallBacker).acceptsPayload(false).returnsArray(true).build()
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
            spyOn(iceDummyResourceMock.currentWeatherResource, 'save').and.callThrough();
            spyOn(iceDummyResourceMock.currentWeatherResource, 'get').and.callThrough();
            spyOn(iceDummyResourceMock, 'getGithubReposOfUser').and.callThrough();

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

                var argsGetCall = iceDummyResourceMock.currentWeatherResource.get.calls.mostRecent().args;

                expect(argsGetCall[0].cityName).toBe('Leuven');
                expect(argsGetCall[0].countryCode).toBe('be');
            });

            it('is populated with the return data on success', function() {
                var successValue = {
                    someField: 'some data'
                };

                currentWeatherResourceCallBacker.get.success(successValue);

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

                currentWeatherResourceCallBacker.get.error(errorHttpResponse);

                expect(iceDummy.currentWeatherByReferenceObject.errorData).toBe('some error reason');
                expect(iceDummy.currentWeatherByReferenceObject.errorStatus).toBe(400);

                expect(iceDummy.currentWeatherByReferenceObject.someField).toBeUndefined();
                expect(iceDummy.currentWeatherByReferenceObject.$resolved).toBe(true);
            });
        });

        describe('var currentWeatherSave:', function() {
            it('also postData passed in save call (vs. get)', function() {
                expect(iceDummy.currentWeatherSave.$promise).toBeDefined();
                expect(iceDummy.currentWeatherSave.$resolved).toBe(false);
                expect(iceDummy.currentWeatherSave.someField).toBeUndefined();

                expect(angular.isObject(iceDummy.currentWeatherSave)).toBe(true);
                expect(angular.isArray(iceDummy.currentWeatherSave)).toBe(false);

                var argsSaveCall = iceDummyResourceMock.currentWeatherResource.save.calls.mostRecent().args;

                expect(argsSaveCall[0].cityName).toBe('Leuven');
                expect(argsSaveCall[0].countryCode).toBe('be');

                expect(argsSaveCall[1].saveField).toBe('save value');
            });

            it('is populated with the return data on success', function() {
                var successValue = {
                    someField: 'some data'
                };

                currentWeatherResourceCallBacker.save.success(successValue);

                expect(iceDummy.currentWeatherSave.someField).toBe('some data');
                expect(iceDummy.currentWeatherSave.promiseReturnedOk).toBe(true);
                expect(iceDummy.currentWeatherSave.$resolved).toBe(true);

                expect(iceDummy.currentWeatherSave.errorData).toBeUndefined();
                expect(iceDummy.currentWeatherSave.errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                currentWeatherResourceCallBacker.save.error(errorHttpResponse);

                expect(iceDummy.currentWeatherSave.errorData).toBe('some error reason');
                expect(iceDummy.currentWeatherSave.errorStatus).toBe(400);

                expect(iceDummy.currentWeatherSave.someField).toBeUndefined();
                expect(iceDummy.currentWeatherSave.$resolved).toBe(true);
            });
        });

        describe('var currentWeatherNew:', function() {
            it('is an instance object', function() {
                expect(iceDummy.getCurrentWeatherNew().$save).toBeDefined();
                expect(iceDummy.getCurrentWeatherNew().$remove).toBeDefined();
                expect(iceDummy.getCurrentWeatherNew().$delete).toBeDefined();

                expect(iceDummy.getCurrentWeatherNew().someField).toBeUndefined();
            });

            it('is populated with the return data on $save success', function() {
                iceDummy.doCurrentWeatherNewSave();

                expect(iceDummy.getCurrentWeatherNew().someField).toBeUndefined();
                var successValue = {
                    someField: 'some data'
                };

                currentWeatherResourceCallBacker.$save.success(successValue);

                expect(iceDummy.getCurrentWeatherNew().someField).toBe('some data');
                expect(iceDummy.getCurrentWeatherNew().promiseReturnedOk).toBe(true);

                expect(iceDummy.getCurrentWeatherNew().errorData).toBeUndefined();
                expect(iceDummy.getCurrentWeatherNew().errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                iceDummy.doCurrentWeatherNewSave();

                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                currentWeatherResourceCallBacker.$save.error(errorHttpResponse);

                expect(iceDummy.getCurrentWeatherNew().errorData).toBe('some error reason');
                expect(iceDummy.getCurrentWeatherNew().errorStatus).toBe(400);

                expect(iceDummy.getCurrentWeatherNew().someField).toBeUndefined();
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

                currentWeatherResourceCallBacker.get.success(successValue);

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

                currentWeatherResourceCallBacker.get.error(errorHttpResponse);

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

                currentWeatherResourceCallBacker.get.success(successValue);

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

                currentWeatherResourceCallBacker.get.error(errorHttpResponse);

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

                var argsGetCall = iceDummyResourceMock.getGithubReposOfUser.calls.mostRecent().args;
                expect(argsGetCall[0]).toBe('bverbist');
            });

            it('is populated with the return data on success + each elem is instance object', function() {
                var successValue = [
                    { someField: 'some data' },
                    { someField: 'other data' }
                ];

                getGithubReposOfUserCallBacker.query.success(successValue);

                expect(iceDummy.githubReposOfUser.length).toBe(2);
                expect(iceDummy.githubReposOfUser.promiseReturnedOk).toBe(true);
                expect(iceDummy.githubReposOfUser.$resolved).toBe(true);

                expect(iceDummy.githubReposOfUser[0].$save).toBeDefined();
                expect(iceDummy.githubReposOfUser[0].$remove).toBeDefined();
                expect(iceDummy.githubReposOfUser[0].$delete).toBeDefined();
                expect(iceDummy.githubReposOfUser[1].$save).toBeDefined();
                expect(iceDummy.githubReposOfUser[1].$remove).toBeDefined();
                expect(iceDummy.githubReposOfUser[1].$delete).toBeDefined();

                expect(iceDummy.githubReposOfUser.errorData).toBeUndefined();
                expect(iceDummy.githubReposOfUser.errorStatus).toBeUndefined();
            });

            it('takes the httpResponse data & status on error', function() {
                var errorHttpResponse = {
                    data: 'some error reason',
                    status: 400
                };

                getGithubReposOfUserCallBacker.query.error(errorHttpResponse);

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
