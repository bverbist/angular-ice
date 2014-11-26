'use strict';

describe('iceDummyResource:', function() {

    var iceDummyResource, $httpBackend;

    beforeEach(function() {
        iceDummyResource = iceUnitTester.serviceBuilder('ice.dummy', 'iceDummyResource').build();

        $httpBackend = iceUnitTester.inject('$httpBackend');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    function verifyHeaders(headers) {
        if (typeof headers === 'undefined') {
            return false;
        }
        return true;
    }

    describe('getCurrentWeather()', function() {
        it('does a rest GET call and returns a promise with a success() and error() function', function() {
            $httpBackend
                .expectGET('http://api.openweathermap.org/data/2.5/weather?q=Leuven,be', verifyHeaders)
                .respond(200, {});

            var httpPromise = iceDummyResource.getCurrentWeather('Leuven', 'be');

            expect(httpPromise.success).toBeDefined();
            expect(httpPromise.error).toBeDefined();

            $httpBackend.flush();
        });
    });

});