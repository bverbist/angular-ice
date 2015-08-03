'use strict';

angular
    .module('ice.dummy')
    .filter('iceDummyFilter', function($log) {
        return function(input) {
            $log.info('Exclamating ' + input + ' ...');
            return input + ' !!!';
        };
    });
