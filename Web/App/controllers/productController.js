app.controller('productController', ['$scope', '$window', '$route', 'productService', 'attributeSetService', 'optionSetService', '$location', '$q', '$upload', 'dialogService', function ($scope, $window, $route, productService, attributeSetService, optionSetService, $location, $q, $upload, dialogService) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.product = {um:'Buc'};
    $scope.attributeSets = [];

    $scope.dotObject = {};
    $scope.dotObject.attributes = {}; // default or selected attribute values
    $scope.dotObject.optionSets = {};

    var promiseToGetProduct, promiseToGetAttributeSets;
    

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
    }
    else { // create mode
        $scope.pageTitle = 'Add new product';
    }

    function init() {
        getProduct();

        $q.all([promiseToGetProduct, promiseToGetAttributeSets])
        .then(function (result) {

            // set selected AttributeSet
            $scope.dotObject.selectedAttributeSet = getObject($scope.attributeSets, 'id', $scope.product.attributeSetId);

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
                    $location.path('/products');
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
                    $location.path('/products');
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
                //method: 'POST' or 'PUT',
                //headers: {'header-key': 'header-value'},
                //withCredentials: true,
                //data: { productId: $scope.product.id},
                //data: { productId: $scope.isEditMode ? $scope.product.id : undefined},
                file: file, // or list of files ($files) for html5 only
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name. 
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
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
                    // file is uploaded successfully
                    if (!$scope.product.images)
                        $scope.product.images = [];
                    $scope.product.images.push(data);
                    //console.log(data);
            });
            //.error(...)
            //.then(success, error, progress); 
            // access or attach event listeners to the underlying XMLHttpRequest.
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})
        }
        /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request with large data*/
        // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
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
            var corespondingProductAttribute = getObject($scope.product.attributes, 'id', attr.id);
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


    // find object in array (objects with one level depth)
    function getObject(data, propertyName, propertyValue) {
        var item = undefined;
        var length = data.length;
        for (i = 0; i < length; i++) {
            if (data[i][propertyName] === propertyValue) {
                item = data[i];
                break;
            };
        };
        return item;
    }

}]);