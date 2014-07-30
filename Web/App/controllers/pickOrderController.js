app.controller('pickOrderController', ['$scope', '$window', '$route', 'pickOrderService', '$location', function ($scope, $window, $route, pickOrderService, $location) {
    $scope.pickOrder = {};
    
    if ($route.current.title == "PickOrderEdit") {
        init();
    }

    function init() {
        getPickOrder();
        //getModels();
    }

    function getPickOrder() {
        pickOrderService.getById($route.current.params.id).then(function (data) {
            $scope.pickOrder = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.product));
            pickOrderService.add($scope.pickOrder)
                .then(function (data) {
                    $location.path('/pickOrders');
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
            //alert(JSON.stringify($scope.pickOrder));
            pickOrderService.update($scope.pickOrder)
                .then(function (data) {
                    $location.path('/pickOrders');
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