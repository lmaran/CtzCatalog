// Usage: <editable-simple-list items="attribute.options" />
app.directive('selectFromSimpleList', [function () {
    return {
        restrict: 'E',
        scope: { itemsIn: '=', itemsOut: '=' },
        templateUrl: '/App/templates/selectFromSimpleList.tpl.html',


        // without this construction Angular throw an "Unknown provider" message when we try to use the $scope variable inside the function (only with minified js)
        controller: ['$scope', function ($scope) {
            
            // initialize variables here
            $scope.dotObject = {};
            $scope.dotObject.selectedDefaultItem = '';

            $scope.itemsIn = $scope.itemsIn || [];          
            $scope.itemsOut = $scope.itemsOut || [];


            // this 'watch' not only allows us to reconstruct the 'itemsDif' when 'itemsIn' has changed,
            // but also it is the only way(?) we can access the values of 'itemsIn' or 'itemsOut' arrays (for initialization phase)
            // http://stackoverflow.com/a/17978867/2726725: "When the controller (and link) functions first execute, the @ properties are not populated yet."
            // http://stackoverflow.com/a/17111718/2726725. In a comment, Mark Rajcok says:
            //      use $observe()  -->  for '@' variables
            //      use $watch()    -->  for '=' variables
            $scope.$watchCollection('itemsIn', function (itemsInNew, itemsInOld) {
                // update 'itemsOut' if 'itemsIn' has changed
                $scope.itemsOut.forEach(function (item, index) {
                    if ($scope.itemsIn.indexOf(item) == -1) {
                        var renamedValue = getReanmedValue(item, itemsInOld, itemsInNew);
                        if (renamedValue) {// the value has been renamed
                            $scope.itemsOut[index] = renamedValue;
                        }
                        else // the value has been removed
                            $scope.itemsOut.splice(index, 1);
                    }
                });

                // construct the 'itemsDif' array - the list from which we chose default values
                $scope.itemsDif = [];
                $scope.itemsIn.forEach(function (item) {
                    if ($scope.itemsOut.indexOf(item) == -1) {
                        $scope.itemsDif.push(item);
                    }
                });
            });


            $scope.addDefaultItem = function () {
                var defaultItem = $scope.dotObject.selectedDefaultItem
                var idx = $scope.itemsDif.indexOf(defaultItem);

                $scope.itemsDif.splice(idx, 1);
                $scope.itemsOut.push(defaultItem);
            };

            $scope.selectedIndex = -1; //no item selected


            // toggle selection for a given item by name 
            // http://stackoverflow.com/a/14520103/2726725
            $scope.toggleSelection = function toggleSelection(currentIndex) {
                $scope.isVisibleAddNewItem = false;

                if ($scope.selectedIndex == currentIndex)
                    $scope.selectedIndex = -1;
                else
                    $scope.selectedIndex = currentIndex;
            };


            $scope.removeItem = function (idx, item, e) {
                $scope.itemsOut.splice(idx, 1);
                $scope.itemsDif.push(item);

                // instead to clear selection, select the next item in the list (allowing so to easy delete multiple records)
                if ($scope.itemsOut.length > 0 && idx < $scope.itemsOut.length)
                    $scope.selectedIndex = idx;
                else
                    $scope.selectedIndex = -1;
            };


            function getReanmedValue(oldValue, itemsOld, itemsNew) {
                // we have 2 arrays of strings: itemsOld and itemsNew
                // the second list is supposed to be a replica of the first, except for a single line (one item renamed)
                // so, giving the oldValue we want to find the newValue for the renamed item (or null, otherwise)

                var nrOfModifications = 0;
                newValue = null;

                if (itemsOld.length != itemsNew.length) // not a rename op.
                    return null;

                var itemsOldLength = itemsOld.length;
                for (var i = 0; i < itemsOldLength; i++) { // in forEach we can't break the loop
                    if (itemsOld[i] != itemsNew[i]) {
                        newValue = itemsNew[i];
                        nrOfModifications += 1;
                        if (nrOfModifications == 2) return null; // break the loop (not a simple rename op.)
                    }
                }

                return newValue;
            };

        }],

        //link: function ($scope, element, attrs) {}
    };
}]);