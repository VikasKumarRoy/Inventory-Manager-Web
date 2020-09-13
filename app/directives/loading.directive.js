(function () {
    'use strict';

    angular.module('appModule')
        .directive('loading', function () {
            let loadingSpinner = '<div class="spinner"> <div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
            return {
                restrict: 'EA',
                template: loadingSpinner
            }
        });
})();



