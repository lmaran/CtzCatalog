app.controller('optionSetController', ['$scope', '$window', '$route', 'optionSetService', '$location', function ($scope, $window, $route, optionSetService, $location) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.optionSet = {};

    $scope.dotObject={}
    $scope.dotObject.options = [];
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

            // set $scope.dotObject.options as an object
            
            try {
                if (data.options == '' || data.options == null) {
                    $scope.dotObject.options = [];
                    alert($scope.dotObject.options);
                }
                else
                    $scope.dotObject.options = JSON.parse(data.options);
            }
            catch (err) {
                $scope.dotObject.options = [];
                alert(err + ' for Options property of entity ' + data.name);
            };
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            $scope.optionSet.options = JSON.stringify($scope.dotObject.options);

            optionSetService.add($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
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

            $scope.optionSet.options = JSON.stringify($scope.dotObject.options);

            optionSetService.update($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
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

    $scope.addOption = function () {

        if ($scope.newOptionValue) {
            $scope.dotObject.options.push({ name: $scope.newOptionValue });
        } else {
            alert("Enter a value and then press the button!");
            return;
        };
        
        $scope.newOptionValue = '';

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

        $scope.dotObject.options.splice(idx, 1);
    };

    $scope.optionUp = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var options = $scope.dotObject.options; 

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
        // options is just another reference to $scope.dotObject.options;
        // so we don't have to switch back (e.g. $scope.dotObject.options = options)
    }

    $scope.optionDown = function (oldIdx, option, e) {
        //alert(JSON.stringify(option));
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var options = $scope.dotObject.options;

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
        // options is just another reference to $scope.dotObject.options;
        // so we don't have to switch back (e.g. $scope.dotObject.options = options)
    }


}]);