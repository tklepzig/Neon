'use strict';

describe('show', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('show');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('ShowController', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
