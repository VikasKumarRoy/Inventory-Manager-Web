(function () {
    'use strict';

    angular.module('appModule').controller('ApproveDialogController',
        ['$scope', '$mdDialog', '$mdToast', '$state', 'requestService', 'inventoryService', 'cookieService', 'request', 'CONSTANTS', 'on_complete',
            function($scope, $mdDialog, $mdToast, $state, requestService, inventoryService, cookieService, request, CONSTANTS, on_complete){

                $scope.empty = false;
                $scope.itemList = [];
                $scope.listGridViewCol = [0,1,2,3];
                $scope.selectedItemId = 0;
                $scope.requestType = request.type;
                $scope.data = {
                    approved_duration: request.requested_duration
                };
                $scope.pagination = {
                    currentPage: 1,
                    maxSize: CONSTANTS.MAX_PAGE_SIZE,
                    totalItems: undefined,
                    pageSize: CONSTANTS.PAGE_SIZE
                };

                let authToken = cookieService.getAuthToken();
                let role = authToken.user.role;
                $scope.role = role;
                
                $scope.get_item_list = function () {
                    if (role === CONSTANTS.ROLES.USER) {
                        let params = {
                            'page': $scope.pagination.currentPage,
                            'page_size': $scope.pagination.pageSize
                        };
                        inventoryService.get_item_list_to_approve_for_user(request.item_group_id, params)
                            .then(function (response) {
                                $scope.itemList = response.plain();
                                $scope.pagination.totalItems = response.count;
                            })
                            .catch(function (error) {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent(error.detail)
                                    .position('top center')
                                    .hideDelay(3000)
                                );
                            })
                    } else {
                        let params = {
                            'type' : request.type,
                            'page': $scope.pagination.currentPage,
                            'page_size': $scope.pagination.pageSize
                        };
                        if(request.type !== CONSTANTS.REQUEST_ITEM_TYPES[1].code)
                            params['is_assigned'] = false;
                        inventoryService.get_item_list_with_params(request.item_group_id, params)
                            .then(function (response) {
                                $scope.itemList = response.results;
                                $scope.pagination.totalItems = response.count;
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
                            })
                    }
                }

                $scope.pageChanged = function() {
                    $scope.get_item_list();
                };

                $scope.approveItemRequest = function() {
                    if(request.type === CONSTANTS.REQUEST_ITEM_TYPES[2].code)
                        $scope.data.approved_duration = null;
                    if (request.type !== CONSTANTS.REQUEST_ITEM_TYPES[2].code && $scope.data.approved_duration <= 0) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.INVALID_DURATION)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        return;
                    }
                    requestService.approve_item_request(request.id, $scope.selectedItemId, $scope.data)
                        .then(function (response) {
                            $scope.$on('$destroy', function() {
                                on_complete();
                            });
                            $scope.cancel();                           
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
                            $scope.cancel();
                    });
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

                $scope.toggle = function (item) {
                    $scope.selectedItemId = item.id;
                };

                let stateWatcher = function () {
                    $scope.$watchCollection('itemList', function (newVal, oldVal) {
                        if (newVal != null) $scope.empty = newVal.length === 0;
                    });
                }

                stateWatcher();

                $scope.get_item_list();

            }])
})();
