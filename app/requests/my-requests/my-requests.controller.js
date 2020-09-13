(function () {
    'use strict';

    angular.module('appModule').controller('MyRequestsController',
        ['requestService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', '$location',
            function(requestService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, $location){

                $scope.listGridViewCol = [0,1,2,3];
                $scope.requestList = [null, null, null, null, null, null, null];
                $scope.loadingList = [true, true, true, true, true, true, true];
                $scope.emptyList = [false, false, false, false, false, false, false];

                $scope.selectedTabIndex = $location.search().tab == null ? 0 : $location.search().tab;

                $scope.paginationList = [
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    },
                    {
                        currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                        maxSize: CONSTANTS.MAX_PAGE_SIZE,
                        totalItems: undefined,
                        pageSize: CONSTANTS.PAGE_SIZE,
                        totalPages: null
                    }
                ];

                $scope.searchList = [{word: ""}, {word: ""}, {word: ""}, {word: ""}, {word: ""}, {word: ""}, {word: ""}];

                $scope.getMyRequests = function (selectedTab) {
                    let status = 0;
                    if(selectedTab == 3)
                        status = 18;
                    else
                        status = parseFloat(selectedTab) + parseFloat(CONSTANTS.REQUEST_STATUS.PENDING);

                    if ($scope.paginationList[$scope.selectedTabIndex].currentPage == null || $scope.paginationList[$scope.selectedTabIndex].currentPage === 0)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;

                    let params = {'status': status,
                                  'page': $scope.paginationList[$scope.selectedTabIndex].currentPage,
                                  'page_size': $scope.paginationList[$scope.selectedTabIndex].pageSize,
                                  'search': $scope.searchList[$scope.selectedTabIndex].word
                                 };

                    requestService.get_my_requests(params)
                        .then(function (response) {
                            $scope.requestList[selectedTab] = response.results;
                            $scope.paginationList[$scope.selectedTabIndex].totalItems = response.count;
                            $scope.paginationList[$scope.selectedTabIndex].totalPages = Math.ceil($scope.paginationList[$scope.selectedTabIndex].totalItems/$scope.paginationList[$scope.selectedTabIndex].pageSize); 
                        })
                        .catch(function (error) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(error.detail)
                                .position('top center')
                                .hideDelay(3000)
                            );
                        })
                }

                $scope.getApprovedRequests = function (selectedTab) {
                    let status = parseFloat(selectedTab) + parseFloat(CONSTANTS.REQUEST_STATUS.PENDING) - 1;

                    if ($scope.paginationList[$scope.selectedTabIndex].currentPage == null || $scope.paginationList[$scope.selectedTabIndex].currentPage === 0)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;

                    let params = {'status': status,
                                  'page': $scope.paginationList[$scope.selectedTabIndex].currentPage,
                                  'page_size': $scope.paginationList[$scope.selectedTabIndex].pageSize,
                                  'search': $scope.searchList[$scope.selectedTabIndex].word
                                 };
           

                    requestService.get_approved_requests(params)
                        .then(function (response) {
                            $scope.requestList[selectedTab] = response.results;
                            $scope.paginationList[$scope.selectedTabIndex].totalItems = response.count;
                            $scope.paginationList[$scope.selectedTabIndex].totalPages = Math.ceil($scope.paginationList[$scope.selectedTabIndex].totalItems/$scope.paginationList[$scope.selectedTabIndex].pageSize);
                        })
                        .catch(function (error) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(error.detail)
                                .position('top center')
                                .hideDelay(3000)
                            );
                        })
                }

                $scope.cancelMyRequest = function(request) {
                    requestService.cancel_my_request(request.id)
                        .then(function (response) {
                            let index = $scope.requestList[0].indexOf(request);
                            $scope.requestList[0].splice(index, 1);
                            request.status = CONSTANTS.REQUEST_STATUS.CANCELLED;
                            if ($scope.requestList[2] != null)
                                $scope.requestList[2].unshift(request);    
                        }).catch(function (error) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(error.data.detail)
                                .position('top center')
                                .hideDelay(3000)
                            );
                    });
                }

                $scope.cancelButtonDialog = function(ev, request) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to cancel your request for ${request.item_group_name}?`)
                        .targetEvent(ev)
                        .ok('YES')
                        .cancel('NO');

                    $mdDialog.show(confirm).then(function() {
                        $scope.cancelMyRequest(request);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.acknowledgeApprovedRequest = function(request) {
                    requestService.acknowledge_approved_request(request.id)
                        .then(function (response) {
                            let index = $scope.requestList[4].indexOf(request);
                            $scope.requestList[4].splice(index, 1);
                            request.status = CONSTANTS.APPROVED_STATUS.ACKNOWLEDGED;
                            if ($scope.requestList[5] != null)
                                $scope.requestList[5].unshift(request);
                        }).catch(function (error) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(error.detail)
                                .position('top center')
                                .hideDelay(3000)
                            );
                    });
                }

                $scope.acknowledgeButtonDialog = function(ev, request) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to acknowledge ${request.item_group_name} assigned to you?`)
                        .targetEvent(ev)
                        .ok('YES')
                        .cancel('NO');

                    $mdDialog.show(confirm).then(function() {
                        $scope.acknowledgeApprovedRequest(request);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.returnItem = function(request) {
                    requestService.return_item(request.id)
                        .then(function (response) {
                            let index = $scope.requestList[5].indexOf(request);
                            $scope.requestList[5].splice(index, 1);
                            request.status = CONSTANTS.APPROVED_STATUS.RETURNED;
                            if ($scope.requestList[6] != null)
                                $scope.requestList[6].unshift(request);
                        }).catch(function (error) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(error.data.detail)
                                .position('top center')
                                .hideDelay(3000)
                            );
                    });
                }

                $scope.returnButtonDialog = function(ev, request) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to return ${request.item_group_name}?`)
                        .targetEvent(ev)
                        .ok('YES')
                        .cancel('NO');

                    $mdDialog.show(confirm).then(function() {
                        $scope.returnItem(request);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                let stateWatcher = function () {
                    $scope.$watchCollection('requestList', function (newVal, oldVal) {
                        newVal.forEach(function (item, index) {
                            if ($scope.requestList[index] != null) $scope.loadingList[index] = false;
                            $scope.emptyList[index] = $scope.requestList[index] != null && $scope.requestList[index].length === 0;
                        })
                    });
                }

                stateWatcher();

                $scope.pageChanged = function() {
                    if ($scope.searchList[$scope.selectedTabIndex].word.length === 0)
                        $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex});
                    else $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex, search: $scope.searchList[$scope.selectedTabIndex].word});
                };

                $scope.changeTab = function () {

                    if ($scope.paginationList[$scope.selectedTabIndex].totalItems === undefined)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;

                    if($scope.paginationList[$scope.selectedTabIndex].currentPage === undefined)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;
                        
                    if ($scope.searchList[$scope.selectedTabIndex].word.length === 0)
                        $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex});
                    else
                        $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex, search: $scope.searchList[$scope.selectedTabIndex].word});
                }

                $scope.searchButton = function() {
                    $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;
                    if ($scope.searchList[$scope.selectedTabIndex].word.length === 0)
                        $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex});
                    else
                        $location.search({page: $scope.paginationList[$scope.selectedTabIndex].currentPage, tab: $scope.selectedTabIndex, search: $scope.searchList[$scope.selectedTabIndex].word});
                };

                $scope.$on("$locationChangeStart", function(event, next, current) {
                    $scope.selectedTabIndex = $location.search().tab == null ? 0 : $location.search().tab;
                    $scope.loadingList[$scope.selectedTabIndex] = true;
                    $scope.paginationList[$scope.selectedTabIndex].currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                    $scope.searchList[$scope.selectedTabIndex].word = ($location.search().search === undefined) ? '' : $location.search().search;
                    if($scope.selectedTabIndex >= 0 && $scope.selectedTabIndex <= 3)
                        $scope.getMyRequests($scope.selectedTabIndex);
                    else
                        $scope.getApprovedRequests($scope.selectedTabIndex);
                });

                $scope.selectedTabIndex = $location.search().tab === undefined ? 0 : $location.search().tab;
                $scope.searchList[$scope.selectedTabIndex].word = ($location.search().search === undefined) ? '' : $location.search().search;
                $scope.paginationList[$scope.selectedTabIndex].currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                
                let tabNum = $scope.selectedTabIndex;
                if(tabNum >= 0 && tabNum <= 3)
                    $scope.getMyRequests(tabNum);
                else if (tabNum >= 4 && tabNum <= 6)
                    $scope.getApprovedRequests(tabNum);

            }])
})();
