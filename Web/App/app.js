﻿var app = angular.module('ctzCatalog', ['ngRoute', 'pascalprecht.translate', 'ngCookies', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', '$translateProvider', function ($routeProvider, $locationProvider, $translateProvider) {
    
    $routeProvider
        .when('/',
            {
                controller: 'homeController',
                templateUrl: 'App/views/home.html'
            })

        // *** pickOrders ***
        .when('/pickOrders', {
            controller: 'pickOrdersController',
            templateUrl: 'App/views/pickOrders.html',
            title: 'Pick Orders'
        })
        .when('/pickOrders/create', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrderCreate.html',
            title: 'PickOrderCreate'
        })
        .when('/pickOrders/:id', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrderEdit.html',
            title: 'PickOrderEdit',
            isEditMode: true
        })

        // *** products ***
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
        .when('/products/:id', {
            controller: 'productController',
            templateUrl: 'App/views/productEdit.html',
            title: 'ProductEdit',
            isEditMode: true
        })

        // *** customers ***
        .when('/customers', {
            controller: 'customersController',
            templateUrl: 'App/views/customers.html',
            title: 'Customers'
        })
        .when('/customers/create', {
            controller: 'customerController',
            templateUrl: 'App/views/customerCreate.html',
            title: 'CustomerCreate'
        })
        .when('/customers/:id', {
            controller: 'customerController',
            templateUrl: 'App/views/customerEdit.html',
            title: 'CustomerEdit',
            isEditMode: true
        })

        // *** optionSets ***
        .when('/optionsets', {
            controller: 'optionSetsController',
            templateUrl: 'App/views/optionSets.html',
            title: 'OptionSets'
        })
        .when('/optionsets/create', {
            controller: 'optionSetController',
            templateUrl: 'App/views/optionSetCreate.html',
            title: 'OptionSetCreate'
        })
        .when('/optionsets/:id', {
            controller: 'optionSetController',
            templateUrl: 'App/views/optionSetEdit.html',
            title: 'OptionSetEdit',
            isEditMode: true
        })

        // *** attributes ***
        .when('/attributes', {
            controller: 'attributesController',
            templateUrl: 'App/views/attributes.html',
            title: 'Attributes'
        })
        .when('/attributes/create', {
            controller: 'attributeController',
            templateUrl: 'App/views/attributeCreate.html',
            title: 'AttributeCreate'
        })
        .when('/attributes/:id', {
            controller: 'attributeController',
            templateUrl: 'App/views/attributeEdit.html',
            title: 'AttributeEdit',
            isEditMode: true
        })

        // *** attributeSets ***
        .when('/attributesets', {
            controller: 'attributeSetsController',
            templateUrl: 'App/views/attributeSets.html',
            title: 'AttributeSets'
        })
        .when('/attributesets/create', {
            controller: 'attributeSetController',
            templateUrl: 'App/views/attributeSetCreate.html',
            title: 'AttributeSetCreate'
        })
        .when('/attributesets/:id', {
            controller: 'attributeSetController',
            templateUrl: 'App/views/attributeSetEdit.html',
            title: 'AttributeSetEdit',
            isEditMode: true
        })

        .otherwise({ redirectTo: '/' });

    // use the HTML5 History API - http://scotch.io/quick-tips/js/angular/pretty-urls-in-angularjs-removing-the-hashtag
    $locationProvider.html5Mode(true);


    // Initialize the translate provider
    // Doc: http://angular-translate.github.io/docs/#/api
    $translateProvider
        //.translations('en', translations)
        .preferredLanguage('en')
        .fallbackLanguage('en') // maybe there are some translation ids, that are available in an english translation table, but not in other (ro) translation table
        .useLocalStorage() //to remember the chosen language; it use 'storage-cookie' as fallback; 'storage-cookie' depends on 'ngCookies'
        .useStaticFilesLoader({
            prefix: 'Content/translates/',
            suffix: '.json'
        });
}]);



//app.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptor');
//}]);