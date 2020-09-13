(function () {
    'use strict';

    angular.module('appModule').service('authService',
        ['Restangular', 'CONSTANTS', function(Restangular, CONSTANTS) {

            return {
                login: function (credentials) {
                    let baseLogin = Restangular.all(CONSTANTS.ROUTES.AUTH.AUTHENTICATION.concat(CONSTANTS.ROUTES.AUTH.LOGIN));
                    return baseLogin.post(credentials);
                },
                signUp: function (fd, token) {
                    let baseSignUp = Restangular.all(CONSTANTS.ROUTES.AUTH.AUTHENTICATION.concat(token).concat('/').concat(CONSTANTS.ROUTES.AUTH.SIGNUP));
                    return baseSignUp.withHttpConfig({transformRequest: angular.identity})
                        .post(fd, undefined, {'Content-Type': undefined})
                },
                logout: function () {
                    let baseLogout = Restangular.all(CONSTANTS.ROUTES.AUTH.AUTHENTICATION.concat(CONSTANTS.ROUTES.AUTH.LOGOUT));
                    return baseLogout.post();
                },
                inviteDetails: function (token) {
                    let baseInviteDetail = Restangular.all(CONSTANTS.ROUTES.INVITE).one(token.concat('/'));
                    return baseInviteDetail.get();
                }
            }

        }]);
})();
