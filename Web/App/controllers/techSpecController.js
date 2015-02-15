app.controller('techSpecController', ['$scope', '$window', '$route', 'techSpecService', '$location', function ($scope, $window, $route, techSpecService, $location) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnOptions = false;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.techSpec = {};

    $scope.dotObject = {};
    $scope.dotObject.isRenameMode = {};


    $scope.selectedSpecItem = {};
    $scope.newSpecItem = {};
    $scope.selectedSection = {};


    $scope.optionBtnAreVisible = false;

    $scope.initAddSpecItemMode = function () {
        $scope.dotObject.isVisibleAddNewItem = true;
        $scope.selectedIndex = -1;
        $scope.newSpecItem.name = '';
        $scope.dotObject.isFocusOnAddItem = true;
        $scope.isItemInEditMode = false;
    }

    $scope.initAddSectionMode = function () {
        $scope.dotObject.isVisibleAddNewSection = true;
        //$scope.selectedIndex = -1;
        $scope.newSectionName = '';
        $scope.dotObject.isFocusOnAddSection = true;
        $scope.isSectionInEditMode = false;
    }

    $scope.initRenameSpecItemMode = function (currentSpecItem) {
        //$scope.dotObject.renamedItamName = currentSpecItem.name;
        $scope.selectedSpecItem.name = currentSpecItem.name;

        $scope.dotObject.specItemName = currentSpecItem.name;
        $scope.dotObject.isFocusOnRenameItem = true;

    }

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit techSpec';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new techSpec';
    }

    function init() {
        getTechspec();
    }

    function getTechspec() {
        techSpecService.getById($route.current.params.id).then(function (data) {
            $scope.techSpec = data;

            // set first section as expanded
            $scope.dotObject.expandedSectionName = $scope.techSpec.sections[0].name;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.addSpecItemOnEnter = function (currentSection, newSpecItem, e) {
        if (e.which == 13) { //enter key
            e.preventDefault();
            e.stopPropagation();
            $scope.addSpecItem(currentSection, newSpecItem);
        };
    }

    $scope.addSpecItem = function (currentSection, newSpecItem) {
        var items = currentSection.specItems;

        if (newSpecItem.name == '') {
            alert("Enter a value and then press the button!");
            $scope.dotObject.isFocusOnAddItem = true; // not necessary when Enter key is used
            return;
        }

        if (_.findIndex(items, { 'name': newSpecItem.name }) != -1) {
            alert('This value already exists: ' + newSpecItem.name);
            $scope.dotObject.isFocusOnAddItem = true; // not necessary when Enter key is used
            return;
        }

        items.push({ name: newSpecItem .name});

        $scope.dotObject.isVisibleAddNewItem = false;
        //$scope.newSpecItem = {}; //reset value
    }

    $scope.addSection = function (sectionName) {
        var items = $scope.techSpec.sections;

        if (sectionName == '') {
            alert("Enter a value and then press the button!");
            $scope.dotObject.isFocusOnAddSection = true; // not necessary when Enter key is used
            return;
        }

        if (_.findIndex(items, { 'name': sectionName }) != -1) {
            alert('This value already exists: ' + sectionName);
            $scope.dotObject.isFocusOnAddSection = true; // not necessary when Enter key is used
            return;
        }

        items.push({ name: sectionName, specItems: [{options:[], defaultOptions:[]}]});

        $scope.dotObject.isVisibleAddNewSection = false;
        //$scope.newSpecItem = {}; //reset value
    }

    $scope.renameSpecItem = function (newSpecItem) {
        newSpecItem.name = $scope.dotObject.specItemName;
        //close 'rename' section
        $scope.dotObject.renamedItamName = null;
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            techSpecService.create($scope.techSpec)
                .then(function (data) {
                    $location.path('/techspecs');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            //// remove description property if it has no value --> shorter JSON result
            //$scope.techSpec.options.forEach(function (item) {
            //    if (item.description == '') delete item.description;
            //});

            techSpecService.update($scope.techSpec)
                .then(function (data) {
                    $location.path('/techspecs');
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
            if (!$scope.techSpec.options) $scope.techSpec.options = [];
            $scope.techSpec.options.push({ name: $scope.newOptionValue });
        } else {
            alert("Enter a value and then press the button!");
            return;
        };
        
        $scope.newOptionValue = undefined;
        $scope.isFocusOnOptions = true;

        // remove $$haskKey property from objects
        // met.1 - use angular.copy: --> $scope.techSpec.options = angular.copy($scope.techSpec.options);
        // met.2 - alert(angular.toJson($scope.techSpec.options));
        // met.3 - use 'track by' in ng-repeat (I use that method because it is faster: http://www.codelord.net/2014/04/15/improving-ng-repeat-performance-with-track-by/)
        // and don't have to clean up the object later on

    };

    $scope.removeSection = function (currentSection) {
        _.remove($scope.techSpec.sections, function (currentItem) {
            return currentItem.name == currentSection.name;
        });
    };

    $scope.removeSpecItem = function (currentSection, specItem) {
        _.remove(currentSection.specItems, function (currentItem) {
            return currentItem.name == specItem.name;
        });
    };

    $scope.removeSpecItemOption = function (specItem, option) {
        _.remove(specItem.options, function (currentItem) {
            return currentItem.value == option.value;
        });
    };

    $scope.optionUp = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var options = $scope.techSpec.options;

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
        // options is just another reference to $scope.techSpec.options;
        // so we don't have to switch back (e.g. $scope.techSpec.options = options)
    }

    $scope.optionDown = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var options = $scope.techSpec.options;

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
        // options is just another reference to $scope.techSpec.options;
        // so we don't have to switch back (e.g. $scope.techSpec.options = options)
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

    $scope.sortableOptions1 = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //return true;
            // do not allow moving between specItems (parent) and options (child)
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) { },
        orderChanged: function (event) { },
        dragStart: function (event) {
            // collapse any expanded accordion items
            //$scope.dotObject.expandedItemName = null;
        }
        //containment: '#board'
    };

    $scope.sortableOptions = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //return true;
            // do not allow moving between specItems (parent) and options (child)
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) {},
        orderChanged: function (event) { },
        dragStart: function (event) {
            // collapse any expanded accordion items
            $scope.dotObject.expandedItemName = null;
        },
        containment: '#board'
    };


    $scope.toogleCollapse = function (specItemName) {


        $scope.dotObject.expandedItemName = $scope.dotObject.expandedItemName == specItemName ? null : specItemName;

        //$event.preventDefault();
        //$event.stopPropagation();
    };


    $scope.toogleSection = function (sectionName) {
        $scope.dotObject.expandedSectionName = $scope.dotObject.expandedSectionName == sectionName ? null : sectionName;
    };

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        //$log.log('Dropdown is now: ', open);

        // collapse any expanded accordion items
        $scope.dotObject.expandedItemName = null;
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}]);

//http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/editing-text-in-place-using-html5-content-editable.html
app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});

// http://stackoverflow.com/a/17586334/2726725
app.directive('splitArray', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {

            function fromUser(text) {
                return text.split("\n");
            }

            function toUser(array) {
                if (array == undefined)
                    return null;
                return array.join("\n");
            }

            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);
        }
    };
});