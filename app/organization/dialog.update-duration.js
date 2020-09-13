(function () {
    'use strict';

    angular.module('appModule').controller('UpdateDurationDialogController',
        ['$scope', '$mdDialog', '$mdToast', '$state', 'requestService', 'request', 'on_complete',
            function($scope, $mdDialog, $mdToast, $state, requestService, request, on_complete){

                $scope.data = {
                    approved_duration: request.approved_duration
                }

                $scope.updateDuration = function() {                   
                    requestService.update_approved_duration(request.id, $scope.data)
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
