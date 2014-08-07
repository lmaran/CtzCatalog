app.controller('attributeSetController', ['$scope', '$window', '$route', 'attributeSetService', '$location', function ($scope, $window, $route, attributeSetService, $location) {
    $scope.attributeSet = {};
    $scope.attributeBtnAreVisible = false;

    if ($route.current.title == "AttributeSetEdit") {
        init();
    }

    function init() {
        getAttributeSet();
        //getModels();
    }

    function getAttributeSet() {
        attributeSetService.getById($route.current.params.id).then(function (data) {
            $scope.attributeSet = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            attributeSetService.add($scope.attributeSet)
                .then(function (data) {
                    $location.path('/attributesets');
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
            //alert(JSON.stringify($scope.attributeSet));
            //return false;
            attributeSetService.update($scope.attributeSet)
                .then(function (data) {
                    $location.path('/attributesets');
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

    $scope.addAttribute = function () {
        $scope.attributeSet.attributes.push({ "name": $scope.newAttributeValue, "description": "new description", "displayOrder": 10});
        $scope.newAttributeValue = '';
        //alert($scope.newAttributeValue);
    };

    $scope.removeAttribute = function (idx, attribute, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.attributeSet.attributes.splice(idx, 1);
        //alert(idx);
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


}]);