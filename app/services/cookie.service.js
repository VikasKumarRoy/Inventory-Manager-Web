(function () {
    'use strict';

    angular.module('appModule').service('cookieService',
        ['Restangular', '$cookies', 'CONSTANTS', function(Restangular, $cookies, CONSTANTS) {

            function setAuthToken(authToken) {
                $cookies.putObject(CONSTANTS.AUTH_TOKEN_COOKIE_ID, authToken);
            }
            function getAuthToken() {
                return $cookies.getObject(CONSTANTS.AUTH_TOKEN_COOKIE_ID);
            }
            function removeAuthToken() {
                $cookies.remove(CONSTANTS.AUTH_TOKEN_COOKIE_ID);
            }

            this.setAuthToken = setAuthToken;
            this.getAuthToken = getAuthToken;
            this.removeAuthToken = removeAuthToken;

        }]);

})();
