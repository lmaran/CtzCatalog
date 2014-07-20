app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', function ($scope, $location, productService, dialogService) {
    $scope.products = [];
    $scope.errors = {};

    init();

    $scope.delete = function (product) {
        dialogService.confirm('Click ok to delete ' + product.name + ', otherwise click cancel.', 'Delete Product')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.products) {
                    if ($scope.products[i].productId == product.productId) break;
                };
                
                productService.delete(product.productId).then(function () {
                    $scope.products.splice(i, 1);
                })
                .catch(function (err) {
                    $scope.errors = JSON.stringify(err.data, null, 4);
                    alert($scope.errors);
                });

            }, function () {
                //alert('cancelled');
            });
    };

    $scope.add = function () {
        eventId = "itcongress2014";
        whiteListService.add(eventId, $scope.newEmail).then(function () {
            $scope.whiteList.push($scope.newEmail);
        })
        .catch(function (err) {
            $scope.errors = JSON.stringify(err.data, null, 4);
            alert($scope.errors);
        });
    };

    $scope.createProduct = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getProducts().then(function (data) {
            $scope.products = data;
        });
    };
}]);