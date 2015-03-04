app.controller('attributesController', ['$scope', '$rootScope', '$route', '$location', 'attributeService', 'dialogService', function ($scope, $rootScope, $route, $location, attributeService, dialogService) {
    $scope.attributes = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.attributes) {
                if ($scope.attributes[i].id == item.id) break;
            };

            attributeService.delete(item.id).then(function () {
                $scope.attributes.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/admin/attributes/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        attributeService.getAll().then(function (data) {
            $scope.attributes = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'Attribute', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);