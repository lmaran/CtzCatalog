app.controller('optionSetsController', ['$scope', '$rootScope', '$route', '$location', 'optionSetService', 'dialogService', function ($scope, $rootScope, $route, $location, optionSetService, dialogService) {
    $scope.optionSets = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Click ok to delete ' + item.name + ', otherwise click cancel.', 'Delete item')
            .then(function () {

                // get the index for selected item
                var i = 0;
                for (i in $scope.optionSets) {
                    if ($scope.optionSets[i].optionSetId == item.optionSetId) break;
                };

                optionSetService.delete(item.optionSetId).then(function () {
                    $scope.optionSets.splice(i, 1);
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
        $location.path('/optionsets/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        optionSetService.getAll().then(function (data) {
            $scope.optionSets = data;
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'OptionSet', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);