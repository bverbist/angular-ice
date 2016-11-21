'use strict';

describe('iceDummyComp:', function() {

    var iceDummyComp;

    var $logMock = {
        info: function() {}
    };

    beforeEach(function() {
        iceDummyComp = iceUnit.builder
            .componentController('ice.dummy', 'iceDummyComp')
            .withMock('$log', $logMock)
            .withBindings({
                testInput: 'binded_dummy_input'
            })
            .build();

        spyOn($logMock, 'info');
    });

    it('not setting doNotInitializeImmediately causes the $onInit function to be immediately called', function() {
        expect(iceDummyComp.varSetDuringInit).toEqual(123);
    });

    it('has the bindings', function() {
        expect(iceDummyComp.testInput).toEqual('binded_dummy_input');
    });

    it('has a getTestInputWithSuffix function', function() {
        expect(iceDummyComp.getTestInputWithSuffix()).toEqual('binded_dummy_input-with-suffix');

        expect($logMock.info).toHaveBeenCalledWith('adding suffix');
    });
});
