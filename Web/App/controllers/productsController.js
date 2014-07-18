app.controller('productsController', ['$scope', '$location', 'productService', function ($scope, $location,productService) {
    $scope.products = [];
    $scope.errors = {};

    init();

    //$scope.delete = function (email) {
    //    eventId = "itcongress2014";
    //    dialogService.confirm('Click ok to delete ' + email + ', otherwise click cancel.', 'Delete Email')
    //        .then(function () {

    //            // get the index for selected item
    //            var i = 0;
    //            for (i in $scope.whiteList) {
    //                if ($scope.whiteList[i] == email) break;
    //            };

    //            whiteListService.delete(eventId, email).then(function () {
    //                $scope.whiteList.splice(i, 1);
    //            })
    //            .catch(function (err) {
    //                $scope.errors = JSON.stringify(err.data, null, 4);
    //                alert($scope.errors);
    //            });

    //        }, function () {
    //            //alert('cancelled');
    //        });
    //};

    $scope.add = function () {
        eventId = "itcongress2014";
        whiteListService.add(eventId, $scope.newEmail).then(function () {
            $scope.whiteList.push($scope.newEmail);
        })
        .catch(function (err) {
            $scope.errors = JSON.stringify(err.data, null, 4);
            alert($scope.errors);
        });
    };

    $scope.createProduct = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getProducts().then(function (data) {
            $scope.products = data;
        });
    };
}]);