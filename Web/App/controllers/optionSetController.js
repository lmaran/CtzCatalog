app.controller('optionSetController', ['$scope', '$window', '$route', 'optionSetService', '$location', function ($scope, $window, $route, optionSetService, $location) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnOptions = false;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.optionSet = {};

    $scope.dotObject={}

    $scope.optionBtnAreVisible = false;

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit optionSet';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new optionSet';
    }

    function init() {
        getOptionSet();
    }

    function getOptionSet() {
        optionSetService.getById($route.current.params.id).then(function (data) {
            $scope.optionSet = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // remove description property if it has no value --> shorter JSON result
            if ($scope.optionSet.options) {
                $scope.optionSet.options.forEach(function (item) {
                    if (item.description == '') delete item.description;
                });
            }

            optionSetService.create($scope.optionSet)
                .then(function (data) {
                    $location.path('/admin/optionsets');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // remove description property if it has no value --> shorter JSON result
            $scope.optionSet.options.forEach(function (item) {
                if (item.description == '') delete item.description;
            });

            optionSetService.update($scope.optionSet)
                .then(function (data) {
                    $location.path('/admin/optionsets');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.cancel = function () {
        $window.history.back();
    }

    $scope.addOptionOnEnter = function (event) {
        if (event.which == 13) { //enter key
            event.preventDefault();
            event.stopPropagation();
            $scope.addOption();
        };
    }

    $scope.addOption = function () {
        if ($scope.newOptionValue) {
            if (!$scope.optionSet.options) $scope.optionSet.options = [];
            $scope.optionSet.options.push({ name: $scope.newOptionValue });
        } else {
            alert("Enter a value and then press the button!");
            return;
        };
        
        $scope.newOptionValue = undefined;
        $scope.isFocusOnOptions = true;

        // remove $$haskKey property from objects
        // met.1 - use angular.copy: --> $scope.optionSet.options = angular.copy($scope.optionSet.options);
        // met.2 - alert(angular.toJson($scope.optionSet.options));
        // met.3 - use 'track by' in ng-repeat (I use that method because it is faster: http://www.codelord.net/2014/04/15/improving-ng-repeat-performance-with-track-by/)
        // and don't have to clean up the object later on

    };

    $scope.removeOption = function (idx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.optionSet.options.splice(idx, 1);
    };

    $scope.optionUp = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var options = $scope.optionSet.options;

        var optionsLength = options.length;

        if (oldIdx > 0) {
            tmp = options[newIdx];
            options[newIdx] = options[oldIdx];
            options[oldIdx] = tmp;
        } else { // oldIndex is first position
            newIdx = optionsLength - 1; // circular list
            tmp = options[oldIdx];

            // move all remaining options one position up
            for (var i = 1; i <= optionsLength; i++) {
                options[i - 1] = options[i];
            };
            options[newIdx] = tmp;
        }
        // options is just another reference to $scope.optionSet.options;
        // so we don't have to switch back (e.g. $scope.optionSet.options = options)
    }

    $scope.optionDown = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var options = $scope.optionSet.options;

        var optionsLength = options.length;

        if (oldIdx < optionsLength - 1) {
            tmp = options[newIdx];
            options[newIdx] = options[oldIdx];
            options[oldIdx] = tmp;
        } else { // oldIndex is last position
            newIdx = 0; // circular list
            tmp = options[oldIdx];

            // move all remaining options one position down
            for (var i = (optionsLength - 1); i > 0; i--) {
                options[i] = options[i-1];
            };
            options[newIdx] = tmp;
        }
        // options is just another reference to $scope.optionSet.options;
        // so we don't have to switch back (e.g. $scope.optionSet.options = options)
    }

    // helper functions
    // get the index of selected object in array (objects with one level depth, selected by one of its property)
    function getIndex(data, propertyName, propertyValue) {
        var idx = -1;
        for (i = 0; i < data.length; i++) {
            if (data[i][propertyName] === propertyValue) {
                idx = i;
                break;
            };
        };
        return idx;

        // met. 2 (shorter but requires full scan of array; IE > 8)
        //return data.map(function (e) { return e[propertyName]; }).indexOf(propertyValue);
    }

}]);