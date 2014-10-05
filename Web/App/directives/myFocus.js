http://stackoverflow.com/a/17739731/2726725

app.directive('myFocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            if (attrs.myFocus == "true" || attrs.myFocus == "") { //set focus without using a scope variable (Ex: 'my-focus="true"' or simply 'my-focus')
                $timeout(function () {
                    element[0].focus();
                }, 0);
            } else {
                scope.$watch(attrs.myFocus, function (newValue, oldValue) {
                    $timeout(function () {
                        if (newValue) { element[0].focus(); }
                    }, 0);
                });
                element.bind("blur", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.myFocus + "=false");
                    }, 0);
                });
                element.bind("focus", function (e) {
                    $timeout(function () {
                        scope.$apply(attrs.myFocus + "=true");
                    }, 0);
                })
            }
        }


        //link: function (scope, element, attrs) {
        //    scope.$watch(attrs.myFocus, function (_focusVal) {
        //        $timeout(function() {
        //            _focusVal ? element[0].focus() :
        //                element[0].blur();
        //        });
        //    });
        //}

    }
}]);


