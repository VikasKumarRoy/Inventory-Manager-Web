(function () {
    'use strict';

    angular.module('appModule').directive('biClick', function ($parse) {
        return {
            compile: function ($element, attr) {
                let handler = $parse(attr.biClick);
                return function (scope, element, attr) {
                    element.on('click', function (event) {
                        scope.$apply(function () {
                            let promise = handler(scope, {$event: event});
                            if (promise && angular.isFunction(promise.finally)) {
                                element.attr('disabled', true);
                                promise.finally(function () {
                                    element.attr('disabled', false);
                                });
                            }
                        });
                    });
                };
            }
        };
    });

})();