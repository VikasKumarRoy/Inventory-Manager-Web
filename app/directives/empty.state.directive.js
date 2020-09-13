(function () {
    'use strict';

    angular.module('appModule')
        .directive('empty', function () {
            let emptyText = "<div class=\"alert alert-info\" role=\"alert\" style='font-size: 20px;'>IT's ALL EMPTY HERE.</div>";
            return {
                restrict: 'EA',
                template: emptyText
            }
        });
})();
