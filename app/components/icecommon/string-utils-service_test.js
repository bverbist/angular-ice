'use strict';

describe('iceStringUtils:', function() {

    var iceStringUtils;

    beforeEach(module('ice.common'));

    beforeEach(function() {
        iceStringUtils = iceUnit.inject('iceStringUtils');
    });

    describe('onlyKeepAllowedChars()', function() {
        it('returns a string where all not-allowed-chars are stripped out of the input string', function() {
            expect(iceStringUtils.onlyKeepAllowedChars('az8pZ12E', '0-9')).toEqual('812');
            expect(iceStringUtils.onlyKeepAllowedChars('az8pZ12E', 'a-z')).toEqual('azp');
            expect(iceStringUtils.onlyKeepAllowedChars('az8pZ12E', 'A-Z')).toEqual('ZE');
            expect(iceStringUtils.onlyKeepAllowedChars('az8pZ12E', 'a-zA-Z0-9')).toEqual('az8pZ12E');
            expect(iceStringUtils.onlyKeepAllowedChars('az8pZ12E', '_')).toEqual('');
            expect(iceStringUtils.onlyKeepAllowedChars('1_2_', '_')).toEqual('__');
        });
    });

});
