app.controller('productController', ['$scope', '$window', '$route', 'productService', 'attributeSetService', 'optionSetService', '$location', '$q', function ($scope, $window, $route, productService, attributeSetService, optionSetService, $location, $q) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.product = {};
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


    // find object in array (objects with one level depth)
    function getObject(data, propertyName, propertyValue) {
        var item = undefined;
        for (i = 0; i < data.length; i++) {
            if (data[i][propertyName] === propertyValue) {
                item = data[i];
                break;
            };
        };
        return item;
    }

}]);