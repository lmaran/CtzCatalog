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
    'ui.bootstrap.dropdown',
    'ui.bootstrap.tpls', // or add only the related templates: 'template/accordion/accordion-group.html', 'template/accordion/accordion.html',
    'angularFileUpload',
    'ui.sortable'
]);

app.config(['$routeProvider', '$locationProvider', '$translateProvider', '$tooltipProvider', function ($routeProvider, $locationProvider, $translateProvider, $tooltipProvider) {
    
    $routeProvider

        .when('/admin',
            {
                controller: 'homeController',
                templateUrl: 'App/views/home.html'
            })

        // *** pickOrders ***
        .when('/admin/pickOrders', {
            controller: 'pickOrdersController',
            templateUrl: 'App/views/pickOrders.html',
            title: 'Pick Orders'
        })
        .when('/admin/pickOrders/create', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrder.html',
            title: 'Create PickOrder'
        })
        .when('/admin/pickOrders/:id', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrder.html',
            title: 'Edit PickOrder',
            isEditMode: true
        })

        // *** products ***
        .when('/admin/products', {
            controller: 'productsController',
            templateUrl: 'App/views/products.html',
            title: 'Products'
        })
        .when('/admin/products/create', {
            controller: 'productController',
            templateUrl: 'App/views/product.html',
            title: 'Create Product'
        })
        .when('/admin/products/:id', {
            controller: 'productController',
            templateUrl: 'App/views/product.html',
            title: 'Edit Product',
            isEditMode: true
        })

        // *** customers ***
        .when('/admin/customers', {
            controller: 'customersController',
            templateUrl: 'App/views/customers.html',
            title: 'Customers'
        })
        .when('/admin/customers/create', {
            controller: 'customerController',
            templateUrl: 'App/views/customer.html',
            title: 'Create Customer'
        })
        .when('/admin/customers/:id', {
            controller: 'customerController',
            templateUrl: 'App/views/customer.html',
            title: 'Edit Customer',
            isEditMode: true
        })

        // *** optionSets ***
        .when('/admin/optionsets', {
            controller: 'optionSetsController',
            templateUrl: 'App/views/optionSets.html',
            title: 'OptionSets'
        })
        .when('/admin/optionsets/create', {
            controller: 'optionSetController',
            templateUrl: 'App/views/optionSet.html',
            title: 'Create OptionSet'
        })
        .when('/admin/optionsets/:id', {
            controller: 'optionSetController',
            templateUrl: 'App/views/optionSet.html',
            title: 'Edit OptionSet',
            isEditMode: true
        })

        // *** attributes ***
        .when('/admin/attributes', {
            controller: 'attributesController',
            templateUrl: 'App/views/attributes.html',
            title: 'Attributes'
        })
        .when('/admin/attributes/create', {
            controller: 'attributeController',
            templateUrl: 'App/views/attribute.html',
            title: 'Create Attribute'
        })
        .when('/admin/attributes/:id', {
            controller: 'attributeController',
            templateUrl: 'App/views/attribute.html',
            title: 'Edit Attribute',
            isEditMode: true
        })

        // *** attributeSets ***
        .when('/admin/attributesets', {
            controller: 'attributeSetsController',
            templateUrl: 'App/views/attributeSets.html',
            title: 'AttributeSets'
        })
        .when('/admin/attributesets/create', {
            controller: 'attributeSetController',
            templateUrl: 'App/views/attributeSet.html',
            title: 'Create AttributeSet'
        })
        .when('/admin/attributesets/:id', {
            controller: 'attributeSetController',
            templateUrl: 'App/views/attributeSet.html',
            title: 'Edit AttributeSet',
            isEditMode: true
        })

        // *** ums ***
        .when('/admin/ums', {
            controller: 'umsController',
            templateUrl: 'App/views/ums.html',
            title: 'Customers'
        })
        .when('/admin/ums/create', {
            controller: 'umController',
            templateUrl: 'App/views/um.html',
            title: 'Create UM'
        })
        .when('/admin/ums/:id', {
            controller: 'umController',
            templateUrl: 'App/views/um.html',
            title: 'Edit UM',
            isEditMode: true
        })

        // *** techSpecs ***
        .when('/admin/techspecs', {
            controller: 'techSpecsController',
            templateUrl: 'App/views/techSpecs.html',
            title: 'Customers'
        })
        .when('/admin/techspecs/create', {
            controller: 'techSpecController',
            templateUrl: 'App/views/techSpec.html',
            title: 'Create TechSpec'
        })
        .when('/admin/techspecs/:id', {
            controller: 'techSpecController',
            templateUrl: 'App/views/techSpec.html',
            title: 'Edit TechSpec',
            isEditMode: true
        })

        .otherwise({ redirectTo: '/admin' });

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