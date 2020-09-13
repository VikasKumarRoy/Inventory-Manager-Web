(function () {
    'use strict';

    angular.module('appModule').controller('InviteController',
        ['$scope', '$state', '$mdDialog', '$mdToast', 'inviteService', 'CONSTANTS',
            function($scope, $state, $mdDialog, $mdToast, inviteService, CONSTANTS){

                $scope.roles = [{
                    id: 0,
                    label: 'Admin',
                    subItem: { name: CONSTANTS.ROLES.ADMIN }
                }, {
                    id: 1,
                    label: 'Manager',
                    subItem: { name: CONSTANTS.ROLES.MANAGER }
                }, {
                    id: 2,
                    label: 'User',
                    subItem: { name: CONSTANTS.ROLES.USER }
                }];
                $scope.selectedRole = $scope.roles[2];

                $scope.userDetails = {
                    email: '',
                    first_name: '',
                    last_name: '',
                    role: undefined
                }

                $scope.invite = function() {
                    $scope.userDetails.role = $scope.selectedRole.subItem.name;
                    inviteService.invite($scope.userDetails)
                        .then(function (response) {
                            $mdDialog.cancel();
                        }).catch(function (error) {
                            let errorMessage = error.data.detail;
                            if (error.status >= 500 && error.status < 600)
                                errorMessage = CONSTANTS.MESSAGES.SERVER_ERROR;
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(errorMessage)
                                .position('top center')
                                .hideDelay(3000)
                            );
                        });
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

            }]);

})();
