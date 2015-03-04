app.controller('pickOrderController', ['$scope', '$window', '$route', 'pickOrderService', 'customerService', '$location', '$q', function ($scope, $window, $route, pickOrderService, customerService, $location, $q) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.pickOrder = {};
    $scope.customers = [];

    var promiseToGetPickOrder, promiseToGetCustomers;
    
    getCustomers();

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit product';
        init();
    } else { // create mode
        $scope.pageTitle = 'Add new product';
    }

    function init() {
        getPickOrder();
        
        // need it only for initial customer selection
        // http://odetocode.com/blogs/scott/archive/2013/06/19/using-ngoptions-in-angularjs.aspx
        // it seems that with the last version of Angular, you can use 'track by' to substitute this manual loop:
        // https://github.com/angular/angular.js/issues/6564 (comment from jeffbcross - 07.10.2014)
        $q.all([promiseToGetPickOrder, promiseToGetCustomers])
            .then(function (result) {
                for (var i = 0; i < $scope.customers.length; i++) {
                    if ($scope.customers[i].id == $scope.pickOrder.customer.id) {
                        $scope.pickOrder.customer = $scope.customers[i];
                        break;
                    }
                }
            }, function (reason) {
                alert('failure');
            });
    }

    function getPickOrder() {
        promiseToGetPickOrder = pickOrderService.getById($route.current.params.id).then(function (data) {
            $scope.pickOrder = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getCustomers() {
        promiseToGetCustomers = customerService.getAll().then(function (data) {
            $scope.customers = data;
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            //var pickOrder = {};
            //pickOrder.name = $scope.pickOrder.name;
            //pickOrder.createdOn = $scope.pickOrder.createdOn;
            //pickOrder.customerId = $scope.pickOrder.customer.customerId;
            //pickOrder.customerName = $scope.pickOrder.customer.name;

            //alert(JSON.stringify(pickOrder));
            //return false;

            pickOrderService.create($scope.pickOrder)
                .then(function (data) {
                    $location.path('/admin/pickOrders');
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

            pickOrderService.update($scope.pickOrder)
                .then(function (data) {
                    $location.path('/admin/pickOrders');
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
        $window.history.back();
    }


}]);