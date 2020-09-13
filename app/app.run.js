(function () {
    'use strict';

    angular.module('appModule').run(['$state','$timeout','$transitions', 'CONSTANTS', 'cookieService', 'Restangular', '$mdToast',
        function($state, $timeout, $transitions, CONSTANTS, cookieService, Restangular, $mdToast) {

        const authStates = [
            CONSTANTS.STATES.DASHBOARD,
            CONSTANTS.STATES.LIST_ITEM_GROUP,
            CONSTANTS.STATES.LIST_ITEM,
            CONSTANTS.STATES.REQUEST_ITEM_GROUP,
            CONSTANTS.STATES.MY_REQUESTS,
            CONSTANTS.STATES.MANAGE_REQUESTS,
            CONSTANTS.STATES.PROFILE,
            CONSTANTS.STATES.MY_ORGANIZATION,
            CONSTANTS.STATES.HISTORY_SELECT_GROUP,
            CONSTANTS.STATES.HISTORY_SELECT_ITEM,
            CONSTANTS.STATES.HISTORY
        ]
    
        const onlyStaffStates = [
            CONSTANTS.STATES.LIST_ITEM_GROUP,
            CONSTANTS.STATES.LIST_ITEM,
            CONSTANTS.STATES.HISTORY_SELECT_GROUP,
            CONSTANTS.STATES.HISTORY_SELECT_ITEM,
            CONSTANTS.STATES.HISTORY,
            CONSTANTS.STATES.MY_ORGANIZATION
        ]

        Restangular.setBaseUrl(CONSTANTS.BASE_URL);
        
        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            if (response.status === 401) {
                cookieService.removeAuthToken();
                $timeout(function() {
                    $state.go(CONSTANTS.STATES.LOGIN);
                });
            }
            else if(response.status === 403) {
                $timeout(function() {
                    $state.go(CONSTANTS.STATES.DASHBOARD);
                });
            }
            else if(response.status === -1) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(CONSTANTS.MESSAGES.CONNECTION_LOST)
                    .position('top center')
                    .hideDelay(3000)
                );
            }
        });

        $transitions.onBefore({}, function (transition) {
            let authToken = cookieService.getAuthToken();
            if (authToken != null) {
                Restangular.setDefaultHeaders({Authorization: "Token " + authToken.key });
            }
            else {
                Restangular.setDefaultHeaders({});
            }

            if (authStates.includes(transition.to().name) && authToken == null) {
                return transition.router.stateService.target(CONSTANTS.STATES.LOGIN);
            }

            else if(authToken != null) {
                if(onlyStaffStates.includes(transition.to().name) && authToken.user.role === CONSTANTS.ROLES.USER) {
                    return transition.router.stateService.target(CONSTANTS.STATES.DASHBOARD);
                }
                else if (!(authStates.includes(transition.to().name))) {
                    return transition.router.stateService.target(CONSTANTS.STATES.DASHBOARD,);
                }
            }
            return true;
        });
    }]);

})();
