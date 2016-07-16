'use strict';

describe('trash.document', function() {

    var $scope;
    beforeEach(function() {
        angular.mock.module();
        module('trash.document');
    });

    beforeEach(inject(function(_$rootScope_,_$controller_) {
        $scope = _$rootScope_.$new();

        _$controller_('Document', {
            $scope: $scope,
        });
    }));

    describe('$scope', function() {
        it('your test', function() {
            expect(true).toBe(true);
        });
    });
});
