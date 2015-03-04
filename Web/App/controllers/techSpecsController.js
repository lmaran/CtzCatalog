app.controller('techSpecsController', ['$scope', '$rootScope', '$route', '$location', 'techSpecService', 'dialogService', function ($scope, $rootScope, $route, $location, techSpecService, dialogService) {
    $scope.techSpecs = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.techSpecs) {
                if ($scope.techSpecs[i].id == item.id) break;
            };

            techSpecService.delete(item.id).then(function () {
                $scope.techSpecs.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/admin/techspecs/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        techSpecService.getAll().then(function (data) {
            $scope.techSpecs = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'techSpec', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);