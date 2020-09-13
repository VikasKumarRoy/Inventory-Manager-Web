(function () {
    'use strict';

    angular.module('appModule').controller('LoginController',
        ['$scope', '$state', '$stateParams', 'authService', 'cookieService', 'CONSTANTS', '$mdToast',
            function($scope, $state, $stateParams, authService, cookieService, CONSTANTS, $mdToast){

                $scope.credentials = {
                    email: undefined,
                    password: undefined
                }

                $scope.login = function () {                    
                    return authService.login($scope.credentials).then(function(response){
                        cookieService.setAuthToken(response);
                        $state.go(CONSTANTS.STATES.DASHBOARD, null, {
                            location: 'replace'
                        });
                    }).catch(function(error){
                        let errorMessage = error.data['non_field_errors'][0];
                        if (error.status >= 500 && error.status < 600)
                            errorMessage = CONSTANTS.MESSAGES.SERVER_ERROR;
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(errorMessage)
                            .position('top center')
                            .hideDelay(3000)
                        );
                    });
                };
        }]);

})();
