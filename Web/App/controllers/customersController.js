app.controller('customersController', ['$scope', '$location', 'customerService', 'dialogService', function ($scope, $location, customerService, dialogService) {
    $scope.customers = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Click ok to delete ' + item.name + ', otherwise click cancel.', 'Delete item')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.customers) {
                    if ($scope.customers[i].customerId == item.customerId) break;
                };

                customerService.delete(item.customerId).then(function () {
                    $scope.customers.splice(i, 1);
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
        $location.path('/customers/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        customerService.getAll().then(function (data) {
            $scope.customers = data;
        });
    };
}]);