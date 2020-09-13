(function () {
    'use strict';

    angular.module('appModule').controller('HistoryItemController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', '$location',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, $location) {

                $scope.hasButtons = false;
                $scope.firstButtonShow = false;
                $scope.secondButtonShow = false;

                $scope.listGridViewCol = [0,1,2,3];
                $scope.itemGroupName ="";
                let itemGroupId = $stateParams.itemGroupId;
                let itemGroup = undefined;
                $scope.loading = true;
                $scope.empty = false;
                $scope.itemList = [];
                $scope.pagination = {
                    currentPage: ($location.search().page === undefined) ? 1 : $location.search().page,
                    maxSize:CONSTANTS.MAX_PAGE_SIZE,
                    totalItems: undefined,
                    pageSize: CONSTANTS.PAGE_SIZE,
                    totalPages: null
                };
                $scope.search = {
                    word: ($location.search().search === undefined) ? '' : $location.search().search
                };

                if ($scope.search.word===undefined || $scope.search.word.length === 0)
                    $location.search({page: $scope.pagination.currentPage});
                else $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});

                $scope.$on(CONSTANTS.EVENTS.ADD_ITEM,function(event, item){
                    if($scope.itemList.length < $scope.pagination.pageSize)
                        $scope.itemList.push(item);
                });

                inventoryService.get_item_group_by_id(itemGroupId)
                    .then(function (response) {
                        itemGroup = response;
                        $scope.itemGroupName = itemGroup.item_name;
                        $scope.get_item_list();
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
                    });

                $scope.get_item_list = function () {

                    if ($scope.pagination.currentPage == null || $scope.pagination.currentPage === 0)
                        $scope.pagination.currentPage = 1;

                    let params = {
                        'page': $scope.pagination.currentPage,
                        'page_size': $scope.pagination.pageSize,
                        'search': $scope.search.word
                    };

                    inventoryService.get_item_list(itemGroupId, params)
                        .then(function (response) {
                            $scope.itemList = response.results;
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

                $scope.secondButtonDialog = function(ev, item) {
                    let confirm = $mdDialog.confirm()
                        .title(`Would you like to delete this item ?`)
                        .textContent(`The item will be deleted permanently.`)
                        .targetEvent(ev)
                        .ok('DELETE')
                        .cancel('CANCEL');

                    $mdDialog.show(confirm).then(function() {
                        $scope.removeItem(item);
                    }, function() {
                        $mdDialog.cancel();
                    });
                }

                $scope.removeItem = function(item) {
                    inventoryService.remove_item(itemGroupId, item.id)
                        .then(function (response) {
                            let index = $scope.itemList.indexOf(item);
                            $scope.itemList.splice(index, 1);
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

                $scope.firstButtonDialog = function(ev, item) {

                    let copyItem = JSON.parse(JSON.stringify(item));
                    let copyItemGroup = JSON.parse(JSON.stringify(itemGroup));

                    $mdDialog.show({
                        locals:{
                            item: copyItem,
                            itemGroup: copyItemGroup,
                            on_complete: function(data) {
                                let ind = $scope.itemList.findIndex(x => x.id === data.id);
                                if (itemGroup.is_accessory) {
                                    $scope.itemList[ind].quantity = data.quantity;
                                }
                                $scope.itemList[ind].attributes = data.attributes;
                            }
                        },
                        controller: CONSTANTS.CONTROLLERS.UPDATE_ITEM_DIALOG_CONTROLLER,
                        templateUrl: CONSTANTS.TEMPLATE.ITEM_DIALOG,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                    })
                }

                $scope.showHistory = function(item) {
                    $state.go(CONSTANTS.STATES.HISTORY, {itemGroupId: itemGroupId, itemId: item.id});
                }

                let stateWatcher = function () {
                    $scope.$watchCollection('itemList', function (newVal, oldVal) {
                        if (newVal != null) $scope.empty = newVal.length === 0;
                    });
                }

                stateWatcher();

                $scope.pageChanged = function() {
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage});
                    else $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});
                };

                $scope.searchItemButton = function() {
                    $scope.pagination.currentPage = 1;
                    if ($scope.search.word.length === 0)
                        $location.search({page: $scope.pagination.currentPage});
                    else $location.search({page: $scope.pagination.currentPage, search: $scope.search.word});
                }

                $scope.$on("$locationChangeStart", function(event, next, current) {
                    $scope.loading = true;
                    $scope.pagination.currentPage = ($location.search().page === undefined) ? 1 : $location.search().page;
                    $scope.search.word = ($location.search().search === undefined) ? '' : $location.search().search;
                    if($scope.pagination.currentPage > $scope.pagination.totalPages) {
                        $scope.pagination.currentPage = $scope.pagination.totalPages;
                    }
                    $scope.get_item_list();
                });

            }])
})();
