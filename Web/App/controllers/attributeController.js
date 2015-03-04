app.controller('attributeController', ['$scope', '$window', '$route', 'attributeService', '$location', function ($scope, $window, $route, attributeService, $location) {

    //// we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    //// otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    //// and init the model there
    //// worth to mention that the model is working properly in the view side {{my-model}}
    //// the above mention behavior is due to the fact that a new scope is created within Select element
    //// https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    //// https://egghead.io/lessons/angularjs-the-dot
    //// http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    $scope.dotObject = {};

    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.attribute = {};

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit attribute';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new attribute';
    }

    function init() {
        getAttribute();
    }


    function getAttribute() {
        attributeService.getById($route.current.params.id).then(function (data) {
            $scope.attribute = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            attributeService.create($scope.attribute)
                .then(function (data) {
                    $location.path('/admin/attributes');
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
            // remove DefaultValue if the corresponding option has been removed from list
            if ($scope.attribute.type == "SingleOption" && $scope.attribute.options.indexOf($scope.attribute.defaultValue) == -1) {
                $scope.attribute.defaultValue = null;
            }

            if ($scope.attribute.type == "MultipleOptions") {
                $scope.attribute.defaultValues.forEach(function (defaultValue) {
                    if ($scope.attribute.options.indexOf(defaultValue) == -1) {
                        var index = $scope.attribute.defaultValues.indexOf(defaultValue);    // <-- Not supported in <IE9
                        if (index !== -1) {
                            $scope.attribute.defaultValues.splice(index, 1);
                        }
                    }
                });
            };

            attributeService.update($scope.attribute)
                .then(function (data) {
                    $location.path('/admin/attributes');
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

    $scope.changeType = function () {
        // clear previous default value when you switch the type
        $scope.attribute.defaultValue = '';
    }


}]);