(function () {
    'use strict';

    angular.module('appModule').controller('EditProfileController',
        ['cookieService', 'userService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', 'userDetails', 'on_complete',
            function(cookieService, userService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, userDetails, on_complete){

                $scope.userDetails = {
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    date_of_birth: userDetails.date_of_birth,
                    phone: userDetails.phone,
                    address: userDetails.address,
                    gender: userDetails.gender
                }
                $scope.genders = [{
                    id: 0,
                    label: '-- Select gender --',
                    subItem: { name: undefined }
                }, {
                    id: 1,
                    label: 'Male',
                    subItem: { name: CONSTANTS.GENDERS.MALE }
                }, {
                    id: 2,
                    label: 'Female',
                    subItem: { name: CONSTANTS.GENDERS.FEMALE }
                }, {
                    id: 3,
                    label: 'Other',
                    subItem: { name: CONSTANTS.GENDERS.OTHER }
                }];
                $scope.selectedGender = null;

                if ('gender' in $scope.userDetails) {
                    if ($scope.userDetails.gender === 1) $scope.selectedGender = $scope.genders[1];
                    else if ($scope.userDetails.gender === 2) $scope.selectedGender = $scope.genders[2];
                    else if ($scope.userDetails.gender === 3) $scope.selectedGender = $scope.genders[3];
                    else $scope.selectedGender = $scope.genders[0];
                }
                else $scope.selectedGender = $scope.genders[0];

                $scope.signUp = function() {    
                    if ($scope.userDetails.date_of_birth !== undefined) {
                        let date = new Date($scope.userDetails.date_of_birth);
                        let monthDay = date.getDate().toString();
                        let month = (date.getMonth()+1).toString();
                        let year = date.getFullYear().toString();
                        $scope.userDetails.date_of_birth = year.concat('-').concat(month).concat('-').concat(monthDay);
                    }
                    if($scope.selectedGender !== $scope.genders[0])              
                        $scope.userDetails.gender = $scope.selectedGender.id;
                    userService.update_user_profile(userDetails.id, $scope.userDetails)
                        .then(function (response) {
                            $scope.$on('$destroy', function() {
                                on_complete(response);
                            });
                            $scope.$root.$broadcast(CONSTANTS.EVENTS.CHANGE_PROFILE_INFO, response);
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
