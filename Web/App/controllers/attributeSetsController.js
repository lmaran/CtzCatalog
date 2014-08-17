﻿app.controller('attributeSetsController', ['$scope', '$rootScope', '$route', '$location', 'attributeSetService', 'dialogService', function ($scope, $rootScope, $route, $location, attributeSetService, dialogService) {
    $scope.attributeSets = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.attributeSets) {
                if ($scope.attributeSets[i].attributeSetId == item.attributeSetId) break;
            };

            attributeSetService.delete(item.attributeSetId).then(function () {
                $scope.attributeSets.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/attributesets/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        attributeSetService.getAll().then(function (data) {
            $scope.attributeSets = data;


            // optional --> convert typeDetails from string to object
            // only if you want to display them  in List view
            //data.forEach(function (item) {
            //    try {
            //        if (item.attributes == '')
            //            item.attributes = [];
            //        else
            //            item.attributes = JSON.parse(item.attributes)
            //    }
            //    catch (err) {
            //        item.attributes = [];
            //        alert(err + ' for Options property of entity ' + item.name);
            //    };
            //});
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'AttributeSet', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);