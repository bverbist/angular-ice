'use strict';

describe('iceDummyFilter:', function() {

    var iceDummyFilter;

    var $logMock = {
        info: function() {}
    };

    beforeEach(function() {
        iceDummyFilter = iceUnit.builder
            .filter('ice.dummy', 'iceDummyFilter')
            .withMock('$log', $logMock)
            .build();

        spyOn($logMock, 'info');
    });

    it('returns the input with some exclamation marks', function() {
        expect(iceDummyFilter('Hello')).toBe('Hello !!!');

        expect($logMock.info).toHaveBeenCalledWith('Exclamating Hello ...');
    });

});
