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
            //// remove already used attributes from the list of available attributes
            //$scope.attributeSet.attributes.forEach(function (attr) {
            //    var idx = getIndexInArray($scope.attributes, attr.attributeId, "attributeId");
            //    if (idx != -1) {
            //        $scope.attributes.splice(idx, 1);
            //    };
            //});

            // set selected AttributeSet
            $scope.dotObject.selectedAttributeSet = getObject($scope.attributeSets, 'id', $scope.product.attributeSetId);

            //$scope.selectedAttributeSet = $scope.attributeSets[0].attributeSetId;

            //getOptionSets();

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
            //$scope.product.attributes = JSON.parse(data.attributes);

            //$scope.selectedAttributeSet = getObject($scope.attributeSets, 'attributeSetId', data.attributeSetId);
            
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributeSets() {
        promiseToGetAttributeSets = attributeSetService.getAll().then(function (data) {
            //data.forEach(function (attributeSet) {
            //    attributeSet.attributes.forEach(function (attribute) {
            //        if (attribute.typeDetails)
            //            attribute.typeDetails = JSON.parse(attribute.typeDetails);
            //    });
            //});

            //alert(JSON.stringify(data, null, 4));

            $scope.attributeSets = data;
            $scope.dotObject.attributeSets = data;
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
                        attr.value = node.value; // Text, SingleOption
                    } else {
                        attr.values = node.values; // MultiOptions
                    };

                    $scope.product.attributes.push(attr);
                };
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
                        attr.value = node.value; // Text, SingleOption
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
        //$location.path('/widgets')
        $window.history.back();
    }

    $scope.changeAttributeSet = function () {
        // reset previous options
        $scope.dotObject.optionSets = {};
        $scope.dotObject.attributes = {};

        // set selected AttributeSet
        //$scope.dotObject.selectedAttributeSet = getObject($scope.attributeSets, 'id', $scope.product.attributeSetId);

        //getOptionSets();
        setDefaultAttributeValues();
    }

    //function getOptionSets() {
    //    // get DDL values for each attribute (for 'optionSet' type only)
    //    $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
    //         if (attr.type == 'OptionSet' || attr.type == 'OptionSet-MultiVal') {
    //            optionSetService.getById(attr.typeDetails.optionSetId).then(function (data) {
    //                $scope.dotObject.optionSets[attr.typeDetails.optionSetId] = JSON.parse(data.options);
    //            })
    //            .catch(function (err) {
    //                alert(JSON.stringify(err, null, 4));
    //            });
    //        }
    //    });
    //}


    function setDefaultAttributeValues() {
        // get DDL values for each attribute (for 'optionSet' type only)
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            if (attr.type == 'SingleOption' || attr.type == 'MultipleOptions') {
                // set default value in DDL
                // TODO - refactor this
                //if (attr.typeDetails.defaultValue) {
                //    //$scope.dotObject.attributes[attr.typeDetails.optionSetId] = attr.typeDetails.defaultValue;
                //    $scope.dotObject.attributes[attr.attributeId] = attr.typeDetails.defaultValue;
                //}

                //if (attr.typeDetails.defaultValues) {
                //    //$scope.dotObject.attributes[attr.typeDetails.optionSetId] = attr.typeDetails.defaultValue;
                //    $scope.dotObject.attributes[attr.attributeId] = attr.typeDetails.defaultValues;
                //}

                attr.value = attr.defaultValue;
            }
        });
    }

    function setCurrentAttributeValues() {
        // get DDL values for each attribute (for 'optionSet' type only)
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            if (attr.type == 'SingleOption' || attr.type == 'MultipleOptions') {
                // set default value in DDL

                var corespondingProductAttribute = getObject($scope.product.attributes, 'id', attr.id);
                if (corespondingProductAttribute) {
                    if (attr.type == 'MultipleOptions')
                        attr.values = corespondingProductAttribute.values;
                    else
                        attr.value = corespondingProductAttribute.value;
                } else {
                    //attr.value = null;
                }

                //alert(JSON.stringify(attr, null, 4));
                
            }
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