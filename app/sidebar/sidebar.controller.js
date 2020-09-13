(function () {
    'use strict';

    angular.module('appModule').controller('SidebarController',
        ['$scope', '$state', '$mdDialog', '$mdToast', 'authService', 'inviteService', 'userService','cookieService', 'CONSTANTS',
            function($scope,  $state, $mdDialog, $mdToast, authService, inviteService, userService, cookieService, CONSTANTS){

        $scope.authToken = cookieService.getAuthToken();
        if($scope.authToken === undefined) 
            $state.go(CONSTANTS.STATES.LOGIN, null);
        $scope.userDetails = undefined;
        $scope.getUserDetails = function() {
            userService.get_user_profile($scope.authToken.user.id)
                .then(function (response) {
                            $scope.userDetails = response.plain();
                            $scope.sidebarItems = $scope.getSidebarOptions();
                            if ($scope.userDetails.profile_picture == null) {
                                $scope.userDetails.profile_picture = CONSTANTS.DEFAULT_PROFILE_PIC;
                            }
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

        $scope.$on(CONSTANTS.EVENTS.CHANGE_PROFILE_PIC, function(event, new_profile_pic) {
            $scope.userDetails.profile_picture = new_profile_pic;
        });

        $scope.$on(CONSTANTS.EVENTS.CHANGE_PROFILE_INFO, function(event, data) {
            $scope.userDetails = data;
        });

        $scope.getSidebarOptions = function(){
                if ($scope.userDetails.role === CONSTANTS.ROLES.ADMIN) return CONSTANTS.SIDEBAR_ITEMS.ADMIN;
                else if ($scope.userDetails.role === CONSTANTS.ROLES.MANAGER) return CONSTANTS.SIDEBAR_ITEMS.MANAGER;
                else return CONSTANTS.SIDEBAR_ITEMS.USER;
            };

        $scope.openProfile = function(event) {
            $state.go(CONSTANTS.STATES.PROFILE, null);
        }

        $scope.openTab = function(event, item) {
            if ($scope.userDetails.role === CONSTANTS.ROLES.ADMIN) {
                if(item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[0].name) {
                    $state.go(CONSTANTS.STATES.DASHBOARD, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[1].name) {
                    $scope.showAdvanced(event, CONSTANTS.CONTROLLERS.INVITE, CONSTANTS.TEMPLATE.INVITE_DIALOG);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[2].name) {
                    $state.go(CONSTANTS.STATES.MY_ORGANIZATION, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[3].name) {
                    $scope.showAdvanced(event, CONSTANTS.CONTROLLERS.ADD_ITEM_GROUP, CONSTANTS.TEMPLATE.ITEM_GROUP_DIALOG);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[4].name) {
                    $scope.showAdvanced(event, CONSTANTS.CONTROLLERS.ADD_ITEM, CONSTANTS.TEMPLATE.ITEM_DIALOG);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[5].name) {
                    $state.go(CONSTANTS.STATES.LIST_ITEM_GROUP, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[6].name) {
                    $state.go(CONSTANTS.STATES.REQUEST_ITEM_GROUP, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[7].name) {
                    $state.go(CONSTANTS.STATES.MANAGE_REQUESTS, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[8].name) {
                    $state.go(CONSTANTS.STATES.HISTORY_SELECT_GROUP, null);
                }
            }
            else if ($scope.userDetails.role === CONSTANTS.ROLES.MANAGER) {
                if(item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[0].name) {
                    $state.go(CONSTANTS.STATES.DASHBOARD, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.ADMIN[1].name) {
                    $state.go(CONSTANTS.STATES.MY_ORGANIZATION, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[2].name) {
                    $scope.showAdvanced(event, CONSTANTS.CONTROLLERS.ADD_ITEM_GROUP, CONSTANTS.TEMPLATE.ITEM_GROUP_DIALOG);
                } else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[3].name) {
                    $scope.showAdvanced(event, CONSTANTS.CONTROLLERS.ADD_ITEM, CONSTANTS.TEMPLATE.ITEM_DIALOG);
                } else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[4].name) {
                    $state.go(CONSTANTS.STATES.LIST_ITEM_GROUP, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[5].name) {
                    $state.go(CONSTANTS.STATES.REQUEST_ITEM_GROUP, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[6].name) {
                    $state.go(CONSTANTS.STATES.MANAGE_REQUESTS, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.MANAGER[7].name) {
                    $state.go(CONSTANTS.STATES.HISTORY_SELECT_GROUP, null);
                }
            }
            else if ($scope.userDetails.role === CONSTANTS.ROLES.USER) {
                if(item.name === CONSTANTS.SIDEBAR_ITEMS.USER[0].name) {
                    $state.go(CONSTANTS.STATES.DASHBOARD, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.USER[1].name) {
                    $state.go(CONSTANTS.STATES.REQUEST_ITEM_GROUP, null);
                }
                else if (item.name === CONSTANTS.SIDEBAR_ITEMS.USER[2].name) {
                    $state.go(CONSTANTS.STATES.MANAGE_REQUESTS, null);
                }
            }
        };

        $scope.logout = function () {
                authService.logout().then(function (response) {
                    cookieService.removeAuthToken();
                    $state.go(CONSTANTS.STATES.LOGIN, null);
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
            };

        $scope.showAdvanced = function(ev, controller, template_url) {
                $mdDialog.show({
                    controller: controller,
                    templateUrl: template_url,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                })
            };

        $scope.getUserDetails();

        }]);

})();
