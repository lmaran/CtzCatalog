app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', '$modal', function ($scope, $location, productService, dialogService, $modal) {
    $scope.products = [];
    //$scope.selectedProduct
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.products) {
                if ($scope.products[i].id == item.id) break;
            };

            productService.delete(item.id).then(function () {
                $scope.products.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getAll().then(function (data) {
            $scope.products = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // Show a basic modal from a controller
    //var myModal = $modal({ title: 'My Title', content: 'My Content', show: true });

    // Pre-fetch an external template populated with a custom scope
    var myOtherModal = $modal({ scope: $scope, template: '/App/templates/showImage.tpl.html', show: false, title: "MyTitle" });
    // Show when some event occurs (use $promise property to ensure the template has been loaded)
    $scope.showModal = function (product) {
        //alert(11);
        //myOtherModal.title = "MyTitle";
        $scope.selectedProduct = product;
        $scope.selectedImgIndex = 0;
        myOtherModal.$promise.then(myOtherModal.show);
    };

    $scope.displaySelectedImage = function($index){
        $scope.selectedImgIndex = $index;
    };

}]);