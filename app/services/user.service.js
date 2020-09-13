(function() {
    'use strict';

    angular.module('appModule').service('userService' ,
        ['Restangular', 'CONSTANTS', function(Restangular, CONSTANTS) {

            return {
                get_user_profile: function (userId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.USER, userId);
                    return baseRequest.get();
                },
                update_user_profile: function (userId, data) {
                    let baseRequest = Restangular.all(CONSTANTS.ROUTES.USER + '/' + userId + '/');
                    return baseRequest.customPATCH(data);
                },
                update_user_profile_pic: function (userId, fd) {
                    let baseRequest = Restangular.all(CONSTANTS.ROUTES.USER + '/' + userId + '/');
                    return baseRequest.withHttpConfig({transformRequest: angular.identity})
                        .patch(fd, undefined, {'Content-Type': undefined})
                },
                get_my_request_stats: function() {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_REQUESTS + 'stats/');
                    return baseRequest.getList();
                },
                get_approved_request_stats: function() {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_APPROVED + 'stats/');
                    return baseRequest.getList();
                }
            }

        }]);
})();