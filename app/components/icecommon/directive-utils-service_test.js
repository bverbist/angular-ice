'use strict';

describe('iceDirectiveUtils:', function() {

    var iceDirectiveUtils;

    beforeEach(module('ice.common'));

    beforeEach(function() {
        iceDirectiveUtils = iceUnit.inject('iceDirectiveUtils');
    });

    describe('getAttributeOrDefaultValue()', function() {
        var attributes = {
            'someAttr': 'some value',
            'otherAttr': ''
        };

        it('returns the value of the requested attribute out of the attributes input', function() {
            expect(iceDirectiveUtils.getAttributeOrDefaultValue(attributes, 'someAttr', 'xxx')).toEqual('some value');
        });

        it('returns the default value if requested attribute is an empty string', function() {
            expect(iceDirectiveUtils.getAttributeOrDefaultValue(attributes, 'otherAttr', 'yyy')).toEqual('yyy');
        });

        it('returns the default value if requested attribute not found', function() {
            expect(iceDirectiveUtils.getAttributeOrDefaultValue(attributes, 'nonExistingAttr', 'zzz')).toEqual('zzz');
        });
    });

});
