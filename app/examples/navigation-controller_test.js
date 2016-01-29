'use strict';

describe('NavigationCtrl:', function() {

    var $scope;

    var buildController = function(skipModuleLoad) {
        var builder = iceUnit.builder
            .controllerScope('angularIceApp', 'NavigationCtrl');

        if (skipModuleLoad) {
            builder.skipModuleLoad();
        }

        $scope = builder.build();
    };

    describe('on init:', function() {
        it('some fields are put on the scope', function() {
            buildController();

            expect($scope.activeTab).toBeDefined();
            expect($scope.activeTab.installation).toBe(false);
            expect($scope.activeTab.unitTester).toBe(false);
            expect($scope.activeTab.formDirectives).toBe(false);
            expect($scope.activeTab.services).toBe(false);
            expect($scope.activeTab.releases).toBe(false);
        });
    });

    describe('after init:', function() {
        var $location;

        beforeEach(function () {
            buildController();

            $location = iceUnit.inject('$location');
        });

        describe('initFirstActiveTab()', function() {
            it('sets the tab active that correspondents to the current location', function () {
                spyOn($location, 'path').and.returnValue('/releases');
                expectNoTabActive();

                $scope.initFirstActiveTab();

                expectOnlyOneTabActive('releases');
            });

            function expectNoTabActive() {
                for (var key in $scope.activeTab) {
                    expect($scope.activeTab[key]).toBe(false);
                }
            }

            function expectOnlyOneTabActive(expectedActiveTab) {
                for (var key in $scope.activeTab) {
                    var expected = (key === expectedActiveTab) ? true : false;
                    expect(key + '-' + $scope.activeTab[key]).toBe(key + '-' + expected);
                }
            }
        });

        describe('goTo', function() {
            it('sets the location path', function () {
                spyOn($location, 'path');

                $scope.goTo('someWhere');

                expect($location.path).toHaveBeenCalledWith('someWhere');
            });
        });
    });

});
