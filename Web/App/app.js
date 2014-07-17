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