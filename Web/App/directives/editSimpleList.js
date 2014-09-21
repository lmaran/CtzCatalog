// Usage: <editable-simple-list items="attribute.options" />
app.directive('editSimpleList', [function () {
    return {
        restrict: 'E',
        scope: { items: '=' },
        templateUrl: '/App/templates/editSimpleList.tpl.html',


        // without this construction Angular throw an "Unknown provider" message when we try to use the $scope variable inside the function (only with minified js)
        controller: ['$scope', function ($scope) {

            // initialize variables here
            $scope.dotObject = {};
            $scope.dotObject.modifiedItem = '';
            $scope.dotObject.isFocusOnEditItem = false;

            $scope.items = $scope.items || [];

            $scope.isVisibleAddNewItem = false;

            $scope.isFocusOnAddItem = false;

            $scope.selectedIndex = -1; //no item selected

            $scope.isItemInEditMode = false;


            $scope.addItem = function () {
                var items = $scope.items;
                var newItem = $scope.newItemValue;

                if (items.indexOf(newItem) != -1) {
                    alert('This value already exists: ' + newItem);
                    $scope.isFocusOnAddItem = true; // not necessary when Enter key is used
                    return;
                }

                if (newItem) {
                    items.push(newItem);
                } else {
                    alert("Enter a value and then press the button!");
                    return;
                };

                $scope.newItemValue = undefined;
                $scope.isFocusOnAddItem = true;

                // remove $$haskKey property from objects
                // met.1 - use angular.copy: --> $scope.itemSet.items = angular.copy($scope.itemSet.items);
                // met.2 - alert(angular.toJson($scope.itemSet.items));
                // met.3 - use 'track by' in ng-repeat (I use that method because it is faster: http://www.codelord.net/2014/04/15/improving-ng-repeat-performance-with-track-by/)
                // and don't have to clean up the object later on
            };

            // toggle selection for a given item by name 
            // http://stackoverflow.com/a/14520103/2726725
            $scope.toggleSelection = function toggleSelection(currentIndex) {
                $scope.isVisibleAddNewItem = false;

                if ($scope.selectedIndex == currentIndex)
                    $scope.selectedIndex = -1;
                else
                    $scope.selectedIndex = currentIndex;
            };

            $scope.addItemOnEnter = function (e) {
                if (e.which == 13) { //enter key
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.addItem();
                };
            }

            $scope.updateItemOnEnter = function (idx, item, e) {
                if (e.which == 13) { //enter key
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.updateItem(idx, item, e);
                };
            }


            $scope.editItem = function (idx, item, e) {
                $scope.isItemInEditMode = true;
                $scope.dotObject.modifiedItem = item;
                $scope.dotObject.isFocusOnEditItem = true;
            };

            $scope.cancelItem = function (idx, item, e) {
                $scope.isItemInEditMode = false;
                $scope.dotObject.modifiedItem = '';
            };

            $scope.updateItem = function (idx, item, e) {
                var modifiedItem = $scope.dotObject.modifiedItem;
                if ($scope.items.indexOf(modifiedItem) != -1) {
                    alert('This value already exists: ' + modifiedItem);
                    $scope.dotObject.isFocusOnEditItem = true; // not necessary when Enter key is used
                    return;
                }

                $scope.items[idx] = modifiedItem;

                $scope.isItemInEditMode = false;
                $scope.dotObject.modifiedItem = '';
            };

            $scope.removeItem = function (idx, item, e) {
                $scope.items.splice(idx, 1);

                // instead to clear selection, select the next item in the list (allowing so to easy delete multiple records)
                if ($scope.items.length > 0 && idx < $scope.items.length)
                    $scope.selectedIndex = idx;
                else
                    $scope.selectedIndex = -1;
            };

            $scope.itemUp = function () {

                var items = $scope.items;
                var oldIdx = $scope.selectedIndex;
                var newIdx = oldIdx - 1, tmp;

                var itemsLength = items.length;

                if (oldIdx > 0) {
                    tmp = items[newIdx];
                    items[newIdx] = items[oldIdx];
                    items[oldIdx] = tmp;
                } else { // oldIndex correspond to first position
                    newIdx = itemsLength - 1; // circular list
                    tmp = items[oldIdx];

                    // move all remaining items one position up
                    for (var i = 1; i <= itemsLength; i++) {
                        items[i - 1] = items[i];
                    };
                    items[newIdx] = tmp;
                };

                // <items> is just another reference to $scope.items;
                // so we don't have to switch back (e.g. $scope.items = items)

                // update selectedIndex to the new index
                $scope.selectedIndex = newIdx;
            }

            $scope.itemDown = function () {

                var items = $scope.items;
                var oldIdx = $scope.selectedIndex;
                var newIdx = oldIdx + 1, tmp;

                var itemsLength = items.length;

                if (oldIdx < itemsLength - 1) {
                    tmp = items[newIdx];
                    items[newIdx] = items[oldIdx];
                    items[oldIdx] = tmp;
                } else { // oldIndex correspond to last position
                    newIdx = 0; // circular list
                    tmp = items[oldIdx];

                    // move all remaining items one position down
                    for (var i = (itemsLength - 1) ; i > 0; i--) {
                        items[i] = items[i - 1];
                    };
                    items[newIdx] = tmp;
                };

                // <items> is just another reference to $scope.items;
                // so we don't have to switch back (e.g. $scope.items = items)

                // update selectedIndex to the new index
                $scope.selectedIndex = newIdx;
            }
        }],

        //link: function ($scope, element, attrs) {

        //}
    };
}]);