'use strict';

describe('iceDummy:', function() {

    var successCallback;
    var errorCallback;

    var iceDummyResourceMock = {
        getCurrentWeather: function() {
            return {
                success: function(functionOnSuccess) {
                    successCallback = functionOnSuccess;

                    return {
                        error: function(functionOnError) {
                            errorCallback = functionOnError;
                        }
                    };
                }
            };
        }
    };

    var logMock = {
        info: function() {},
        error: function() {}
    };

    var iceDummy;

    beforeEach(function() {
        iceDummy = iceUnitTester
            .setupService('iceDummy')
            .ofModule('ice.dummy')
            .withMock('iceDummyResource', iceDummyResourceMock)
            .withMock('$log', logMock)
            .build();
    });

    it('logs current temp as info', function() {
        spyOn(iceDummyResourceMock, 'getCurrentWeather').and.callThrough();
        spyOn(logMock, 'info').and.callThrough();

        iceDummy.logCurrentWeather();

        expect(iceDummyResourceMock.getCurrentWeather).toHaveBeenCalledWith('Leuven', 'be');

        successCallback(validCurrentWeather);

        expect(logMock.info).toHaveBeenCalledWith('current weather: 123');
    });

    var validCurrentWeather = {
        main: {
            temp: 123
        }
    };

});