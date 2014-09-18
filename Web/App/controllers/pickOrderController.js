app.controller('pickOrderController', ['$scope', '$window', '$route', 'pickOrderService', 'customerService', '$location', function ($scope, $window, $route, pickOrderService, customerService, $location) {
    $scope.pickOrder = {};
    $scope.customers = [];
    
    getCustomers();
    if ($route.current.title == "PickOrderEdit") {
        init();
    }

    function init() {
        getPickOrder();
        
    }

    function getPickOrder() {
        pickOrderService.getById($route.current.params.id).then(function (data) {
            //$scope.pickOrder = data;
            $scope.pickOrder.pickOrderId = data.pickOrderId;
            $scope.pickOrder.name = data.name;
            $scope.pickOrder.createdOn = data.createdOn;
            $scope.pickOrder.customer = {customerId:data.customerId, name:data.customerName};
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getCustomers() {
        customerService.getAll().then(function (data) {
            $scope.customers = data;
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            var pickOrder = {};
            pickOrder.name = $scope.pickOrder.name;
            pickOrder.createdOn = $scope.pickOrder.createdOn;
            pickOrder.customerId = $scope.pickOrder.customer.customerId;
            pickOrder.customerName = $scope.pickOrder.customer.name;

            //alert(JSON.stringify(pickOrder));
            //return false;

            pickOrderService.create(pickOrder)
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

            var pickOrder = {};
            pickOrder.pickOrderId = $scope.pickOrder.pickOrderId;
            pickOrder.name = $scope.pickOrder.name;
            pickOrder.createdOn = $scope.pickOrder.createdOn;
            pickOrder.customerId = $scope.pickOrder.customer.customerId;
            pickOrder.customerName = $scope.pickOrder.customer.name;

            //alert(JSON.stringify(pickOrder));
            pickOrderService.update(pickOrder)
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