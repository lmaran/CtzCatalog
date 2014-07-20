app.factory('productService', ['$http', function ($http) {

    var factory = {};

    factory.getProducts = function () {
        return $http.get('/api/products').then(function (result) {
            return result.data;
        });
    };

    factory.delete = function (productId) {
        return $http.delete('/api/products/' + encodeURIComponent(productId) + '/');
    };

    factory.add = function (product) {
        return $http.post('/api/products/', product);
    };

    //factory.get = function (eventId, email) {
    //    return $http.get('/api/' + eventId + '/whiteList/' + encodeURIComponent(email) + '/').then(function (result) {
    //        return result.data;
    //    });
    //};

    return factory;
}]);