app.factory('productService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/products/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
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

    // related services

    factory.DeleteImageFiles = function (imageName) {
        // We need an ending slash "/" because imageId is a file name and contains a dot (".") that prevent us to hit the server 
        // With dot, the request behaves like a request for a static file, which don't expect to be served by a managed module
        // Of course, we can also enable managed module for all request, but that implies a performance degradation: http://forums.asp.net/t/1950107.aspx?WebAPI+2+Route+Attribute+with+string+parameter+containing+a+period+doesn+t+bind
        // return $http.delete(deleteUrl + "/");

        //var imageNameWithoutExtension = imageName.substring(0, imageName.indexOf('.'));
        return $http.delete(rootUrl + "images/" + imageName + "/");
    };

    factory.deleteImageForProduct = function (imageName, productId) {
        // We need an ending slash "/" because imageId is a file name and contains a dot (".") that prevent us to hit the server 
        // With dot, the request behaves like a request for a static file, which don't expect to be served by a managed module
        // Of course, we can also enable managed module for all request, but that implies a performance degradation: http://forums.asp.net/t/1950107.aspx?WebAPI+2+Route+Attribute+with+string+parameter+containing+a+period+doesn+t+bind
        // return $http.delete(deleteUrl + "/");

        //var imageNameWithoutExtension = imageName.substring(0, imageName.indexOf('.'));
        return $http.delete(rootUrl + encodeURIComponent(productId) + "/images/" + encodeURIComponent(imageName) + "/");
    };

    factory.getAllAsRelated = function () {
        return $http.get('/api/productsasrelated/').then(function (result) {
            return result.data;
        });
    };

    return factory;
}]);