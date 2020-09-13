(function () {
    'use strict';
    angular.module('appModule').directive('compareTo', [function() {
        return {
            require: "ngModel",
            scope: {
                password: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue === scope.password;
                };

                scope.$watch("confirmPassword", function() {
                    ngModel.$validate();
                });
            }
        };
    }]);
})();