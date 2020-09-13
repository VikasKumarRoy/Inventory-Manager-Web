(function() {
    'use strict';

    angular.module('appModule').service('inventoryService' , 
        ['Restangular', 'CONSTANTS', function(Restangular, CONSTANTS) {

            return {
                add_item_group: function (itemGroup) {
                    let baseItemGroup = Restangular.all(CONSTANTS.ROUTES.ADD_ITEM_GROUP);
                    return baseItemGroup.post(itemGroup);
                },
                update_item_group: function (itemGroup) {
                    let baseItemGroup = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroup.id+'/');
                    return baseItemGroup.customPUT(itemGroup);
                },
                get_item_group: function (params) {
                    let baseItemGroup = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP);
                    return baseItemGroup.get(params);
                },
                get_item_group_all: function () {
                    let baseItemGroup = Restangular.all(CONSTANTS.ROUTES.ADD_ITEM_GROUP);
                    return baseItemGroup.getList();
                },
                get_item_group_by_id: function (itemGroupId) {
                    let baseItemGroup = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId);
                    return baseItemGroup.get();
                },
                remove_item_group: function (itemGroupId) {
                    let baseItemGroup = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId);
                    return baseItemGroup.remove();
                },
                add_item: function (itemGroupId, itemBody) {
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).all(CONSTANTS.ROUTES.ADD_ITEM);
                    return baseItem.post(itemBody);
                },
                get_item_list: function(itemGroupId, params){
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM);
                    return baseItem.get(params);
                },
                get_item_history: function(itemGroupId, itemId, params) {
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM, itemId).one('history');
                    return baseItem.get(params);
                },
                get_item_list_with_params: function(itemGroupId, params){
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM);
                    return baseItem.get(params);
                },
                get_item_list_to_approve_for_user: function(itemGroupId, params) {
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM).one(CONSTANTS.ROUTES.USER);
                    return baseItem.get(params);
                },
                remove_item: function(itemGroupId, itemId){
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM, itemId);
                    return baseItem.remove();
                },
                update_item: function (itemGroupId, item) {
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.ADD_ITEM, item.id+'/');
                    return baseItem.customPUT(item);
                },
                request_item_group: function (itemGroupId, data) {
                    let baseItem = Restangular.one(CONSTANTS.ROUTES.ADD_ITEM_GROUP, itemGroupId).one(CONSTANTS.ROUTES.REQUEST+'/');
                    return baseItem.customPOST(data);
                }
            }

        }]);
})();