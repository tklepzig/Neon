'use strict';

describe('edit', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('edit');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('EditController', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
