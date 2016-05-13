'use strict';

describe('trash', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('trash');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('TrashController', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
