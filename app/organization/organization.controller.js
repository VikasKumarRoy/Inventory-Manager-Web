(function () {
    'use strict';

    angular.module('appModule').controller('MyOrganizationController',
        ['requestService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', '$location',
            function(requestService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, $location){

                $scope.listGridViewCol = [0,1,2,3];
                $scope.requestList = [null, null, null, null, null, null];
                $scope.loadingList = [true, true, true, true, true, true, true];
                $scope.emptyList = [false, false, false, false, false, false, false];
                $scope.allRequestStats = {
                    pending: 0,
                    approved: 0,
                    cancelled: 0,
                    rejected: 0,
                    total: 0
                };
                $scope.allApprovedStats = {
                    pending: 0,
                    acknowledged: 0,
                    returned: 0,
                    total: 0
                };

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
                    },
                ];

                $scope.searchList = [{word: ""}, {word: ""}, {word: ""}, {word: ""}, {word: ""}, {word: ""}];

                $scope.getAllRequests = function (selectedTab) {
                    let status = 0;
                    if(selectedTab === 2)
                        status = 18;
                    else
                        status = parseFloat(selectedTab) + parseFloat(CONSTANTS.REQUEST_STATUS.APPROVED);

                    if ($scope.paginationList[$scope.selectedTabIndex].currentPage == null || $scope.paginationList[$scope.selectedTabIndex].currentPage === 0)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;
                    
                        let params = {'status': status,
                                  'page': $scope.paginationList[$scope.selectedTabIndex].currentPage,
                                  'page_size': $scope.paginationList[$scope.selectedTabIndex].pageSize,
                                  'search': $scope.searchList[$scope.selectedTabIndex].word
                                 };

                    requestService.get_all_requests(params)
                        .then(function (response) {
                            $scope.requestList[selectedTab] = response.results;
                            $scope.paginationList[$scope.selectedTabIndex].totalItems = response.count;
                            $scope.paginationList[$scope.selectedTabIndex].totalPages = Math.ceil($scope.paginationList[$scope.selectedTabIndex].totalItems/$scope.paginationList[$scope.selectedTabIndex].pageSize); 
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

                $scope.getAllApprovedRequests = function (selectedTab) {
                    let status = parseFloat(selectedTab) + parseFloat(CONSTANTS.REQUEST_STATUS.APPROVED) - 1;

                    if ($scope.paginationList[$scope.selectedTabIndex].currentPage == null || $scope.paginationList[$scope.selectedTabIndex].currentPage === 0)
                        $scope.paginationList[$scope.selectedTabIndex].currentPage = 1;
                   
                    let params = {'status': status,
                                  'page': $scope.paginationList[$scope.selectedTabIndex].currentPage,
                                  'page_size': $scope.paginationList[$scope.selectedTabIndex].pageSize,
                                  'search': $scope.searchList[$scope.selectedTabIndex].word
                                 };

                    requestService.get_all_approved_requests(params)
                        .then(function (response) {
                            $scope.requestList[selectedTab] = response.results;
                            $scope.paginationList[$scope.selectedTabIndex].totalItems = response.count;
                            $scope.paginationList[$scope.selectedTabIndex].totalPages = Math.ceil($scope.paginationList[$scope.selectedTabIndex].totalItems/$scope.paginationList[$scope.selectedTabIndex].pageSize);
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

                $scope.getRequestStats = function () {
                    requestService.get_all_requests_stats()
                        .then(function (response) {
                            response.plain().forEach(function (item) {
                                if (item.status === 7) $scope.allRequestStats.pending=item.count;
                                else if (item.status === 8) $scope.allRequestStats.approved=item.count;
                                else if (item.status === 9) $scope.allRequestStats.cancelled=item.count;
                                else $scope.allRequestStats.rejected=item.count;

                                $scope.allRequestStats.total=(
                                    $scope.allRequestStats.pending+$scope.allRequestStats.approved+
                                    $scope.allRequestStats.cancelled+$scope.allRequestStats.rejected
                                );
                            })
                            $scope.loadingList[6] = false;
                        })
                        .catch(function (error) {
                            $scope.loadingList[6] = false;
                            let errorMessage = error.detail;
                            if (error.status >= 500 && error.status < 600)
                                errorMessage = CONSTANTS.MESSAGES.SERVER_ERROR;
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(errorMessage)
                                .position('top center')
                                .hideDelay(3000)
                            );
                            return;
                        });

                    requestService.get_all_approved_requests_stats()
                        .then(function (response) {
                            response.plain().forEach(function (item) {
                                if (item.status === 10) $scope.allApprovedStats.pending=item.count;
                                else if (item.status === 11) $scope.allApprovedStats.acknowledged=item.count;
                                else $scope.allApprovedStats.returned=item.count;

                                $scope.allApprovedStats.total=(
                                    $scope.allApprovedStats.pending+$scope.allApprovedStats.acknowledged+
                                    $scope.allApprovedStats.returned
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
                
                $scope.updateButtonDialog = function(ev, request) {
                    $mdDialog.show({
                        locals:{
                            request: request,
                            on_complete: function(data) {
                                let ind = $scope.requestList[$scope.selectedTabIndex].findIndex(x => x.id === data.id);
                                $scope.requestList[$scope.selectedTabIndex][ind].approved_duration = data.approved_duration;
                            }
                        },
                        controller: CONSTANTS.CONTROLLERS.UPDATE_DURATION_DIALOG_CONTROLLER,
                        templateUrl: CONSTANTS.TEMPLATE.UPDATE_DURATION_DIALOG,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                    })
                }

                $scope.sendReminderNotification = function(request) {
                    requestService.send_reminder_notification(request.id)
                        .then(function (response) { 
                            $mdToast.show(
                                $mdToast.simple()
                                  .textContent('Notification sent to '+ request.approved_to_name)
                                  .position('top center')
                                  .hideDelay(3000)
                            );  
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

                $scope.reminderButtonDialog = function(ev, request) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to send reminder notification to ${request.approved_to_name}?`)
                        .targetEvent(ev)
                        .ok('YES')
                        .cancel('NO');

                    $mdDialog.show(confirm).then(function() {
                        $scope.sendReminderNotification(request);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.isDurationExceeded = function(status_date, approved_duration, state) {
                    let currentDate = new Date();
                    let date = new Date(status_date);
                    let difference_in_time = currentDate.getTime() - date.getTime(); 
                    let difference_in_days = difference_in_time / (1000 * 3600 * 24);
                    if(state === 'pending') {
                        if(difference_in_days > 1)
                            return true;
                    }
                    else if(state === 'acknowledged') {
                        if(difference_in_days > approved_duration)
                            return true;
                    }
                    return false;
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

                    if($scope.selectedTabIndex == 6) {
                        $location.search({tab: $scope.selectedTabIndex});
                        return;
                    }
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
                    $scope.emptyList[$scope.selectedTabIndex] = false;
                    $scope.loadingList[$scope.selectedTabIndex] = true;
                    if($scope.selectedTabIndex == 6) {
                        $scope.getRequestStats();
                        return;
                    }             
                    $scope.paginationList[$scope.selectedTabIndex].currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                    $scope.searchList[$scope.selectedTabIndex].word = ($location.search().search === undefined) ? '' : $location.search().search;
                    if($scope.selectedTabIndex >= 0 && $scope.selectedTabIndex <= 2)
                        $scope.getAllRequests($scope.selectedTabIndex);
                    else
                        $scope.getAllApprovedRequests($scope.selectedTabIndex);
                });

                $scope.selectedTabIndex = $location.search().tab === undefined ? 0 : $location.search().tab;
                let tabNum = $scope.selectedTabIndex;
                if(tabNum != 6) {
                    $scope.searchList[$scope.selectedTabIndex].word = ($location.search().search === undefined) ? '' : $location.search().search;
                    $scope.paginationList[$scope.selectedTabIndex].currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                }
                
                if(tabNum >= 0 && tabNum <= 2)
                    $scope.getAllRequests(tabNum);
                else if (tabNum >= 3 && tabNum <= 5)
                    $scope.getAllApprovedRequests(tabNum);
                else if(tabNum == 6)
                    $scope.getRequestStats();

            }])
})();
