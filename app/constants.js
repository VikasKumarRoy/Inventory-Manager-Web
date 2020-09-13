(function () {
    'use strict';

    angular.module('appModule').constant('CONSTANTS', {
        BASE_URL : 'http://127.0.0.1:8000/',
        AUTH_TOKEN_COOKIE_ID: 'AuthTokenCookie',
        PAGE_SIZE: 12,
        MAX_PAGE_SIZE: 21,
        DEFAULT_PROFILE_PIC: "http://placehold.jp/3d4070/3d4070/150x150.png",
        ROUTES: {
            AUTH: {
                AUTHENTICATION: 'authentication/',
                LOGIN: 'login/',
                SIGNUP: 'signup/',
                LOGOUT: 'logout/',
            },
            INVITE: 'invite/',
            USER: 'user/',
            ADD_ITEM_GROUP: 'item_group/',
            ADD_ITEM: 'item/',
            REQUEST: 'request/',
            MY_REQUESTS: 'my_requests/',
            MANAGE_REQUESTS: 'manage_requests/',
            APPROVE: 'approve/',
            APPROVED: 'approved/',
            MY_APPROVED: 'my_approved/',
            ACKNOWLEDGE_ITEM: 'acknowledge_item/',
            RETURN_ITEM: 'return_item/',
            ALL_REQUESTS: 'my_organization_requests/'
        },
        STATES: {
            LOGIN: 'login',
            SIGNUP: 'signup',
            SIDEBAR: 'sidebar',
            DASHBOARD: 'sidebar.dashboard',
            LIST_ITEM_GROUP: 'sidebar.listItemGroup',
            LIST_ITEM: 'sidebar.listItem',
            REQUEST_ITEM_GROUP: 'sidebar.requestItemGroup',
            MY_REQUESTS: 'sidebar.myRequests',
            MANAGE_REQUESTS: 'sidebar.manageRequests',
            PROFILE: 'sidebar.profile',
            HISTORY_SELECT_GROUP: 'sidebar.historySelectItemGroup',
            HISTORY_SELECT_ITEM: 'sidebar.historySelectItem',
            HISTORY: 'sidebar.history',
            MY_ORGANIZATION: 'sidebar.myOrganization'
        },
        TEMPLATE: {
            LOGIN: 'app/auth/login.html',
            SIGNUP: 'app/auth/signup.html',
            HEADER: 'app/header/header.html',
            SIDEBAR: 'app/sidebar/sidebar.html',
            ITEM_GROUP_LIST: 'app/inventory/item-group-list/item-group-list.html',
            DASHBOARD: 'app/dashboard/dashboard.html',
            INVITE_DIALOG: 'app/invite/dialog.invite.html',
            ITEM_GROUP_DIALOG: 'app/inventory/add-item-group/dialog.item.group.html',
            ITEM_DIALOG: 'app/inventory/add-item/dialog.item.html',
            LIST_ITEM: 'app/inventory/item-list/item-list.html',
            REQUEST_ITEM_GROUP: 'app/inventory/request-item-group/request.dialog.html',
            MY_REQUESTS: 'app/requests/my-requests/my-requests.html',
            MANAGE_REQUESTS: 'app/requests/manage-requests/manage-requests.html',
            PROFILE: 'app/profile/profile.html',
            EDIT_PROFILE_DIALOG: 'app/profile/dialog.edit.profile.html',
            EDIT_PROFILE_PIC_DIALOG: 'app/profile/dialog.edit-profile-pic.html',
            APPROVE_REQUEST_DIALOG: 'app/requests/manage-requests/dialog.approve-request.html',
            HISTORY: 'app/history/history.html',
            ORGANIZATION_REQUESTS: 'app/organization/organization-requests.html',
            UPDATE_DURATION_DIALOG: 'app/organization/dialog.update-duration.html'
        },
        VIEWS: {
            HEADER: 'header',
            SIDEBAR: 'sidebar',
            MAIN: 'main'
        },
        CONTROLLERS: {
            SIGNUP: 'SignUpController',
            LOGIN: 'LoginController',
            DASHBOARD: 'DashboardController',
            SIDEBAR: 'SidebarController',
            INVITE: 'InviteController',
            LIST_ITEM_GROUP: 'UpdateController',
            ADD_ITEM_GROUP: 'DialogAddItemGroupController',
            ADD_ITEM: 'DialogAddItemController',
            UPDATE_DIALOG_CONTROLLER: 'UpdateDialogController',
            UPDATE_ITEM_DIALOG_CONTROLLER: 'UpdateItemDialogController',
            LIST_ITEM: 'ItemListController',
            REQUEST_ITEM_GROUP: 'RequestItemGroupController',
            REQUEST_ITEM_GROUP_DIALOG: 'RequestItemGroupDialogController',
            MY_REQUESTS: 'MyRequestsController',
            MANAGE_REQUESTS: 'ManageRequestsController',
            PROFILE: 'ProfileController',
            APPROVE_DIALOG_CONTROLLER: 'ApproveDialogController',
            EDIT_PROFILE: 'EditProfileController',
            EDIT_PROFILE_PIC: 'EditProfilePicController',
            HISTORY_ITEM_GROUP: 'HistoryItemGroupController',
            HISTORY_ITEM: 'HistoryItemController',
            HISTORY: 'HistoryController',
            MY_ORGANIZATION: 'MyOrganizationController',
            UPDATE_DURATION_DIALOG_CONTROLLER: 'UpdateDurationDialogController'
        },
        SIDEBAR_ITEMS: {
            ADMIN: [
                {
                    name: 'DASHBOARD',
                    icon: 'fa fa-home fa-2x'
                },
                {
                    name: 'SEND INVITES',
                    icon: 'fa fa-envelope fa-2x'
                },
                {
                    name: 'MONITOR REQUESTS',
                    icon: 'fa fa-book fa-2x'
                },
                {
                    name: 'ADD ITEM GROUP',
                    icon: 'fa fa-plus fa-2x'
                },
                {
                    name: 'ADD ITEM',
                    icon: 'fa fa-plus-square-o fa-2x'
                },
                {
                    name: 'UPDATE ITEMS',
                    icon: 'fa fa-pencil-square-o fa-2x'
                },
                {
                    name: 'REQUEST AN ITEM',
                    icon: 'fa fa-shopping-cart fa-2x'
                },
                {
                    name: 'MANAGE REQUESTS',
                    icon: 'fa fa-bar-chart-o fa-2x'
                },
                {
                    name: 'ITEM HISTORY',
                    icon: 'fa fa-history fa-2x'
                },
            ],
            MANAGER: [
                {
                    name: 'DASHBOARD',
                    icon: 'fa fa-home fa-2x'
                },
                {
                    name: 'MONITOR REQUESTS',
                    icon: 'fa fa-book fa-2x'
                },
                {
                    name: 'ADD ITEM GROUP',
                    icon: 'fa fa-plus fa-2x'
                },
                {
                    name: 'ADD ITEM',
                    icon: 'fa fa-plus-square-o fa-2x'
                },
                {
                    name: 'UPDATE ITEMS',
                    icon: 'fa fa-pencil-square-o fa-2x'
                },
                {
                    name: 'REQUEST AN ITEM',
                    icon: 'fa fa-shopping-cart fa-2x'
                },
                {
                    name: 'MANAGE REQUESTS',
                    icon: 'fa fa-bar-chart-o fa-2x'
                },
                {
                    name: 'ITEM HISTORY',
                    icon: 'fa fa-history fa-2x'
                },
            ],
            USER: [
                {
                    name: 'DASHBOARD',
                    icon: 'fa fa-home fa-2x'
                },
                {
                    name: 'REQUEST AN ITEM',
                    icon: 'fa fa-shopping-cart fa-2x'
                },
                {
                    name: 'MANAGE REQUESTS',
                    icon: 'fa fa-bar-chart-o fa-2x'
                },
            ]
        },
        REQUEST_ITEM_TYPES: [
            {
                id: 0,
                name: 'RETURNABLE',
                code:14,
                is_accessory: false
            },
            {
                id: 1,
                name: 'SHAREABLE',
                code:13,
                is_accessory: false
            },
            {
                id: 2,
                name: 'PERMANENT',
                code:15,
                is_accessory: true
            }
        ],
        ROLES: {
            ADMIN: 4,
            MANAGER: 5,
            USER: 6
        },
        GENDERS: {
            MALE: 1,
            FEMALE: 2,
            OTHER: 3
        },
        MESSAGES: {
            SOMETHING_WENT_WRONG: 'Something went wrong, please try again later.',
            ZERO_OR_NEGATIVE_QUANTITY_ERROR: 'Quantity cannot be less than one.',
            INVALID_QUANTITY_ERROR: 'Cannot request more than one quantity of non-accessory items.',
            INVALID_DURATION: 'Cannot assign negative or zero duration.',
            INVALID_DATE_RANGE: "Start Date can't be greater than End Date",
            SERVER_ERROR: 'Encountered internal server error.',
            CONNECTION_LOST: 'Connection Lost. Try again after some time.',
            REQUEST_SUCCESS: 'Request successfully placed.',
            ADD_ITEM_SUCCESS: 'Item added successfully.',
            ADD_ITEM_GROUP_SUCCESS: 'Item Group added successfully',
            INVALID_APPROVE_REQUEST: "Can't assign item that is already assigned to other."
        },
        EVENTS: {
            ADD_ITEM_GROUP: 'ADD_ITEM_GROUP',
            ADD_ITEM: 'ADD_ITEM',
            UPDATE_ITEM_GROUP: 'UPDATE_ITEM_GROUP',
            UPDATE_ITEM: 'UPDATE_ITEM',
            CHANGE_PROFILE_PIC: 'CHANGE_PROFILE_PIC',
            CHANGE_PROFILE_INFO: 'CHANGE_PROFILE_INFO'
        },
        REQUEST_STATUS: {
            PENDING: 7,
            APPROVED: 8,
            CANCELLED: 9,
            REJECTED: 18
        },
        APPROVED_STATUS: {
            PENDING: 10,
            ACKNOWLEDGED: 11,
            RETURNED: 12
        },
        TITLE: {
            ITEM_GROUP: "Select Item Group",
            ADD_ITEM: "ADD ITEM",
            ADD_ITEM_GROUP: "ADD ITEM GROUP",
            UPDATE_ITEM_GROUPS: "Update Item Groups",
            UPDATE_ITEM_GROUP: "UPDATE ITEM GROUP",
            UPDATE_ITEM: 'UPDATE ITEM',
            REQUEST_ITEMS: 'Request Items',
            REQUEST_ITEM: 'REQUEST ITEM'
        },
        BUTTON: {
            UPDATE: 'UPDATE',
            DELETE: 'DELETE',
            ADD: 'ADD',
            REQUEST: 'REQUEST'
        },
        FILTER_OPTIONS: {
            ALL: 'All',
            ACCESSORY: 'Accessory',
            NON_ACCESSORY: 'Non-Accessory'
        }
    });

})();
