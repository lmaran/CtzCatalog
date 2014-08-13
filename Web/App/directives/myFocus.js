http://stackoverflow.com/a/17739731/2726725

app.directive('myFocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.myFocus, function (newValue, oldValue) {
                if (newValue) { element[0].focus(); }
            });
            element.bind("blur", function(e) {
                $timeout(function() {
                    scope.$apply(attrs.myFocus + "=false");
                }, 0);
            });
            element.bind("focus", function(e) {
                $timeout(function() {
                    scope.$apply(attrs.myFocus + "=true");
                }, 0);
            })
        }
    }
}]);