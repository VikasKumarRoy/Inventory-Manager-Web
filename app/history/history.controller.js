(function () {
    'use strict';

    Array.prototype.extend = function (other_array) {
        other_array.forEach(function(v) {this.push(v)}, this);
    }

    angular.module('appModule').controller('HistoryController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', '$location',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, $location) {

                let itemGroupId = $stateParams.itemGroupId;
                let itemId = $stateParams.itemId;

                $scope.loading = true;
                $scope.loadingPaginated = false;
                $scope.empty = false;
                $scope.historyList = [];
                $scope.pagination = {
                    currentPage: 0,
                    maxSize: CONSTANTS.MAX_PAGE_SIZE,
                    totalItems: undefined,
                    pageSize: CONSTANTS.PAGE_SIZE,
                    totalPages: null
                };
                $scope.search = {
                    word: ($location.search().search === undefined) ? '' : $location.search().search
                };
                $scope.date = {
                    startDate: null,
                    endDate: null
                };

                $scope.mSplit = function(string, nb) {
                    if (string.length === 0) return '';
                    let array = string.split(' ');
                    return array[nb];
                }

                $scope.get_history = function() {
                    $scope.loadingPaginated = true;
                    if ($scope.pagination.currentPage == null)
                        $scope.pagination.currentPage = 0;

                    if ($scope.pagination.totalPages!=null && $scope.pagination.currentPage >= $scope.pagination.totalPages)
                        return;

                    $scope.pagination.currentPage++;

                    let params = {
                        'page': $scope.pagination.currentPage,
                        'page_size': $scope.pagination.pageSize,
                        'search': $scope.search.word
                    };

                    let start = $location.search().start_date;
                    let end = $location.search().end_date;
                    if(start !== null && start !== undefined) {
                        params['start_date'] = start;
                    }
                    if(end !== null && end !== undefined) {
                        params['end_date'] = end+' 23:59:59';
                    }

                    inventoryService.get_item_history(itemGroupId, itemId, params)
                        .then(function (response) {
                            $scope.historyList.extend(response.plain().results);
                            $scope.pagination.totalItems = response.count;
                            $scope.loading = false;
                            $scope.loadingPaginated = false;
                            if($scope.pagination.totalPages == null)
                                $scope.pagination.totalPages = Math.ceil($scope.pagination.totalItems/$scope.pagination.pageSize);

                        })
                        .catch(function (error) {
                            $scope.loading = false;
                            $scope.loadingPaginated = false;
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

                $scope.setDateRangeButton = function() {
                    if ($scope.date.startDate !== null) {
                        let date = new Date($scope.date.startDate);
                        let monthDay = date.getDate().toString();
                        let month = (date.getMonth()+1).toString();
                        let year = date.getFullYear().toString();
                        $scope.date.startDate = year.concat('-').concat(month).concat('-').concat(monthDay);
                    }
                    if ($scope.date.endDate !== null) {
                        let date = new Date($scope.date.endDate);
                        let monthDay = date.getDate().toString();
                        let month = (date.getMonth()+1).toString();
                        let year = date.getFullYear().toString();
                        $scope.date.endDate = year.concat('-').concat(month).concat('-').concat(monthDay);
                    }
                    let startDate = Date.parse($scope.date.startDate);
                    let endDate = Date.parse($scope.date.endDate);
                    if (startDate > endDate) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.INVALID_DATE_RANGE)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        return;
                    }
                    if($scope.date.startDate && $scope.date.endDate)
                        $location.search({'start_date': $scope.date.startDate, 'end_date': $scope.date.endDate});
                    else if($scope.date.startDate)
                        $location.search({'start_date': $scope.date.startDate});
                    else if($scope.date.endDate)
                        $location.search({'end_date': $scope.date.endDate});
                }

                $scope.clearDateRangeButton = function() {
                    $scope.date.startDate = null;
                    $scope.date.endDate = null;
                    $location.search({});
                }

                let stateWatcher = function () {
                    $scope.$watchCollection('historyList', function (newVal, oldVal) {
                        if (newVal != null) $scope.empty = newVal.length === 0;
                    });
                }

                $scope.pageChanged = function() {
                    if ($scope.pagination.currentPage == null)
                        $scope.pagination.currentPage = 0;
                    $scope.get_history();
                };

                $scope.searchItemButton = function() {
                    $scope.pagination.currentPage = 1;
                    $location.search({search: $scope.search.word});
                }

                $scope.$on("$locationChangeStart", function(event, next, current) {
                    $scope.loading = true;
                    $scope.pagination.currentPage = null;
                    $scope.pagination.totalPages = null;
                    $scope.historyList = [];
                    $scope.get_history();
                });

                stateWatcher();
                $scope.get_history();
            }])
})();
