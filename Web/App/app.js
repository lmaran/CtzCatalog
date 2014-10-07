// in case we want to load ui.bootstrap as individual components we need to add references to the related templates
// we can specify only the related templates: E.g. for <ui.bootstrap.accordion> --> 'template/accordion/accordion-group.html', 'template/accordion/accordion.html'
// or we can specify a reference to the entire template: --> 'ui.bootstrap.tpls', in case we plan to use more modules in the future and reduce maintenance overhead
// https://github.com/angular-ui/bootstrap/issues/266
var app = angular.module('ctzCatalog', [
    'ngAnimate',
    'ngSanitize',
    'ngRoute',
    'pascalprecht.translate',
    'ngCookies',
    'monospaced.elastic',
    'mgcrea.ngStrap',
    'ui.bootstrap.accordion',
    'ui.bootstrap.tpls', // or add only the related templates: 'template/accordion/accordion-group.html', 'template/accordion/accordion.html',
    'angularFileUpload'

]);

app.config(['$routeProvider', '$locationProvider', '$translateProvider', '$tooltipProvider', function ($routeProvider, $locationProvider, $translateProvider, $tooltipProvider) {
    
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
            templateUrl: 'App/views/pickOrder.html',
            title: 'Create PickOrder'
        })
        .when('/pickOrders/:id', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrder.html',
            title: 'Edit PickOrder',
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
            templateUrl: 'App/views/product.html',
            title: 'Create Product'
        })
        .when('/products/:id', {
            controller: 'productController',
            templateUrl: 'App/views/product.html',
            title: 'Edit Product',
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
            templateUrl: 'App/views/customer.html',
            title: 'Create Customer'
        })
        .when('/customers/:id', {
            controller: 'customerController',
            templateUrl: 'App/views/customer.html',
            title: 'Edit Customer',
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
            templateUrl: 'App/views/optionSet.html',
            title: 'Create OptionSet'
        })
        .when('/optionsets/:id', {
            controller: 'optionSetController',
            templateUrl: 'App/views/optionSet.html',
            title: 'Edit OptionSet',
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
            templateUrl: 'App/views/attribute.html',
            title: 'Create Attribute'
        })
        .when('/attributes/:id', {
            controller: 'attributeController',
            templateUrl: 'App/views/attribute.html',
            title: 'Edit Attribute',
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
            templateUrl: 'App/views/attributeSet.html',
            title: 'Create AttributeSet'
        })
        .when('/attributesets/:id', {
            controller: 'attributeSetController',
            templateUrl: 'App/views/attributeSet.html',
            title: 'Edit AttributeSet',
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

    angular.extend($tooltipProvider.defaults, {
        html: true
    });

}]);


app.config(function ($modalProvider) {
    angular.extend($modalProvider.defaults, {
        //animation: '',
        //backdropAnimation: ''
    });
})

//app.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptor');
//}]);