app.controller('umsController', ['$scope', '$location', 'umService', 'dialogService', '$modal', function ($scope, $location, umService, dialogService, $modal) {
    $scope.ums = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.ums) {
                if ($scope.ums[i].id == item.id) break;
            };

            umService.delete(item.id).then(function () {
                $scope.ums.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/admin/ums/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        umService.getAll().then(function (data) {
            $scope.ums = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };

}]);