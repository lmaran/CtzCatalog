app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', '$modal', '$aside', 'helper', function ($scope, $location, productService, dialogService, $modal, $aside, helper) {
    $scope.products = [];
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
        $location.path('/admin/products/create');
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


    // Show a modal to display images
    var myModal = $modal({ scope: $scope, template: '/App/templates/showImage.tpl.html', show: false});

    $scope.showModal = function (product) {
        $scope.selectedProduct = product;
        $scope.selectedImgIndex = 0;
        myModal.$promise.then(myModal.show);
    };

    $scope.displaySelectedImage = function($index){
        $scope.selectedImgIndex = $index;
    };


    $scope.getPrimaryThumbImageUrl = function (images) {
        return helper.getPrimaryThumbImageUrl(images);
    }

    $scope.getThumbImageUrl = function (image) {
        return helper.getThumbImageUrl(image);
    }

    $scope.getLargeImageUrl = function (image) {
        return helper.getLargeImageUrl(image);
    }
}]);