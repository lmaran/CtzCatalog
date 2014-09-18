// Usage: <ANY in-place-edit-text value="widget.name"> 
app.directive('inPlaceEditText', [function () {
    return {
        restrict: 'A',
        scope: { value: '=' },
        template: '<span class="inplaceedit-child0 active" ng-click="edit()">' +
                        '{{value}}' +
                        '<span class="inplaceedit-icon">&#x270f;</span>' +
                  '</span>' +
                  '<input class="inplaceedit-child1" ng-model="value"></input>',

        link: function ($scope, element, attrs) {
            var spanElement = angular.element(element.children()[0]);
            var inputElement = angular.element(element.children()[1]);

            // ng-click handler to activate edit-in-place
            $scope.edit = function () {
                spanElement.removeClass('active');
                inputElement.addClass('active');

                inputElement[0].focus();
            };

            inputElement.bind('blur', function () {
                spanElement.addClass('active');
                inputElement.removeClass('active');

                if (inputElement.val() == '') {
                    $scope.value = 'New widget'; // Monica's spec.
                };
            });

            element.bind("keydown keypress", function (event) {
                if (event.keyCode === 13) {
                    // alert('enter');
                };
                if (event.keyCode == 27) {
                    // alert('escape');
                };
            });

        }
    };
}]);