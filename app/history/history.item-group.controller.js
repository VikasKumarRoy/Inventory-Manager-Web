(function () {
    'use strict';

    angular.module('appModule').controller('HistoryItemGroupController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', 'CONSTANTS', '$location',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, CONSTANTS, $location){

                $scope.pageTitle = CONSTANTS.TITLE.ITEM_GROUP;
                $scope.hasButtons = false;
                $scope.firstButtonShow = false;
                $scope.secondButtonShow = false;
                $scope.loading = true;
                $scope.empty = false;
                $scope.itemGroupList = null;
                $scope.filterOptions = Object.values(CONSTANTS.FILTER_OPTIONS);
                $scope.selectedFilter = ($location.search().filter === undefined) ? 'All' : $location.search().filter;
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
                    $location.search({page: $scope.pagination.currentPage, filter: $scope.selectedFilter});
                else 
                    $location.search({page: $scope.pagination.currentPage, filter: $scope.selectedFilter, search: $scope.search.word});

                $scope.$on(CONSTANTS.EVENTS.ADD_ITEM_GROUP,function(event, itemGroup){
                    if($scope.itemGroupList.length < $scope.pagination.pageSize)
                        $scope.itemGroupList.push(itemGroup);
                });

                $scope.get_item_groups = function () {

                    if ($scope.pagination.currentPage === null || $scope.pagination.currentPage === 0)
                        $scope.pagination.currentPage = 1;

                    let params = {
                        'page': $scope.pagination.currentPage,
                        'page_size': $scope.pagination.pageSize,
                        'search': $scope.search.word
                    };

                    $scope.selectedFilter = ($location.search().filter === undefined) ? 'All' : $location.search().filter;

                    if($scope.selectedFilter === $scope.filterOptions[1]){
                        params['is_accessory'] = true;
                    }
                    else if($scope.selectedFilter === $scope.filterOptions[2]){
                        params['is_accessory'] = false;
                    }

                    inventoryService.get_item_group(params)
                        .then(function (response) {
                            $scope.itemGroupList = response.results;
                            $scope.pagination.totalItems = response.count;
                            $scope.loading = false;
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

                $scope.showItemList = function(itemGroup) {
                    $state.go(CONSTANTS.STATES.HISTORY_SELECT_ITEM, {itemGroupId: itemGroup.id});
                }

                let stateWatcher = function () {
                    $scope.$watchCollection('itemGroupList', function (newVal, oldVal) {
                        if (newVal != null) $scope.empty = newVal.length === 0;
                    });
                }

                stateWatcher();

                $scope.applyFilterButton = function() {
                    $scope.pagination.currentPage = 1;
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage, filter: $scope.selectedFilter});
                    else
                        $location.search({page: $scope.pagination.currentPage, search: $scope.search.word, filter: $scope.selectedFilter});

                }

                $scope.pageChanged = function() {
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage, filter: $scope.selectedFilter});
                    else $location.search({page: $scope.pagination.currentPage, search: $scope.search.word, filter: $scope.selectedFilter});
                };

                $scope.searchItemGroupButton = function() {
                    $scope.pagination.currentPage = 1;
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage, filter: $scope.selectedFilter});
                    else $location.search({page: $scope.pagination.currentPage, search: $scope.search.word, filter: $scope.selectedFilter});
                }

                $scope.$on("$locationChangeStart", function(event, next, current) {
                    $scope.loading = true;
                    $scope.selectedFilter = $location.search().filter;
                    $scope.pagination.currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                    $scope.search.word = ($location.search().search === undefined) ? '' : $location.search().search;
                    if($scope.pagination.currentPage > $scope.pagination.totalPages) {
                        $scope.pagination.currentPage = $scope.pagination.totalPages;
                    }
                    $scope.get_item_groups();
                });

                $scope.get_item_groups();

            }])
})();
