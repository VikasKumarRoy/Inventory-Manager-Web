(function () {
    'use strict';

    angular.module('appModule').controller('UpdateDialogController',
        ['$scope', '$mdDialog', '$mdToast', '$state', 'inventoryService', 'itemGroup', 'on_complete', 'CONSTANTS',
            function($scope, $mdDialog, $mdToast, $state, inventoryService, itemGroup, on_complete, CONSTANTS){

                $scope.dialogName = CONSTANTS.TITLE.UPDATE_ITEM_GROUP;
                $scope.submitName = CONSTANTS.BUTTON.UPDATE;
                $scope.disableAccessory = false;

                $scope.itemGroup = {
                    id: itemGroup.id,
                    item_name : itemGroup.item_name,
                    is_accessory : itemGroup.is_accessory
                }

                $scope.addItemGroup = function() {                    
                    inventoryService.update_item_group($scope.itemGroup)
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

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }

            }])
})();
