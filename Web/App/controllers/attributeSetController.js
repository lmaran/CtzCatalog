app.controller('attributeSetController', ['$scope', '$window', '$route', 'attributeService', 'attributeSetService', '$location', '$q', function ($scope, $window, $route, attributeService, attributeSetService, $location, $q) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.attributeSet = {};
    $scope.attributes = [];
    var promiseToGetAttributeSet, promiseToGetAttributes;

    // we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    // otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    // and init the model there
    // worth to mention that the model is working properly in the view side {{my-model}}
    // the above mention behavior is due to the fact that a new scope is created within Select element
    // https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    // https://egghead.io/lessons/angularjs-the-dot
    // http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    $scope.dotObject = {};

    $scope.attributeBtnAreVisible = false;

    getAttributes();

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit attributeSet';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new attributeSet';
        $scope.attributeSet.attributes = [];
    }


    function init() {
        getAttributeSet();

        $q.all([promiseToGetAttributeSet, promiseToGetAttributes])
        .then(function (result) {

            // remove already used attributes from the list of available attributes
            $scope.attributeSet.attributes.forEach(function(attr) {
                var idx = getIndexInArray($scope.attributes, attr.id, "id");
                if (idx != -1) {
                    $scope.attributes.splice(idx, 1);
                };
            });
        }, function (reason) {
            alert('failure');
        });
    }

    function getAttributeSet() {
        promiseToGetAttributeSet = attributeSetService.getById($route.current.params.id).then(function (data) {
            $scope.attributeSet = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributes() {
        promiseToGetAttributes = attributeService.getAll().then(function (data) {
            $scope.attributes = data;

            //// optional: loop through the options and set title (for tool-tip on options)
            //// http://sandipchitale.blogspot.ro/2013/03/tip-setting-title-attributes-of-option.html
            //setTimeout(function () {
            //    var options = document.querySelectorAll("#optionSetAttributes option");
            //    if (options) {
            //        for (var i = 1; i < options.length; i++) {
            //            options[i].title = $scope.attributes[i-1].description;
            //        }
            //    }
            //}, 0);

        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.attributeSet, null, 4));
            attributeSetService.create($scope.attributeSet)
                .then(function (data) {
                    $location.path('/admin/attributesets');
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
            attributeSetService.update($scope.attributeSet)
                .then(function (data) {
                    $location.path('/admin/attributesets');
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

    $scope.addAttribute = function () {
        //alert(JSON.stringify($scope.dotObject.selectedAttribute, null, 4));
        if ($scope.dotObject.selectedAttribute) {
            $scope.attributeSet.attributes.push($scope.dotObject.selectedAttribute);
        } else {
            alert("Select from the list and then press the button!");
            return;
        };

        // remove selected attribute from available list
        var idx = getIndexInArray($scope.attributes, $scope.dotObject.selectedAttribute.attributeId, "attributeId");
        if (idx != -1) {
            // alert(attr.name);
            $scope.attributes.splice(idx, 1);
        };

        $scope.dotObject.selectedAttribute = undefined;
    };

    $scope.removeAttribute = function (idx, attribute, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.attributeSet.attributes.splice(idx, 1);

        // make it available for further selections
        $scope.attributes.push(attribute);
    };

    $scope.attributeUp = function (oldIdx, attribute, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var attributesLength = $scope.attributeSet.attributes.length;

        if (oldIdx > 0) {
            tmp = $scope.attributeSet.attributes[newIdx];
            $scope.attributeSet.attributes[newIdx] = $scope.attributeSet.attributes[oldIdx];
            $scope.attributeSet.attributes[oldIdx] = tmp;
        } else { // oldIndex is first position
            newIdx = attributesLength - 1; // circular list
            tmp = $scope.attributeSet.attributes[oldIdx];

            // move all remaining attributes one position up
            for (var i = 1; i <= attributesLength; i++) {
                $scope.attributeSet.attributes[i - 1] = $scope.attributeSet.attributes[i];
            };
            $scope.attributeSet.attributes[newIdx] = tmp;
        }
    }

    $scope.attributeDown = function (oldIdx, attribute, e) {
        //alert(JSON.stringify(attribute));
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var attributesLength = $scope.attributeSet.attributes.length;

        if (oldIdx < attributesLength - 1) {
            tmp = $scope.attributeSet.attributes[newIdx];
            $scope.attributeSet.attributes[newIdx] = $scope.attributeSet.attributes[oldIdx];
            $scope.attributeSet.attributes[oldIdx] = tmp;
        } else { // oldIndex is last position
            newIdx = 0; // circular list
            tmp = $scope.attributeSet.attributes[oldIdx];

            // move all remaining attributes one position down
            for (var i = (attributesLength - 1); i > 0; i--) {
                $scope.attributeSet.attributes[i] = $scope.attributeSet.attributes[i-1];
            };
            $scope.attributeSet.attributes[newIdx] = tmp;
        }
    }

    // helper functions
    function getIndexInArray(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }

}]);