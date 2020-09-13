(function () {
    'use strict';

    angular.module('appModule').controller('RequestItemGroupDialogController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', '$stateParams', 'CONSTANTS', 'itemGroup',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, $stateParams, CONSTANTS, itemGroup){

                $scope.dialogName = CONSTANTS.TITLE.REQUEST_ITEM;
                $scope.itemGroup = itemGroup;
                $scope.quantity = 1;
                $scope.disableItemType = true;
                $scope.types = CONSTANTS.REQUEST_ITEM_TYPES;
                $scope.duration = null;

                $scope.selectedType = $scope.types[2].code;

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

                $scope.incrementQuantity = function() {
                    $scope.quantity++;
                }

                $scope.decrementQuantity = function() {
                    if ($scope.quantity <= 1) return;
                    $scope.quantity--;
                }

                $scope.submitItem = function () {
                    if ($scope.quantity < 1) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.ZERO_OR_NEGATIVE_QUANTITY_ERROR)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        return;
                    }
                    else if (!$scope.itemGroup.is_accessory && $scope.quantity > 1) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.INVALID_QUANTITY_ERROR)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        return;
                    }
                    else if ($scope.selectedType !== $scope.types[2].code && $scope.duration <= 0) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(CONSTANTS.MESSAGES.INVALID_DURATION)
                            .position('top center')
                            .hideDelay(3000)
                        );
                        return;
                    }

                    let data = {
                        quantity: $scope.quantity,
                        type: $scope.selectedType,
                    };
                    if($scope.selectedType !== $scope.types[2].code)
                        data['requested_duration'] = $scope.duration;
                    inventoryService.request_item_group($scope.itemGroup.id, data).then(function (response) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(CONSTANTS.MESSAGES.REQUEST_SUCCESS)
                                .position('top center')
                                .hideDelay(3000)
                            );
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

            }])
})();
