'use strict';

function IceDummyCompCtrl($log) {
    var ctrl = this;

    ctrl.getTestInputWithSuffix = function() {
        $log.info('adding suffix');
        return ctrl.testInput + '-with-suffix';
    };

    ctrl.$onInit = function() {
        ctrl.varSetDuringInit = 123;
    };
}

angular
    .module('ice.dummy')
    .component('iceDummyComp', {
        templateUrl: 'iceDummyComp.html',
        controller: IceDummyCompCtrl,
        bindings: {
            testInput: '='
        }
    });