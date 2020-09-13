(function () {
    'use strict';

    angular.module('appModule').service('inviteService',
        ['Restangular', 'CONSTANTS', function(Restangular, CONSTANTS) {

            return {
                invite: function (inviteDetails) {
                    let baseInvite = Restangular.all(CONSTANTS.ROUTES.INVITE);
                    return baseInvite.post(inviteDetails);
                },
            }

        }]);
})();
