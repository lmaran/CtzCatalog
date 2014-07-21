app.controller('productController', ['$scope', '$window', '$route', 'productService', '$location', function ($scope, $window, $route, productService, $location) {
    $scope.product = {};

    if ($route.current.title == "ProductEdit") {
        init();
    }

    function init() {
        getProduct();
        //getModels();
    }

    function getProduct() {
        productService.getById($route.current.params.id).then(function (data) {
            $scope.product = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

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

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.product));
            productService.update($scope.product)
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