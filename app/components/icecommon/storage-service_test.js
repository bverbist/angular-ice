'use strict';

describe('iceStorage:', function() {

    var iceStorage;
    var $window;

    beforeEach(function() {
        iceStorage = iceUnit
            .serviceBuilder('ice.common', 'iceStorage')
            .build();

        $window = iceUnit.inject('$window');
    });

    beforeEach(function() {
        jasmine.addMatchers({
            toEqualData: function() {
                return {
                    compare: function(actual, expected) {
                        var result = {};
                        result.pass = angular.equals(actual, expected);
                        return result;
                    }
                };
            }
        });
    });

    describe('local:', function() {
        it('isSupported() returns only true if localStorage supported by browser', function() {
            expect(iceStorage.local.isSupported()).toBe(true);
        });

        it('set() stores the input value in localStorage with the input key', function() {
            spyOn($window.localStorage, 'setItem');

            iceStorage.local.set('someKey', 'some value');

            expect($window.localStorage.setItem).toHaveBeenCalledWith('someKey', 'some value');
        });

        it('setObject() jsonizes the input object and stores it in localStorage with the input key', function() {
            spyOn($window.localStorage, 'setItem');
            var objToStore = {
                someField: 'some value'
            };

            iceStorage.local.setObject('someKey', objToStore);

            expect($window.localStorage.setItem).toHaveBeenCalledWith('someKey', angular.toJson(objToStore));
        });

        it('get() returns the stored value by the input key', function() {
            spyOn($window.localStorage, 'getItem').and.returnValue('some value');

            var actual = iceStorage.local.get('someKey');

            expect($window.localStorage.getItem).toHaveBeenCalledWith('someKey');
            expect(actual).toBe('some value');
        });

        it('getObject() unjsonizes and returns the stored value by the input key', function() {
            var storedObj = {
                someField: 'some value'
            };
            spyOn($window.localStorage, 'getItem').and.returnValue(angular.toJson(storedObj));

            var actual = iceStorage.local.getObject('someKey');

            expect($window.localStorage.getItem).toHaveBeenCalledWith('someKey');
            expect(actual).toEqualData(storedObj);
        });

        it('remove() deletes the stored value by the input key', function() {
            spyOn($window.localStorage, 'removeItem');

            iceStorage.local.remove('someKey');

            expect($window.localStorage.removeItem).toHaveBeenCalledWith('someKey');
        });
    });

    describe('session:', function() {
        it('isSupported() returns only true if sessionStorage supported by browser', function() {
            expect(iceStorage.session.isSupported()).toBe(true);
        });

        it('set() stores the input value in sessionStorage with the input key', function() {
            spyOn($window.sessionStorage, 'setItem');

            iceStorage.session.set('someKey', 'some value');

            expect($window.sessionStorage.setItem).toHaveBeenCalledWith('someKey', 'some value');
        });

        it('setObject() jsonizes the input object and stores it in sessionStorage with the input key', function() {
            spyOn($window.sessionStorage, 'setItem');
            var objToStore = {
                someField: 'some value'
            };

            iceStorage.session.setObject('someKey', objToStore);

            expect($window.sessionStorage.setItem).toHaveBeenCalledWith('someKey', angular.toJson(objToStore));
        });

        it('get() returns the stored value by the input key', function() {
            spyOn($window.sessionStorage, 'getItem').and.returnValue('some value');

            var actual = iceStorage.session.get('someKey');

            expect($window.sessionStorage.getItem).toHaveBeenCalledWith('someKey');
            expect(actual).toBe('some value');
        });

        it('getObject() unjsonizes and returns the stored value by the input key', function() {
            var storedObj = {
                someField: 'some value'
            };
            spyOn($window.sessionStorage, 'getItem').and.returnValue(angular.toJson(storedObj));

            var actual = iceStorage.session.getObject('someKey');

            expect($window.sessionStorage.getItem).toHaveBeenCalledWith('someKey');
            expect(actual).toEqualData(storedObj);
        });

        it('remove() deletes the stored value by the input key', function() {
            spyOn($window.sessionStorage, 'removeItem');

            iceStorage.session.remove('someKey');

            expect($window.sessionStorage.removeItem).toHaveBeenCalledWith('someKey');
        });
    });

});
