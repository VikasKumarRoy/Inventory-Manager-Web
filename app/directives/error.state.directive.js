(function () {
    'use strict';

    angular.module('appModule')
        .directive('error', function (attrs) {
            let msg = (attrs.message.length===0) ? 'Something went wrong, please try again later</div>' : attrs.message+"</div>";
            let emptyText = "<div class=\"alert alert-warning\" role=\"alert\" style='font-size: 20px;'>";
            return {
                restrict: 'EA',
                template: emptyText+msg
            }
        });
})();