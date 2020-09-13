(function () {
    'use strict';

    angular.module('appModule').controller('UpdateController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', 'CONSTANTS', '$location',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, CONSTANTS, $location){

                $scope.pageTitle = CONSTANTS.TITLE.UPDATE_ITEM_GROUPS;
                $scope.hasButtons = true;
                $scope.firstButtonName = CONSTANTS.BUTTON.UPDATE;
                $scope.secondButtonName = CONSTANTS.BUTTON.DELETE;
                $scope.firstButtonShow = true;
                $scope.secondButtonShow = true;
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
                        $scope.itemGroupList.unshift(itemGroup);
                    else {
                        $scope.itemGroupList.pop();
                        $scope.itemGroupList.unshift(itemGroup);
                    }
                });

                $scope.get_item_groups = function () {

                    if ($scope.pagination.currentPage == null || $scope.pagination.currentPage === 0)
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
                            let errorMessage = error.data.detail;
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

                $scope.removeitemGroup = function(itemGroup) {
                    inventoryService.remove_item_group(itemGroup.id)
                        .then(function (response) {
                            let index = $scope.itemGroupList.indexOf(itemGroup);
                            $scope.itemGroupList.splice(index, 1);
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

                $scope.secondButtonDialog = function(ev, itemGroup) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to delete ${itemGroup.item_name}?`)
                        .textContent(`All of the items present in ${itemGroup.item_name} group will be deleted.`)
                        .targetEvent(ev)
                        .ok('DELETE')
                        .cancel('CANCEL');

                    $mdDialog.show(confirm).then(function() {
                        $scope.removeitemGroup(itemGroup);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.firstButtonDialog = function(ev, itemGroup) {
                    $mdDialog.show({
                        locals:{
                            itemGroup: itemGroup,
                            on_complete: function(data) {
                                let ind = $scope.itemGroupList.findIndex(x => x.id === data.id);
                                $scope.itemGroupList[ind].item_name = data.item_name;
                            }
                        },
                        controller: CONSTANTS.CONTROLLERS.UPDATE_DIALOG_CONTROLLER,
                        templateUrl: CONSTANTS.TEMPLATE.ITEM_GROUP_DIALOG,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                    })
                }

                $scope.showItemList = function(itemGroup) {                    
                    $state.go(CONSTANTS.STATES.LIST_ITEM, {itemGroupId: itemGroup.id});
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
                    $scope.selectedFilter = ($location.search().filter === undefined) ? 'All' : $location.search().filter
                    if($scope.pagination.currentPage > $scope.pagination.totalPages) {
                        $scope.pagination.currentPage = Math.max($scope.pagination.totalPages, 1);   
                    }
                    $scope.get_item_groups();
                });

                $scope.pagination.currentPage =  ($location.search().page === undefined) ? 1 : $location.search().page;
                $scope.get_item_groups();

            }])
})();
