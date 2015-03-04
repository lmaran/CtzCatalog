app.controller('techSpecController', ['$scope', '$window', '$route', 'techSpecService', '$location', function ($scope, $window, $route, techSpecService, $location) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.techSpec = {};

    $scope.dotObject = {};

    $scope.selectedSpecItem = {};
    $scope.newSpecItem = {};

    $scope.selectedSection = {};
    $scope.newSection = {};


    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit techSpec';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new techSpec';

        // init techspec
        $scope.techSpec.sections = [];
        $scope.techSpec.sections.push({ name: 'Specificatii generale' });

        // set first section as expanded
        $scope.dotObject.expandedSectionName = $scope.techSpec.sections[0].name;
    }

    function init() {
        getTechspec();
    }

    function getTechspec() {
        techSpecService.getById($route.current.params.id).then(function (data) {
            $scope.techSpec = data;

            // set first section as expanded (if exists)
            if ($scope.techSpec.sections[0])
                $scope.dotObject.expandedSectionName = $scope.techSpec.sections[0].name;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }


    // =============================== Section ops. ================================================

    // ---------------- Add Section ---------------------

    $scope.initAddModeForSection = function () {
        $scope.newSection = {};
        $scope.dotObject.isFocusOnAddSection = true;

        // open this window and close the others
        $scope.selectedSection.name = null;
        $scope.selectedSpecItem.name = null;
        $scope.dotObject.isVisibleAddNewSection = true;
        $scope.dotObject.isVisibleAddNewSpecItem = false;

        // collapse any expanded section
        $scope.dotObject.expandedSectionName = null;
    }

    $scope.addSection = function (newSection) {
        if (!isValidSection(newSection)) return false;

        $scope.techSpec.sections.push(newSection);

        $scope.dotObject.isVisibleAddNewSection = false;

        // expand this section
        $scope.dotObject.expandedSectionName = newSection.name;
    }

    $scope.addSectionOnEnter = function (newSection, e) {
        if (e.which == 13) { //enter key
            e.preventDefault();
            e.stopPropagation();
            $scope.addSection(newSection);
        };
    }

    // ---------------- Rename Section ------------------

    $scope.initRenameModeForSection = function (section) {
        $scope.newSection = angular.copy(section); // deep copy (or use _.cloneDeep(section))

        $scope.dotObject.isFocusOnRenameSection = true;

        // open this window and close the others
        $scope.selectedSection.name = section.name;
        $scope.selectedSpecItem.name = null;
        $scope.dotObject.isVisibleAddNewSection = false;
        $scope.dotObject.isVisibleAddNewSpecItem = false;
    };

    $scope.renameSection = function (section, newSection) {
        if (newSection.name == section.name) {
            //close 'rename' window
            $scope.selectedSection.name = null;
            return true;
        };

        if (!isValidSection(newSection)) {
            $scope.dotObject.isFocusOnRenameSection = true;
            return;
        };

        // update section name
        section.name = newSection.name;

        //close 'rename' section
        $scope.selectedSection.name = null;
    };

    $scope.renameSectionOnEnter = function (section, newSection, e) {
        if (e.which == 13) { //enter key
            e.preventDefault();
            e.stopPropagation();
            $scope.renameSection(section, newSection);
        };
    };

    // ---------------- Delete Section ------------------

    $scope.removeSection = function (section) {
        _.remove($scope.techSpec.sections, function (currentItem) {
            return currentItem.name == section.name;
        });
    };

    // ---------------- Validate Section ----------------

    function isValidSection(newSection) {
        var items = $scope.techSpec.sections;

        if (newSection.name == '') {
            alert("Enter a value and then press the button!");
            $scope.dotObject.isFocusOnAddSection = true; // not necessary when Enter key is used
            return false;
        };

        if (_.findIndex(items, { 'name': newSection.name }) != -1) {
            alert('This value already exists: ' + newSection.name);
            $scope.dotObject.isFocusOnAddSection = true; // not necessary when Enter key is used
            return false;
        };

        return true;
    }

    // ---------------- SortableOptions Section & Toogle ----

    $scope.sortableOptionsForSection = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //return true;
            // do not allow moving between specItems (parent) and options (child)
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) { },
        orderChanged: function (event) { },
        dragStart: function (event) {
            // collapse any expanded accordion items
            $scope.dotObject.expandedSectionName = null;
        }
        //containment: '#board'
    };

    $scope.toogleSection = function (sectionName) {
        $scope.dotObject.expandedSectionName = $scope.dotObject.expandedSectionName == sectionName ? null : sectionName;
    };



    // =============================== SpecItem ops. ===============================================

    // ---------------- Add SpecItem --------------------

    $scope.initAddModeForSpecItem = function () {
        $scope.newSpecItem = {};
        $scope.dotObject.isFocusOnAddItem = true;

        // open this window and close the others
        $scope.selectedSection.name = null;
        $scope.selectedSpecItem.name = null;
        $scope.dotObject.isVisibleAddNewSection = false;
        $scope.dotObject.isVisibleAddNewSpecItem = true;

        // collapse any expanded specItem
        $scope.dotObject.expandedSpecItemName = null;
    }

    $scope.addSpecItem = function (section, newSpecItem) {
        if (!isValidSpecItem(section, newSpecItem)) return false;

        section.specItems.push(newSpecItem);

        $scope.dotObject.isVisibleAddNewSpecItem = false;

        // expand this specItem
        $scope.dotObject.expandedSpecItemName = newSpecItem.name;
    }

    $scope.addSpecItemOnEnter = function (section, newSpecItem, e) {
        if (e.which == 13) { //enter key
            e.preventDefault();
            e.stopPropagation();
            $scope.addSpecItem(section, newSpecItem);
        };
    }

    // ---------------- Rename SpecItem -----------------

    $scope.initRenameModeForSpecItem = function (currentSpecItem) {
        $scope.newSpecItem = angular.copy(currentSpecItem); // deep copy (or use _.cloneDeep(currentSpecItem))

        $scope.dotObject.isFocusOnRenameSpecItem = true;

        // open this window and close the others
        $scope.selectedSection.name = null;
        $scope.selectedSpecItem.name = currentSpecItem.name;
        $scope.dotObject.isVisibleAddNewSection = false;
        $scope.dotObject.isVisibleAddNewSpecItem = false;

    };

    $scope.renameSpecItem = function (section, specItem, newSpecItem) {
        if (newSpecItem.name == specItem.name) {
            //close 'rename' window
            $scope.selectedSpecItem.name = null;
            return true;
        };

        if (!isValidSpecItem(section, newSpecItem)) {
            $scope.dotObject.isFocusOnRenameSection = true;
            return;
        };

        // update specItem name
        specItem.name = newSpecItem.name;

        //close 'rename' section
        $scope.selectedSpecItem.name = null;
    };

    $scope.renameSpecItemOnEnter = function (section, specItem, newSpecItem, e) {
        if (e.which == 13) { //enter key
            e.preventDefault();
            e.stopPropagation();
            $scope.renameSpecItem(section, specItem, newSpecItem);
        };
    };

    // ---------------- Delete SpecItem -----------------

    $scope.removeSpecItem = function (section, specItem) {
        _.remove(section.specItems, function (currentItem) {
            return currentItem.name == specItem.name;
        });
    };

    // ---------------- Validate SpecItem ---------------

    function isValidSpecItem(section, newSpecItem) {
        var items = section.specItems;

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

        return true;
    }

    // ---------------- SortableOptions & Toogle SpecItem ---

    $scope.sortableOptionsForSpecItem = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            //return true;
            // do not allow moving between specItems (parent) and options (child)
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) { },
        orderChanged: function (event) { },
        dragStart: function (event) {
            // collapse any expanded accordion items
            $scope.dotObject.expandedSpecItemName = null;
        }
        //containment: '#board'
    };

    $scope.toogleSpecItem = function (specItemName) {
        $scope.dotObject.expandedSpecItemName = $scope.dotObject.expandedSpecItemName == specItemName ? null : specItemName;
    };






    // ================ MainForm (TechSpec) ops. ===============================================

    // ---------------- Create TechSpec -----------------

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            techSpecService.create($scope.techSpec)
                .then(function (data) {
                    $location.path('/admin/techspecs');
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
                    $location.path('/admin/techspecs');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.cancel = function () {
        $window.history.back();
    }


}]);