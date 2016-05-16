'use strict';

describe('trash.group', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('trash.group');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('Group', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
