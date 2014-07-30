app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', function ($scope, $location, productService, dialogService) {
    $scope.products = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Click ok to delete ' + item.name + ', otherwise click cancel.', 'Delete item')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.products) {
                    if ($scope.products[i].productId == item.productId) break;
                };
                
                productService.delete(item.productId).then(function () {
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

    $scope.create = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getAll().then(function (data) {
            $scope.products = data;
        });
    };
}]);