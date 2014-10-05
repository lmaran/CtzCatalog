app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', '$modal', '$aside', function ($scope, $location, productService, dialogService, $modal, $aside) {
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


    // todo - extract common helpers into a service
    $scope.getPrimaryThumbImageUrl = function (images) {
        if (!images || images.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var image = images[0]; // primary image
        if (!image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    }

    $scope.getThumbImageUrl = function (image) {
        if (!image || !image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    }

    $scope.getLargeImageUrl = function (image) {
        if (!image || !image.sizes || image.sizes.length == 0)
            return 'http://appstudio.blob.core.windows.net/share/no-image-available-q.png';

        var fileNameWithoutExtension = image.name.substring(0, image.name.indexOf('.'));
        var fileExtensionWithDot = image.name.substring(image.name.indexOf('.'));
        var sizeLabel = image.sizes.length > 1 ? image.sizes[1] : image.sizes[0];
        return image.rootUrl + '/' + fileNameWithoutExtension + '-' + sizeLabel + fileExtensionWithDot;
    }
}]);