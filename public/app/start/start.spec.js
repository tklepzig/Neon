'use strict';

describe('start', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('start');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('StartController', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
