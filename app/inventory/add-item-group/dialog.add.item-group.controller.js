(function () {
    'use strict';

    angular.module('appModule').controller('DialogAddItemGroupController',
        ['inventoryService', '$scope', '$mdDialog', '$mdToast', '$state', 'CONSTANTS',
            function(inventoryService, $scope, $mdDialog, $mdToast, $state, CONSTANTS){

                $scope.dialogName = CONSTANTS.TITLE.ADD_ITEM_GROUP;
                $scope.submitName = CONSTANTS.BUTTON.ADD;
                $scope.disableAccessory = true;

                $scope.itemGroup = {
                    item_name : '',
                    is_accessory : false
                }

                $scope.addItemGroup = function() {
                    inventoryService.add_item_group($scope.itemGroup)
                        .then(function (response) {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(CONSTANTS.MESSAGES.ADD_ITEM_GROUP_SUCCESS)
                                .position('top center')
                                .hideDelay(3000)
                            );
                            $scope.$root.$broadcast(CONSTANTS.EVENTS.ADD_ITEM_GROUP, response.plain());
                            $mdDialog.cancel();
                        })
                        .catch(function (error) {
                            if (error.status === 400) {
                                if ('item_name' in error.data) {
                                    $mdToast.show(
                                        $mdToast.simple()
                                        .textContent(error.data['item_name'][0])
                                        .position('top center')
                                        .hideDelay(3000)
                                    ); 
                                }
                            }
                        });
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                }
            }])
})();
