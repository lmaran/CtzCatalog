app.controller('navbarController', ['$scope', '$rootScope', '$location', '$translate', function ($scope, $rootScope, $location, $translate) {
    $scope.menu = [{
        'title': 'Pick Orders',
        'link': '/pickOrders'
    }, {
        'title': 'Products',
        'link': '/products'
    }, {
        'title': 'Customers',
        'link': '/customers'
    }];

    // http://stackoverflow.com/a/18562339
    $scope.isActive = function (route) {
        return route === $location.path();
    };

    var windowIsLarge = function () {
        return getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '') == 'large'; // FF and IE add double quotes around the value
    };

    $rootScope.wrapperClass = "";
    $rootScope.contentHeaderClass = "";
    $rootScope.openSidebarBtnClass = "";
    $scope.toggleSidebarBtnClass = "";

    //$scope.closeSidebar = function () {
    //    $rootScope.wrapperClass = "inactive";
    //    $rootScope.contentHeaderClass = "inactive";
    //    $rootScope.openSidebarBtnClass = "active";
    //};

    //$scope.openSidebar = function () {
    //    $rootScope.wrapperClass = "active";
    //    $rootScope.contentHeaderClass = "active";
    //    $rootScope.openSidebarBtnClass = "inactive";
    //};

    function closeSidebar() {
        $rootScope.wrapperClass = "inactive";
        $rootScope.contentHeaderClass = "fullScreen";
        $scope.toggleSidebarBtnClass = "outsideBar";
    }

    function openNavbar() {
        $rootScope.wrapperClass = "active";
        $rootScope.contentHeaderClass = "partialScreen";
        $scope.toggleSidebarBtnClass = "insideBar";
    }

    $scope.toggleSidebar = function () {
        if ($rootScope.wrapperClass=="") {
            if (windowIsLarge()) {
                closeSidebar();
            } else {
                openNavbar();
            }
        } else {
            if ($scope.toggleSidebarBtnClass == "insideBar") {
                closeSidebar();
            } else {
                openNavbar();
            }
        }
    };
}]);
