(function () {
    'use strict';

    angular.module('appModule').controller('ProfileController',
        ['cookieService', 'userService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS',
            function(cookieService, userService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS){
            $scope.loading = true;
            $scope.authToken = cookieService.getAuthToken();
            $scope.userDetails = null;
            $scope.myRequestStats = {
                pending: 0,
                approved: 0,
                cancelled: 0,
                rejected: 0,
                total: 0
            };
            $scope.myApprovedStats = {
                pending: 0,
                acknowledged: 0,
                returned: 0,
                total: 0
            };

            $scope.getUserDetails = function() {
                    userService.get_user_profile($scope.authToken.user.id)
                        .then(function (response) {
                            $scope.loading = false;
                            $scope.userDetails = response.plain();
                            if ($scope.userDetails.profile_picture == null) {
                                $scope.userDetails.profile_picture = CONSTANTS.DEFAULT_PROFILE_PIC
                            }
                        }).catch(function (error) {
                            $scope.loading = false;
                            let errorMessage = error.detail;
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

            $scope.getUserStats = function () {
                    userService.get_my_request_stats()
                        .then(function (response) {
                            response.plain().forEach(function (item) {
                                if (item.status === 7) $scope.myRequestStats.pending=item.count;
                                else if (item.status === 8) $scope.myRequestStats.approved=item.count;
                                else if (item.status === 9) $scope.myRequestStats.cancelled=item.count;
                                else $scope.myRequestStats.rejected=item.count;

                                $scope.myRequestStats.total=(
                                    $scope.myRequestStats.pending+$scope.myRequestStats.approved+
                                    $scope.myRequestStats.cancelled+$scope.myRequestStats.rejected
                                );
                            })

                        })
                        .catch(function (error) {
                            let errorMessage = error.detail;
                            if (error.status >= 500 && error.status < 600)
                                errorMessage = CONSTANTS.MESSAGES.SERVER_ERROR;
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(errorMessage)
                                .position('top center')
                                .hideDelay(3000)
                            );
                        });
                    userService.get_approved_request_stats()
                        .then(function (response) {
                            $scope.myApprovedStats = response.plain();
                            response.plain().forEach(function (item) {
                                if (item.status === 10) $scope.myApprovedStats.pending=item.count;
                                else if (item.status === 11) $scope.myApprovedStats.acknowledged=item.count;
                                else $scope.myApprovedStats.returned=item.count;

                                $scope.myApprovedStats.total=(
                                    $scope.myApprovedStats.pending+$scope.myApprovedStats.acknowledged+
                                    $scope.myApprovedStats.returned
                                );
                            })
                        }).catch(function (error) {
                            let errorMessage = error.detail;
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

            $scope.getUserDetails();

            $scope.getUserStats();

            $scope.getUserRole = function () {
                if ($scope.userDetails == null) return 'fetching';
                if ($scope.userDetails.role === CONSTANTS.ROLES.ADMIN) return 'ADMIN';
                else if ($scope.userDetails.role === CONSTANTS.ROLES.MANAGER) return 'MANAGER';
                else return 'USER';
            }
            $scope.getUserGender = function () {
                if ($scope.userDetails == null) return 'fetching';
                if ($scope.userDetails.gender === CONSTANTS.GENDERS.MALE) return 'MALE';
                else if ($scope.userDetails.gender === CONSTANTS.GENDERS.FEMALE) return 'FEMALE';
                else return 'OTHER';
            }

            $scope.openEditProfileDialog = function(ev) {

                let copyUserDetails = JSON.parse(JSON.stringify($scope.userDetails));

                $mdDialog.show({locals:{
                        userDetails: copyUserDetails,
                        on_complete: function(data) {
                            $scope.userDetails = data;
                        }
                    },
                    controller: CONSTANTS.CONTROLLERS.EDIT_PROFILE,
                    templateUrl: CONSTANTS.TEMPLATE.EDIT_PROFILE_DIALOG,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                })
            };

            $scope.openEditProfilePicDialog = function(ev) {
                
                let copyUserDetails = JSON.parse(JSON.stringify($scope.userDetails));

                $mdDialog.show({locals:{
                        userDetails: copyUserDetails,
                        on_complete: function(data) {
                            $scope.userDetails = data;
                        }
                    },
                    controller: CONSTANTS.CONTROLLERS.EDIT_PROFILE_PIC,
                    templateUrl: CONSTANTS.TEMPLATE.EDIT_PROFILE_PIC_DIALOG,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                })

            }

    }]);
})();
