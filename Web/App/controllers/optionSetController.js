app.controller('optionSetController', ['$scope', '$window', '$route', 'optionSetService', '$location', function ($scope, $window, $route, optionSetService, $location) {
    $scope.optionSet = {};
    $scope.optionBtnAreVisible = false;

    if ($route.current.title == "OptionSetEdit") {
        init();
    }

    function init() {
        getOptionSet();
        //getModels();
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
            optionSetService.add($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
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
            //alert(JSON.stringify($scope.optionSet));
            //return false;
            optionSetService.update($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
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

    $scope.addOption = function () {
        $scope.optionSet.options.push({ "name": $scope.newOptionValue, "description": "new description", "displayOrder": 10});
        $scope.newOptionValue = '';
        //alert($scope.newOptionValue);
    };

    $scope.removeOption = function (idx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.optionSet.options.splice(idx, 1);
        //alert(idx);
    };

    $scope.optionUp = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var optionsLength = $scope.optionSet.options.length;

        if (oldIdx > 0) {
            tmp = $scope.optionSet.options[newIdx];
            $scope.optionSet.options[newIdx] = $scope.optionSet.options[oldIdx];
            $scope.optionSet.options[oldIdx] = tmp;
        } else { // oldIndex is first position
            newIdx = optionsLength - 1; // circular list
            tmp = $scope.optionSet.options[oldIdx];

            // move all remaining options one position up
            for (var i = 1; i <= optionsLength; i++) {
                $scope.optionSet.options[i - 1] = $scope.optionSet.options[i];
            };
            $scope.optionSet.options[newIdx] = tmp;
        }
    }

    $scope.optionDown = function (oldIdx, option, e) {
        //alert(JSON.stringify(option));
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var optionsLength = $scope.optionSet.options.length;

        if (oldIdx < optionsLength - 1) {
            tmp = $scope.optionSet.options[newIdx];
            $scope.optionSet.options[newIdx] = $scope.optionSet.options[oldIdx];
            $scope.optionSet.options[oldIdx] = tmp;
        } else { // oldIndex is last position
            newIdx = 0; // circular list
            tmp = $scope.optionSet.options[oldIdx];

            // move all remaining options one position down
            for (var i = (optionsLength - 1); i > 0; i--) {
                $scope.optionSet.options[i] = $scope.optionSet.options[i-1];
            };
            $scope.optionSet.options[newIdx] = tmp;
        }
    }


}]);