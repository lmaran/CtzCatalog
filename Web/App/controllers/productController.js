app.controller('productController', ['$scope', '$window', '$route', 'productService', 'attributeSetService', 'optionSetService', '$location', function ($scope, $window, $route, productService, attributeSetService, optionSetService, $location) {
    $scope.product = {};
    $scope.attributeSets = [];

    $scope.dotObject = {};
    $scope.dotObject.attributes = {};

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
    if ($route.current.title == "ProductEdit") {
        init();
    }

    function init() {
        getProduct();
    }

    function getProduct() {
        productService.getById($route.current.params.id).then(function (data) {
            $scope.product = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributeSets() {
        attributeSetService.getAll().then(function (data) {
            $scope.attributeSets = data;
            //alert(JSON.stringify($scope.attributeSets, null, 4));
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }



    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // add attributeSet info
            $scope.product.attributeSetId = $scope.dotObject.selectedAttributeSet.attributeSetId;
            $scope.product.attributeSetName = $scope.dotObject.selectedAttributeSet.name;

            // add attributes info

            // ver 1: (returns: [{name:color, value:red}, {name:size, value:6m}])
            //$scope.product.attributes = [];
            //for (var property in $scope.dotObject.attributes) {
            //    var val = $scope.dotObject.attributes[property];
            //    if(val && val != '')
            //    $scope.product.attributes.push({
            //        name: property,
            //        value: val
            //    });
            //}

            // ver 2: (returns: {color:red, size:6m})
            for (var property in $scope.dotObject.attributes) {
                var val = $scope.dotObject.attributes[property];
                if (val==null || val == '')
                    delete $scope.dotObject.attributes[property];
            }

            $scope.product.attributes = JSON.stringify($scope.dotObject.attributes);

            //alert(JSON.stringify($scope.dotObject.attributes, null, 4));
            //return false;

            // save product
            productService.add($scope.product)
                .then(function (data) {
                    $location.path('/products');
                    //Logger.info("Widget created successfully");
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
            //alert(JSON.stringify($scope.product));
            productService.update($scope.product)
                .then(function (data) {
                    $location.path('/products');
                    //Logger.info("Widget created successfully");
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
        getAttributeSet();

        // clean all attributes
        $scope.dotObject.attributes = {};
    }

    getAttributeSet = function () {
        //alert(JSON.stringify($scope.dotObject.selectedAttributeSet, null, 4));
        attributeSetService.getById($scope.dotObject.selectedAttributeSet.attributeSetId).then(function (data) {

            for (var i = 0; i < data.attributes.length; i++) {
                data.attributes[i].typeDetails = JSON.parse(data.attributes[i].typeDetails);
            };


            $scope.dotObject.selectedAttributeSet.attributes = data.attributes;


            // get DDL values for each attribute (for 'optionSet' type only)
            $scope.dotObject.attributeSets = {};

            $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
                //alert(JSON.stringify(attr, null, 4));
                if (attr.type == 'OptionSet') {
                    optionSetService.getById(attr.typeDetails.optionSetId).then(function (data) {
                        $scope.dotObject.attributeSets[attr.typeDetails.optionSetId] = data.options;
                    })
                    .catch(function (err) {
                        alert(JSON.stringify(err, null, 4));
                    });

                    // set default value in DDL
                    if (attr.typeDetails.defaultValue) {
                        //$scope.dotObject.attributes[attr.typeDetails.optionSetId] = attr.typeDetails.defaultValue;
                        $scope.dotObject.attributes[attr.name] = attr.typeDetails.defaultValue;
                    }

                }

            });

        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

}]);