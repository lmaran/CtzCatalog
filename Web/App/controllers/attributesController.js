app.controller('attributesController', ['$scope', '$rootScope', '$route', '$location', 'attributeService', 'dialogService', function ($scope, $rootScope, $route, $location, attributeService, dialogService) {
    $scope.attributes = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Click ok to delete ' + item.name + ', otherwise click cancel.', 'Delete item')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.attributes) {
                    if ($scope.attributes[i].attributeId == item.attributeId) break;
                };

                attributeService.delete(item.attributeId).then(function () {
                    $scope.attributes.splice(i, 1);
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
        $location.path('/attributes/create');
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