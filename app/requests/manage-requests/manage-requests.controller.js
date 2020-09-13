(function () {
    'use strict';

    angular.module('appModule').controller('ManageRequestsController',
        ['requestService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', 'cookieService', '$location',
            function(requestService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, cookieService, $location){

                $scope.requestList = [];
                $scope.empty = false;
                $scope.loading = true;
                $scope.pagination = {
                    currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                    maxSize: CONSTANTS.MAX_PAGE_SIZE,
                    totalItems: undefined,
                    pageSize: CONSTANTS.PAGE_SIZE,
                    totalPages: null
                };
                $scope.search = {
                    word: ($location.search().search === undefined) ? '' : $location.search().search
                };

                if ($scope.search.word === undefined || $scope.search.word.length === 0)
                    $location.search({page: $scope.pagination.currentPage});
                else 
                    $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});

                $scope.getPendingRequests = function () {

                    if ($scope.pagination.currentPage == null || $scope.pagination.currentPage === 0)
                        $scope.pagination.currentPage = 1;

                    let params = {
                                'page': $scope.pagination.currentPage,
                                'page_size': $scope.pagination.pageSize,
                                'search': $scope.search.word
                            };

                    requestService.get_pending_requests(params)
                        .then(function (response) {
                            $scope.requestList = response.results;
                            $scope.loading = false;
                            $scope.pagination.totalItems = response.count;
                            if($scope.pagination.totalPages == null)
                                $scope.pagination.totalPages = Math.ceil($scope.pagination.totalItems/$scope.pagination.pageSize);
                        })
                        .catch(function (error) {
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
                        })
                }

                $scope.rejectItemRequest = function(request) {
                    requestService.reject_item_request(request.id)
                        .then(function (response) {
                            let index = $scope.requestList.indexOf(request);
                            $scope.requestList.splice(index, 1);
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

                $scope.rejectButtonDialog = function(ev, request) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to reject request for ${request.item_group_name}?`)
                        .targetEvent(ev)
                        .ok('YES')
                        .cancel('NO');

                    $mdDialog.show(confirm).then(function() {
                        $scope.rejectItemRequest(request);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.approveButtonDialog = function(ev, request) {
                    $mdDialog.show({
                        locals:{
                            request: request,
                            on_complete: function() {
                                let index = $scope.requestList.indexOf(request);
                                $scope.requestList.splice(index, 1);
                            }
                        },
                        controller: CONSTANTS.CONTROLLERS.APPROVE_DIALOG_CONTROLLER,
                        templateUrl: CONSTANTS.TEMPLATE.APPROVE_REQUEST_DIALOG,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                    })
                }

                let stateWatcher = function () {
                    $scope.$watchCollection('requestList', function (newVal, oldVal) {
                        if (newVal != null) $scope.empty = newVal.length === 0;
                    });
                }

                stateWatcher();
           
                $scope.pageChanged = function() {
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage});
                    else 
                        $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});
                };

                $scope.searchItemGroupButton = function() {
                    $scope.pagination.currentPage = 1;
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage});
                    else
                         $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});
                }

                $scope.$on("$locationChangeStart", function(event, next, current) {
                    $scope.loading = true;
                    $scope.pagination.currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                    $scope.search.word = ($location.search().search === undefined) ? '' : $location.search().search;
                    if($scope.pagination.currentPage > $scope.pagination.totalPages) {
                        $scope.pagination.currentPage = $scope.pagination.totalPages;   
                    }
                    $scope.getPendingRequests();
                });

                $scope.getPendingRequests();

            }])
})();
