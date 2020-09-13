(function () {
    'use strict';

    angular.module('appModule').controller('UpdateItemDialogController',
        ['$scope', '$mdDialog', '$mdToast', '$state', 'inventoryService', 'item', 'CONSTANTS', 'itemGroup', 'on_complete',
            function($scope, $mdDialog, $mdToast, $state, inventoryService, item, CONSTANTS, itemGroup, on_complete){

                $scope.dialogName = CONSTANTS.TITLE.UPDATE_ITEM;
                $scope.submitName = CONSTANTS.BUTTON.UPDATE;
                $scope.disableItemGroup = false;
                $scope.disableItemType = false;
                $scope.selectedGroup = itemGroup;

                $scope.itemDetails = {
                    id: item.id,
                    is_assigned: item.is_assigned,
                    type: item.type,
                    quantity: item.quantity,
                    attributes: item.attributes
                }

                $scope.submitItem = function() {                    
                    inventoryService.update_item(itemGroup.id, $scope.itemDetails)
                        .then(function (response) {
                            $scope.$on('$destroy', function() {
                                on_complete(response);
                            });
                            $mdDialog.cancel();
                        })
                        .catch(function (error) {
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

                $scope.incrementQuantity = function() {
                    $scope.itemDetails.quantity++;
                }

                $scope.decrementQuantity = function() {
                    if ($scope.quantity <= 1) return;
                    $scope.itemDetails.quantity--;
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

            }])
})();
