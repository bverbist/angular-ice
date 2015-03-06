'use strict';

describe('iceDummy:', function() {

    describe('test by using custom mock + spyOn another service before instantiating your service (to test service calls during instantiation):', function() {
        var getCurrentWeatherCallBacker = {};

        var iceDummyResourceMock = {
            getCurrentWeather: iceUnit.mock.$http(getCurrentWeatherCallBacker)
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
            spyOn(iceDummyResource, 'getCurrentWeather').and.callFake(iceUnit.mock.$http(promiseCallBacker));

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
