app.controller('pickOrdersController', ['$scope', '$location', 'pickOrderService', 'dialogService', function ($scope, $location, pickOrderService, dialogService) {
    $scope.pickOrders = [];
    $scope.errors = {};

    init();

    $scope.delete = function (pickOrder) {
        dialogService.confirm('Click ok to delete ' + pickOrder.name + ', otherwise click cancel.', 'Delete PickOrder')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.pickOrders) {
                    if ($scope.pickOrders[i].pickOrderId == pickOrder.pickOrderId) break;
                };

                pickOrderService.delete(pickOrder.pickOrderId).then(function () {
                    $scope.pickOrders.splice(i, 1);
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
        $location.path('/pickOrders/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        pickOrderService.getAll().then(function (data) {
            $scope.pickOrders = data;
        });
    };
}]);