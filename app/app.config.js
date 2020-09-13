(function () {
    'use strict';

    angular.module('appModule').config(['$stateProvider', '$urlRouterProvider', 'CONSTANTS',
        function($stateProvider, $urlRouterProvider, CONSTANTS) {

            let states = [
                {
                    name: CONSTANTS.STATES.LOGIN,
                    url: '/login',
                    templateUrl: CONSTANTS.TEMPLATE.LOGIN,
                    controller: CONSTANTS.CONTROLLERS.LOGIN
                },
                {
                    name: CONSTANTS.STATES.SIGNUP,
                    url: '/signup/:id',
                    templateUrl: CONSTANTS.TEMPLATE.SIGNUP,
                    controller: CONSTANTS.CONTROLLERS.SIGNUP
                },
                {
                    name: CONSTANTS.STATES.SIDEBAR,
                    url: '',
                    templateUrl: CONSTANTS.TEMPLATE.SIDEBAR,
                    controller: CONSTANTS.CONTROLLERS.SIDEBAR
                },
                {
                    name: CONSTANTS.STATES.DASHBOARD,
                    url: '/dashboard',
                    templateUrl: CONSTANTS.TEMPLATE.MY_REQUESTS,
                    controller: CONSTANTS.CONTROLLERS.MY_REQUESTS
                },
                {
                    name: CONSTANTS.STATES.LIST_ITEM_GROUP,
                    url: '/item_group',
                    templateUrl: CONSTANTS.TEMPLATE.ITEM_GROUP_LIST,
                    controller: CONSTANTS.CONTROLLERS.LIST_ITEM_GROUP
                },
                {
                    name: CONSTANTS.STATES.LIST_ITEM,
                    url: '/item_group/:itemGroupId/item',
                    templateUrl: CONSTANTS.TEMPLATE.LIST_ITEM,
                    controller: CONSTANTS.CONTROLLERS.LIST_ITEM
                },
                {
                    name: CONSTANTS.STATES.REQUEST_ITEM_GROUP,
                    url: '/request',
                    templateUrl: CONSTANTS.TEMPLATE.ITEM_GROUP_LIST,
                    controller: CONSTANTS.CONTROLLERS.REQUEST_ITEM_GROUP
                },
                {
                    name: CONSTANTS.STATES.MANAGE_REQUESTS,
                    url: '/manage_requests',
                    templateUrl: CONSTANTS.TEMPLATE.MANAGE_REQUESTS,
                    controller: CONSTANTS.CONTROLLERS.MANAGE_REQUESTS
                },
                {
                    name: CONSTANTS.STATES.PROFILE,
                    url: '/profile',
                    templateUrl: CONSTANTS.TEMPLATE.PROFILE,
                    controller: CONSTANTS.CONTROLLERS.PROFILE
                },
                {
                    name: CONSTANTS.STATES.HISTORY_SELECT_GROUP,
                    url: '/select-item-group',
                    templateUrl: CONSTANTS.TEMPLATE.ITEM_GROUP_LIST,
                    controller: CONSTANTS.CONTROLLERS.HISTORY_ITEM_GROUP
                },
                {
                    name: CONSTANTS.STATES.HISTORY_SELECT_ITEM,
                    url: '/select-item-group/:itemGroupId',
                    templateUrl: CONSTANTS.TEMPLATE.LIST_ITEM,
                    controller: CONSTANTS.CONTROLLERS.HISTORY_ITEM
                },
                {
                    name: CONSTANTS.STATES.HISTORY,
                    url: '/select-item-group/:itemGroupId/select-item/:itemId',
                    templateUrl: CONSTANTS.TEMPLATE.HISTORY,
                    controller: CONSTANTS.CONTROLLERS.HISTORY
                },
                {
                    name: CONSTANTS.STATES.MY_ORGANIZATION,
                    url: '/my_organization',
                    templateUrl: CONSTANTS.TEMPLATE.ORGANIZATION_REQUESTS,
                    controller: CONSTANTS.CONTROLLERS.MY_ORGANIZATION
                },
            ]

            states.forEach((state) => $stateProvider.state(state));
            $urlRouterProvider.otherwise('/login');
    }]);
    
})();
