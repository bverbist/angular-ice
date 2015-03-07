'use strict';

describe('iceDummyResource:', function() {

    var iceDummyResource, $httpBackend;

    beforeEach(function() {
        iceDummyResource = iceUnit.builder
            .service('ice.dummy', 'iceDummyResource').build();

        $httpBackend = iceUnit.inject('$httpBackend');
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

    describe('getCurrentWeatherResource()', function() {
        it('returns a $resource with get/save/query/remove/delete functions + calling its get() function does a rest call that returns (amongst others) a promise', function() {
            var actual = iceDummyResource.getCurrentWeatherResource();

            expect(actual.get).toBeDefined();
            expect(actual.save).toBeDefined();
            expect(actual.query).toBeDefined();
            expect(actual.remove).toBeDefined();
            expect(actual.delete).toBeDefined();

            $httpBackend
                .expectGET('http://api.openweathermap.org/data/2.5/weather?q=Leuven,be', verifyHeaders)
                .respond(200, {});

            var getResultRef = actual.get({
                cityName: 'Leuven',
                countryCode: 'be'
            });

            expect(angular.isObject(getResultRef)).toBe(true);
            expect(angular.isArray(getResultRef)).toBe(false);

            expect(getResultRef.$save).toBeDefined();
            expect(getResultRef.$remove).toBeDefined();
            expect(getResultRef.$delete).toBeDefined();

            expect(getResultRef.$promise).toBeDefined();
            expect(getResultRef.$promise.then).toBeDefined();

            expect(getResultRef.$resolved).toBeDefined();
            expect(getResultRef.$resolved).toBe(false);

            $httpBackend.flush();

            $httpBackend
                .expectGET('http://api.openweathermap.org/data/2.5/weather?q=Leuven,be', verifyHeaders)
                .respond(200, []);

            var queryResultRef = actual.query({
                cityName: 'Leuven',
                countryCode: 'be'
            });

            expect(angular.isArray(queryResultRef)).toBe(true);

            expect(queryResultRef.$save).toBeUndefined();
            expect(queryResultRef.$remove).toBeUndefined();
            expect(queryResultRef.$delete).toBeUndefined();

            expect(queryResultRef.$promise).toBeDefined();
            expect(queryResultRef.$promise.then).toBeDefined();

            expect(queryResultRef.$resolved).toBeDefined();
            expect(queryResultRef.$resolved).toBe(false);

            $httpBackend.flush();
        });
    });

    describe('getGithubReposOfUser()', function() {
        it('calls the query function on the $resource + returns (amongst others) a promise', function() {
            $httpBackend
                .expectGET('https://api.github.com/users/bverbist/repos', verifyHeaders)
                .respond(200, []);
            spyOn(iceDummyResource.githubResource, 'query').and.callThrough();

            var actual = iceDummyResource.getGithubReposOfUser('bverbist');

            expect(angular.isArray(actual)).toBe(true);
            expect(actual.length).toBe(0);

            expect(actual.$promise).toBeDefined();
            expect(actual.$promise.then).toBeDefined();

            expect(actual.$resolved).toBeDefined();
            expect(actual.$resolved).toBe(false);

            expect(iceDummyResource.githubResource.query).toHaveBeenCalled();

            $httpBackend.flush();
        });
    });

});
