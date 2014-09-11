app.factory('attributeSetService', ['$http', '$translate', function ($http, $translate) {

    var factory = {};
    var rootUrl = '/api/attributeSets/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        //return $http.get(rootUrl + '?lang=' + $translate.use()).then(function (result) {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);