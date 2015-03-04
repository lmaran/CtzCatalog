app.controller('navbarController', ['$scope', '$rootScope', '$location', '$translate', function ($scope, $rootScope, $location, $translate) {

    $scope.menu = [{
        'title': 'Pick Orders',
        'link': '/admin/pickOrders'
    }, {
        'title': 'Products',
        'link': '/admin/products'
    }, {
        'title': 'Customers',
        'link': '/admin/customers'
    }, {
    //    'title': 'OptionSets',
    //    'link': '/optionsets'
    //}, {
        'title': 'Attributes',
        'link': '/admin/attributes'
    }, {
        'title': 'AttributeSets',
        'link': '/admin/attributesets'
    }, {
        'title': 'UMs',
        'link': '/admin/ums'
    }, {
        'title': 'TechSpecs',
        'link': '/admin/techspecs'
    }];

    // http://stackoverflow.com/a/18562339
    $scope.isActive = function (route) {
        return route === $location.path();
    };

    // http://camelcas.es/articles/detect-media-queries-in-javascript.html
    var windowIsLarge = function () {
        return getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/"/g, '') == 'large'; // FF and IE add double quotes around the value
    };

    $rootScope.wrapperClass = "";
    $rootScope.contentHeaderClass = "";
    $rootScope.openSidebarBtnClass = "";
    $rootScope.toggleSidebarBtnClass = "";

    function closeSidebar() {
        $rootScope.wrapperClass = "inactive";
        $rootScope.contentHeaderClass = "fullScreen";
        $rootScope.toggleSidebarBtnClass = "outsideBar";
    }

    function openNavbar() {
        $rootScope.wrapperClass = "active";
        $rootScope.contentHeaderClass = "partialScreen";
        $rootScope.toggleSidebarBtnClass = "insideBar";
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

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };

    $scope.closeSideberIfSmall = function () {
        if (!windowIsLarge()) {
            closeSidebar();
        };
    };

}]);
