(function () {
    'use strict';

    angular.module('appModule').controller('DialogAddItemController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast','$state', 'CONSTANTS',
            function(inventoryService, $scope, $mdDialog, $mdToast,$state, CONSTANTS){

                $scope.dialogName = CONSTANTS.TITLE.ADD_ITEM;
                $scope.disableItemGroup = true;
                $scope.disableItemType = true;

                $scope.types = CONSTANTS.REQUEST_ITEM_TYPES;

                $scope.itemDetails = {
                    is_returnable: false,
                    type: $scope.types[2].code,
                    quantity: 1,
                    attributes: [{
                        attribute_name: '',
                        attribute_value: ''
                    }]
                };
                $scope.itemGroups = [];
                $scope.selectedGroup = undefined;

                $scope.incrementQuantity = function() {
                    $scope.itemDetails.quantity++;
                }

                $scope.decrementQuantity = function() {
                    if ($scope.quantity <= 1) return;
                    $scope.itemDetails.quantity--;
                }

                $scope.getItemGroups = function() {
                    inventoryService.get_item_group_all().then(function (response) {
                        $scope.itemGroups = response.plain();
                        if ($scope.itemGroups.length > 0) {
                            $scope.selectedGroup = $scope.itemGroups[0];
                            if ($scope.selectedGroup.is_accessory === false)
                                $scope.itemDetails.quantity = 1;
                        }

                    }).catch(function (error) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG)
                            .position('top center')
                            .hideDelay(3000)
                        ); 
                        $scope.cancel();
                    });
                }

                $scope.checkQuantity = function() {
                    if ($scope.selectedGroup.is_accessory === false)
                        $scope.itemDetails.quantity = 1;
                    else $scope.itemDetails.type = $scope.types[2].code;
                }

                $scope.addAttribute = function() {
                    $scope.itemDetails.attributes.push({
                        attribute_name: '',
                        attribute_value: ''
                    });
                }

                $scope.removeAttribute = function(item) {
                    let index = $scope.itemDetails.attributes.indexOf(item);
                    $scope.itemDetails.attributes.splice(index, 1);
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

                $scope.submitItem = function() {
                    inventoryService.add_item($scope.selectedGroup.id, $scope.itemDetails).then(function (response) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.ADD_ITEM_SUCCESS)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        $scope.$root.$broadcast(CONSTANTS.EVENTS.ADD_ITEM, response.plain());
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
                    })
                }

                $scope.getItemGroups();

            }])
})();
