app.factory('productService', ['$http', function ($http) {

    var factory = {};

    factory.add = function (product) {
        return $http.post('/api/products/', product);
    };

    factory.getProducts = function () {
        return $http.get('/api/products').then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (productId) {
        return $http.get('/api/products/' + encodeURIComponent(productId) + '/').then(function (result) {
            return result.data;
        });
    };

    factory.update = function (product) {
        return $http.put('/api/products/', product);
    };

    factory.delete = function (productId) {
        return $http.delete('/api/products/' + encodeURIComponent(productId) + '/');
    };





    return factory;
}]);