app.controller('optionSetsController', ['$scope', '$rootScope', '$route', '$location', 'optionSetService', 'dialogService', function ($scope, $rootScope, $route, $location, optionSetService, dialogService) {
    $scope.optionSets = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

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

        });
    };

    $scope.create = function () {
        $location.path('/admin/optionsets/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        optionSetService.getAll().then(function (data) {
            $scope.optionSets = data;

            //// optional --> convert options from string to object
            //// only if you want to display them  in List view
            //data.forEach(function (item) {
            //    try {
            //        if (item.options == '')
            //            item.options = [];
            //        else
            //            item.options = JSON.parse(item.options)
            //    }
            //    catch (err) {
            //        item.options = [];
            //        alert(err + ' for Options property of entity ' + item.name);
            //    };
            //});
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'OptionSet', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in dublu exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);