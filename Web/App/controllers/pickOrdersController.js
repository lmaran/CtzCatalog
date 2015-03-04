app.controller('pickOrdersController', ['$scope', '$location', 'pickOrderService', 'dialogService', function ($scope, $location, pickOrderService, dialogService) {
    $scope.pickOrders = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.pickOrders) {
                if ($scope.pickOrders[i].id == item.id) break;
            };

            pickOrderService.delete(item.id).then(function () {
                $scope.pickOrders.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });
        });
    };

    $scope.create = function () {
        $location.path('/admin/pickOrders/create');
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