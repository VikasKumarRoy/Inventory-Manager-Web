(function() {
    'use strict';

    angular.module('appModule').service('requestService' , 
        ['Restangular', 'CONSTANTS', function(Restangular, CONSTANTS) {

            return {
                get_my_requests: function (params) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_REQUESTS);
                    return baseRequest.get(params);
                },
                get_all_requests: function (params) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS);
                    return baseRequest.get(params);
                },
                get_all_approved_requests: function (params) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS).one(CONSTANTS.ROUTES.APPROVED);
                    return baseRequest.get(params);
                },
                get_all_requests_stats: function () {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS + 'stats/');
                    return baseRequest.get();
                },
                get_all_approved_requests_stats: function () {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS).one(CONSTANTS.ROUTES.APPROVED + 'stats/');
                    return baseRequest.get();
                },
                update_approved_duration: function(requestId, data) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS).one(CONSTANTS.ROUTES.APPROVED, requestId + '/');
                    return baseRequest.patch(data);
                },
                get_approved_requests: function (params) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_APPROVED);
                    return baseRequest.get(params);
                },
                cancel_my_request: function (requestId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_REQUESTS, requestId);
                    return baseRequest.remove();
                },
                get_pending_requests: function(params) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MANAGE_REQUESTS);
                    return baseRequest.get(params);
                },
                reject_item_request: function(requestId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MANAGE_REQUESTS, requestId);
                    return baseRequest.remove();
                },
                approve_item_request: function(requestId, itemId, data) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MANAGE_REQUESTS, requestId)
                                                 .one(CONSTANTS.ROUTES.ADD_ITEM, itemId)
                                                 .all(CONSTANTS.ROUTES.APPROVE);
                    return baseRequest.post(data);    
                },
                acknowledge_approved_request: function(requestId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_APPROVED, requestId).all(CONSTANTS.ROUTES.ACKNOWLEDGE_ITEM);
                    return baseRequest.post({});
                },
                return_item: function(requestId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.MY_APPROVED, requestId).all(CONSTANTS.ROUTES.RETURN_ITEM);
                    return baseRequest.post({});
                },
                send_reminder_notification: function(requestId) {
                    let baseRequest = Restangular.one(CONSTANTS.ROUTES.ALL_REQUESTS).one(CONSTANTS.ROUTES.APPROVED,requestId).one('send_reminder/');
                    return baseRequest.get();
                }
            }

        }]);
})();
