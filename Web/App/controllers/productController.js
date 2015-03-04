app.controller('productController', ['$scope', '$window', '$route', 'productService', 'attributeSetService', 'optionSetService', '$location', '$q', '$upload', 'dialogService', '$modal', '$aside', 'helper', function ($scope, $window, $route, productService, attributeSetService, optionSetService, $location, $q, $upload, dialogService, $modal, $aside, helper) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.product = {um:'Buc'};
    $scope.attributeSets = [];

    $scope.dotObject = {};
    $scope.dotObject.attributes = {}; // default or selected attribute values
    $scope.dotObject.optionSets = {};

    var promiseToGetProduct, promiseToGetAttributeSets, promiseToGetAvailableRelatedProducts;
    
    $scope.availableRelatedProducts = [];

    // we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    // otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    // and init the model there
    // worth to mention that the model is working properly in the view side {{my-model}}
    // the above mention behavior is due to the fact that a new scope is created within Select element
    // https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    // https://egghead.io/lessons/angularjs-the-dot
    // http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    //$scope.dotObject = {};
    //$scope.dotObject.selectedAttributeSet = {};
    //$scope.dotObject.selectedAttributeSet.attributes = [];

    getAttributeSets();

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit product';
        init();
    } else { // create mode
        $scope.pageTitle = 'Add new product';
    }

    function init() {
        getProduct();

        $q.all([promiseToGetProduct, promiseToGetAttributeSets])
        .then(function (result) {

            // set selected AttributeSet
            $scope.dotObject.selectedAttributeSet = helper.getItemInArray($scope.attributeSets, 'id', $scope.product.attributeSetId);

            // setCurrentValues
            $scope.dotObject.attributes = $scope.product.attributes;

            setCurrentAttributeValues();

        }, function (reason) {
            alert('failure');
        });


    }

    function getProduct() {
        promiseToGetProduct = productService.getById($route.current.params.id).then(function (data) {
            $scope.product = data;           
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributeSets() {
        promiseToGetAttributeSets = attributeSetService.getAll().then(function (data) {
            $scope.attributeSets = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // add attributeSet info
            $scope.product.attributeSetId = $scope.dotObject.selectedAttributeSet.id;
            $scope.product.attributeSetName = $scope.dotObject.selectedAttributeSet.name;

            // remove 'unused' attributes (with no value) and add to product
            $scope.product.attributes = [];
            $scope.dotObject.selectedAttributeSet.attributes.forEach(function (node) {
                if (node.value || node.values) {

                    // return just some properties
                    var attr = {};
                    attr.id = node.id;
                    attr.name = node.name;

                    if (node.value) {
                        attr.value = node.value; // Text or SingleOption
                    } else {
                        attr.values = node.values; // MultiOptions
                    };

                    $scope.product.attributes.push(attr);
                }
            });

            // save product
            productService.create($scope.product)
                .then(function (data) {
                    $location.path('/admin/products');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // add attributeSet info
            $scope.product.attributeSetId = $scope.dotObject.selectedAttributeSet.id;
            $scope.product.attributeSetName = $scope.dotObject.selectedAttributeSet.name;

            // remove 'unused' attributes (with no value) and add to product
            $scope.product.attributes = [];
            $scope.dotObject.selectedAttributeSet.attributes.forEach(function (node) {
                if (node.value || node.values) {

                    // return just some properties
                    var attr = {};
                    attr.id = node.id;
                    attr.name = node.name;

                    if (node.value) {
                        attr.value = node.value; // Text or SingleOption
                    } else {
                        attr.values = node.values; // MultiOptions
                    };

                    $scope.product.attributes.push(attr);
                }
            });

            // save product
            productService.update($scope.product)
                .then(function (data) {
                    $location.path('/admin/products');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.cancel = function () {
        $window.history.back();
    }

    $scope.changeAttributeSet = function () {
        // reset previous options
        $scope.dotObject.optionSets = {};
        $scope.dotObject.attributes = {};

        setDefaultAttributeValues();
    }

    var removeImageFromProduct = function (itemName) {
        // remove image from the javascript model
        var images = $scope.product.images;
        var length = images.length;
        for (i = 0; i < length; i++) {
            if (images[i].name == itemName) {
                images.splice(i, 1);
                break;
            };
        };
    }

    $scope.deleteImage = function (item) {
        dialogService.confirm('Are you sure you want to delete this image?').then(function () {
            if ($scope.isEditMode) { // remove images (including al sizes) and update product model
                productService.deleteImageForProduct(item.name, $scope.product.id)
                .then(removeImageFromProduct(item.name))
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
            } else { // just remove images (including al sizes) - we don't have a product yet
                productService.DeleteImageFiles(item.name)
                .then(removeImageFromProduct(item.name))
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
            }
        });
    }

    $scope.onFileSelect = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            
            var uploadOptions = {
                url: 'api/products/images', //upload.php script, node.js route, or servlet url
                file: file // or list of files ($files) for html5 only
            };

            if ($scope.isEditMode) {
                uploadOptions.data = { productId: $scope.product.id};
            }

            $scope.upload = $upload
                .upload(uploadOptions)
                .progress(function (evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                })
                .success(function (data, status, headers, config) {
                    if (!$scope.product.images)
                        $scope.product.images = [];
                    $scope.product.images.push(data);
            });
        }
    };

    function setDefaultAttributeValues() {
        // set default values for each attribute (field) - every time you change the AttributeSet
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            if (attr.type == 'MultipleOptions') {
                attr.values = attr.defaultValues;
            } else { // 'Text' or  'SingleOption'
                attr.value = attr.defaultValue;
            }
        });
    }

    function setCurrentAttributeValues() {
        // set current values for each attribute (field) - right after load in Edit mode
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            var corespondingProductAttribute = helper.getItemInArray($scope.product.attributes, 'id', attr.id);
            if (corespondingProductAttribute) {
                if (attr.type == 'MultipleOptions')
                    attr.values = corespondingProductAttribute.values;
                else
                    attr.value = corespondingProductAttribute.value;
            } // else attr.value = null;
        });
    }

    $scope.itemUp = function (oldIdx) {

        var items = $scope.product.images;
        //var oldIdx = $scope.selectedIndex;
        var newIdx = oldIdx - 1, tmp;

        var itemsLength = items.length;

        if (oldIdx > 0) {
            tmp = items[newIdx];
            items[newIdx] = items[oldIdx];
            items[oldIdx] = tmp;
        } else { // oldIndex correspond to first position
            newIdx = itemsLength - 1; // circular list
            tmp = items[oldIdx];

            // move all remaining items one position up
            for (var i = 1; i <= itemsLength; i++) {
                items[i - 1] = items[i];
            };
            items[newIdx] = tmp;
        };

        // <items> is just another reference to $scope.items;
        // so we don't have to switch back (e.g. $scope.items = items)

        // update selectedIndex to the new index
        $scope.selectedIndex = newIdx;
    }

    $scope.itemDown = function (oldIdx) {

        var items = $scope.product.images;;
        //var oldIdx = $scope.selectedIndex;
        var newIdx = oldIdx + 1, tmp;

        var itemsLength = items.length;

        if (oldIdx < itemsLength - 1) {
            tmp = items[newIdx];
            items[newIdx] = items[oldIdx];
            items[oldIdx] = tmp;
        } else { // oldIndex correspond to last position
            newIdx = 0; // circular list
            tmp = items[oldIdx];

            // move all remaining items one position down
            for (var i = (itemsLength - 1) ; i > 0; i--) {
                items[i] = items[i - 1];
            };
            items[newIdx] = tmp;
        };

        // <items> is just another reference to $scope.items;
        // so we don't have to switch back (e.g. $scope.items = items)

        // update selectedIndex to the new index
        $scope.selectedIndex = newIdx;
    }


    // Show a modal to display images
    var myModal = $modal({ scope: $scope, template: '/App/templates/showImage.tpl.html', show: false });

    $scope.showModal = function (product) {
        $scope.selectedProduct = product;
        $scope.selectedImgIndex = 0;
        myModal.$promise.then(myModal.show);
    };

    $scope.displaySelectedImage = function ($index) {
        $scope.selectedImgIndex = $index;
    };



    // Show an aside to select relatd products
    var relatedProductsAside = $aside({ scope: $scope, template: '/App/templates/selectRelatedProducts.tpl.html', show: false, placement: 'right', animation: 'am-slide-right', title: 'Select Products' });

    function getAvailableRelatedProducts() {
        promiseToGetAvailableRelatedProducts = productService.getAllAsRelated().then(function (data) {
            $scope.availableRelatedProducts = getDifRelatedProducts(data);
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        })
    };

    function getDifRelatedProducts(allProducts) {
        // difRelatedProducts = AllProducts - AlreadySelectedProducts - ProductItself
        var result = [];
        var relatedProducts = $scope.product.relatedProducts;

        if (!relatedProducts || relatedProducts.length == 0) {
            result = allProducts;
        } else {
            allProducts.forEach(function (item) {
                if (helper.getIndexInArray($scope.product.relatedProducts, 'id', item.id) == -1) {
                    result.push(item);
                }
            });
        }

        // remove also the current element itself from this list
        if ($scope.isEditMode) {
            helper.deleteItemInArray(result, 'id', $scope.product.id);
        }

        return result;
    }

    $scope.showRelatedProductsAside = function () {
        getAvailableRelatedProducts();
        $q.when(promiseToGetAvailableRelatedProducts).then(function () {
            relatedProductsAside.$promise.then(relatedProductsAside.show);
        });
    };   

    $scope.selectRelatedProduct = function (item) {
        if (!$scope.product.relatedProducts)
            $scope.product.relatedProducts = [];
        $scope.product.relatedProducts.push(item);

        helper.deleteItemInArray($scope.availableRelatedProducts, 'id', item.id);
        //myOtherAside.hide(); // if you want to hide the aside after each selection
    };

    $scope.deleteRelatedProduct = function (item) {
        helper.deleteItemInArray($scope.product.relatedProducts, 'id', item.id);
        $scope.availableRelatedProducts.push(item);
    }

    // events on show/hide Aside
    //$scope.$on('aside.hide', function () {});
    //$scope.$on('aside.show', function () {});


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