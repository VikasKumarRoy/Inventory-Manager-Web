(function () {
    'use strict';

    angular.module('appModule').controller('EditProfilePicController',
        ['cookieService', 'userService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', 'userDetails', 'on_complete',
            function(cookieService, userService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, userDetails, on_complete){

                $scope.userDetails = {
                    profile_picture: null
                }

                $scope.submit = function() {     
                    
                    let fd = new FormData();
                    if($scope.userDetails.profile_picture !== undefined)
                            fd.append('profile_picture', $scope.userDetails.profile_picture);

                    userService.update_user_profile_pic(userDetails.id, fd)
                        .then(function (response) {
                            $scope.$on('$destroy', function() {
                                on_complete(response);
                            });
                            let new_profile_pic = response.profile_picture;
                            $scope.$root.$broadcast(CONSTANTS.EVENTS.CHANGE_PROFILE_PIC, new_profile_pic);
                            $scope.cancel();
                        })
                        .catch(function (error) {
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

                $scope.remove = function() { 
                    let fd = new FormData();
                    fd.append('profile_picture', "");

                    userService.update_user_profile_pic(userDetails.id, fd)
                        .then(function (response) {
                            $scope.$on('$destroy', function() {
                                response.profile_picture = CONSTANTS.DEFAULT_PROFILE_PIC;
                                on_complete(response);
                            });
                            let new_profile_pic = CONSTANTS.DEFAULT_PROFILE_PIC;
                            $scope.$root.$broadcast(CONSTANTS.EVENTS.CHANGE_PROFILE_PIC, new_profile_pic);
                            $scope.cancel();
                        })
                        .catch(function (error) {
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
