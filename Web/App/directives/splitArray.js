// http://stackoverflow.com/a/17586334/2726725
// transform textArea into array and vice-versa
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