(function () {
    'use strict';

    angular.module('appModule').controller('SignUpController',
        ['$scope', '$state', '$stateParams', 'authService', 'cookieService', 'CONSTANTS', '$mdToast',
            function($scope, $state, $stateParams, authService, cookieService, CONSTANTS, $mdToast){

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
                $scope.selectedGender = $scope.genders[0];

                $scope.userDetails = {
                    email: undefined,
                    password: undefined,
                    first_name: undefined,
                    last_name: undefined,
                    date_of_birth: undefined,
                    profile_picture: undefined,
                    phone: undefined,
                    address: undefined,
                    gender: undefined
                }

                $scope.signUp = function () {

                    if ($scope.userDetails.date_of_birth !== undefined) {
                        let date = new Date($scope.userDetails.date_of_birth);
                        let monthDay = date.getDate().toString();
                        let month = (date.getMonth()+1).toString();
                        let year = date.getFullYear().toString();
                        $scope.userDetails.date_of_birth = year.concat('-').concat(month).concat('-').concat(monthDay);
                    }

                    $scope.userDetails.gender = $scope.selectedGender.subItem.name;
                    let fd = new FormData();
                    for (let key in $scope.userDetails) {
                        
                        if($scope.userDetails[key] !== undefined)
                            fd.append(key, $scope.userDetails[key]);
                    }
                    
                    return authService.signUp(fd, $stateParams.id).then(function(response) {
                            $state.go(CONSTANTS.STATES.LOGIN, null);
                        }).catch(function(error) {
                            let errorMessage = '';
                            if (error.status >= 500 && error.status < 600)
                                errorMessage = CONSTANTS.MESSAGES.SERVER_ERROR;
                            if ('detail' in error.data)
                                errorMessage = error.data.detail
                            else if ('password' in error.data) {
                                errorMessage = error.data.password[0];
                            }

                        $mdToast.show(
                                $mdToast.simple()
                                .textContent(errorMessage)
                                .position('top center')
                                .hideDelay(3000)
                            );
                    });
                }

                $scope.getInviteDetails = function () {
                    if ($stateParams.id == null) return;
                    return authService.inviteDetails($stateParams.id).then(function (response) {
                        $scope.userDetails.email = response.email;
                        $scope.userDetails.first_name = response.first_name;
                        $scope.userDetails.last_name = response.last_name;
                    }).catch(function (error) {
                        $mdToast.show(
                            $mdToast.simple()
                              .textContent(error.data.detail)
                              .position('top center')
                              .hideDelay(3000)
                        ); 
                    });
                }

                if ($state.current.name === CONSTANTS.STATES.SIGNUP)
                    $scope.getInviteDetails();

        }]);

})();
