app.controller('customerController', ['$scope', '$window', '$route', 'customerService', '$location', function ($scope, $window, $route, customerService, $location) {
    $scope.customer = {};

    if ($route.current.title == "CustomerEdit") {
        init();
    }

    function init() {
        getCustomer();
        //getModels();
    }

    function getCustomer() {
        customerService.getById($route.current.params.id).then(function (data) {
            $scope.customer = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.customer));
            customerService.add($scope.customer)
                .then(function (data) {
                    $location.path('/customers');
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
            //alert(JSON.stringify($scope.customer));
            customerService.update($scope.customer)
                .then(function (data) {
                    $location.path('/customers');
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