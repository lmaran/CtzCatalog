app.controller('productController', ['$scope', 'productService', '$location', function ($scope, productService, $location) {
    $scope.product = {};

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.product));
            productService.add($scope.product)
                .then(function (data) {
                    $location.path('/products');
                    //Logger.info("Widget created successfully");
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.cancel = function () {
        //$location.path('/widgets')
        $window.history.back();
    }


}]);