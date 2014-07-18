///#source 1 1 /App/app.js
var app = angular.module('ctzCatalog', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    
    $routeProvider
        .when('/',
            {
                controller: 'homeController',
                templateUrl: 'App/views/home.html'
            })
        //.when('/Admin',
        //    {
        //        controller: 'homeController',
        //        templateUrl: 'App/views/admin.html'
        //    })
        .when('/pickOrders', {
            controller: 'pickOrdersController',
            templateUrl: 'App/views/pickOrders.html',
            title: 'Pick Orders'
        })
        .when('/products', {
            controller: 'productsController',
            templateUrl: 'App/views/products.html',
            title: 'Products'
        })
        .when('/products/create', {
            controller: 'productController',
            templateUrl: 'App/views/productCreate.html',
            title: 'ProductCreate'
        })
        .when('/customers', {
            controller: 'customersController',
            templateUrl: 'App/views/customers.html',
            title: 'Customers'
        })
        //.when('/Admin/WhiteList', {
        //    controller: 'whiteListController',
        //    templateUrl: 'App/views/whiteList.html',
        //    title: 'WhiteList'
        //})
        //.when('/Admin/ResetPasswords', {
        //    controller: 'resetPasswordsController',
        //    templateUrl: 'App/views/resetPasswords.html',
        //    title: 'WhiteList'
        //})
        //.when('/Speakers', {
        //    controller: 'speakerController',
        //    templateUrl: 'App/views/speakers.html',
        //    title: 'Speakers'
        //})
        //.when('/Speakers/:speakerId', {
        //    controller: 'speakerController',
        //    templateUrl: 'App/views/speakers.html',
        //    title: 'Speaker'
        //})
        .otherwise({ redirectTo: '/' });

    // use the HTML5 History API - http://scotch.io/quick-tips/js/angular/pretty-urls-in-angularjs-removing-the-hashtag
    $locationProvider.html5Mode(true);


    //// Initialize the translate provider
    //// Doc: http://angular-translate.github.io/docs/#/api
    //$translateProvider
    //    //.translations('en', translations)
    //    .preferredLanguage('en')
    //    .fallbackLanguage('en') // maybe there are some translation ids, that are available in an english translation table, but not in other (ro) translation table
    //    .useLocalStorage() //to remember the chosen language; it use 'storage-cookie' as fallback; 'storage-cookie' depends on 'ngCookies'
    //    .useStaticFilesLoader({
    //        prefix: 'Content/translates/',
    //        suffix: '.json'
    //    });
}]);



//app.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptor');
//}]);
///#source 1 1 /App/controllers/homeController.js
app.controller('homeController', ['$scope', function ($scope) {
    //alert(22);
}]);
///#source 1 1 /App/controllers/navbarController.js
app.controller('navbarController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
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

///#source 1 1 /App/controllers/pickOrdersController.js
app.controller('pickOrdersController', ['$scope', function ($scope) {

}]);
///#source 1 1 /App/controllers/productController.js
app.controller('productController', ['$scope', 'productService', '$location', function ($scope, productService, $location) {
    $scope.product = {};

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.product));
            productService.add($scope.product)
                .then(function (data) {
                    $location.path('/products');
                    //Logger.info("Widget created successfully");
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.cancel = function () {
        //$location.path('/widgets')
        $window.history.back();
    }


}]);
///#source 1 1 /App/controllers/productsController.js
app.controller('productsController', ['$scope', '$location', 'productService', function ($scope, $location,productService) {
    $scope.products = [];
    $scope.errors = {};

    init();

    //$scope.delete = function (email) {
    //    eventId = "itcongress2014";
    //    dialogService.confirm('Click ok to delete ' + email + ', otherwise click cancel.', 'Delete Email')
    //        .then(function () {

    //            // get the index for selected item
    //            var i = 0;
    //            for (i in $scope.whiteList) {
    //                if ($scope.whiteList[i] == email) break;
    //            };

    //            whiteListService.delete(eventId, email).then(function () {
    //                $scope.whiteList.splice(i, 1);
    //            })
    //            .catch(function (err) {
    //                $scope.errors = JSON.stringify(err.data, null, 4);
    //                alert($scope.errors);
    //            });

    //        }, function () {
    //            //alert('cancelled');
    //        });
    //};

    $scope.add = function () {
        eventId = "itcongress2014";
        whiteListService.add(eventId, $scope.newEmail).then(function () {
            $scope.whiteList.push($scope.newEmail);
        })
        .catch(function (err) {
            $scope.errors = JSON.stringify(err.data, null, 4);
            alert($scope.errors);
        });
    };

    $scope.createProduct = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getProducts().then(function (data) {
            $scope.products = data;
        });
    };
}]);
///#source 1 1 /App/controllers/customersController.js
app.controller('customersController', ['$scope', function ($scope) {
    //alert(22);
}]);
///#source 1 1 /App/services/productService.js
app.factory('productService', ['$http', function ($http) {

    var factory = {};

    factory.getProducts = function () {
        return $http.get('/api/products').then(function (result) {
            return result.data;
        });
    };

    //factory.delete = function (eventId, email) {
    //    return $http.delete('/api/' + eventId + '/whiteList/' + encodeURIComponent(email) + '/');
    //};

    factory.add = function (product) {
        return $http.post('/api/products/', product);
    };

    //factory.get = function (eventId, email) {
    //    return $http.get('/api/' + eventId + '/whiteList/' + encodeURIComponent(email) + '/').then(function (result) {
    //        return result.data;
    //    });
    //};

    return factory;
}]);
