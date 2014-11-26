'use strict';

describe('iceDummy:', function() {

    describe('test by using custom mock:', function() {
        var getCurrentWeatherCallBacker = {};

        var iceDummyResourceMock = {
            getCurrentWeather: iceUnitTester.getHttpPromiseMock(getCurrentWeatherCallBacker)
        };

        var logMock = {
            info: function() {},
            error: function() {}
        };

        var iceDummy;

        beforeEach(function() {
            iceDummy = iceUnitTester
                .serviceBuilder('ice.dummy', 'iceDummy')
                .withMock('iceDummyResource', iceDummyResourceMock)
                .withMock('$log', logMock)
                .build();

            spyOn(iceDummyResourceMock, 'getCurrentWeather').and.callThrough();
            spyOn(logMock, 'info').and.callThrough();
            spyOn(logMock, 'error').and.callThrough();
        });

        it('logs current temperature as info on success', function() {
            iceDummy.logCurrentWeather();

            expect(iceDummyResourceMock.getCurrentWeather).toHaveBeenCalledWith('Leuven', 'be');

            getCurrentWeatherCallBacker.success(validCurrentWeather);

            expect(logMock.info).toHaveBeenCalledWith('current weather: 123');
        });

        it('logs error message on failure', function() {
            iceDummy.logCurrentWeather();

            getCurrentWeatherCallBacker.error('backend down', 404);

            expect(logMock.error).toHaveBeenCalledWith('getCurrentWeather failed - status: 404 - data: backend down');
        });
    });

    describe('test by using jasmine mock:', function() {
        var promiseCallBacker = {};

        var iceDummyResource, $log;

        var iceDummy;

        beforeEach(function() {
            iceDummy = iceUnitTester
                .serviceBuilder('ice.dummy', 'iceDummy')
                .build();

            iceDummyResource = iceUnitTester.inject('iceDummyResource');
            $log = iceUnitTester.inject('$log');

            spyOn(iceDummyResource, 'getCurrentWeather').and.callFake(iceUnitTester.getHttpPromiseMock(promiseCallBacker));
            spyOn($log, 'info').and.stub();
            spyOn($log, 'error').and.stub();
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