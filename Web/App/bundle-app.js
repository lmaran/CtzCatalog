///#source 1 1 /Scripts/bower_components/angular-animate/angular-animate.js
/**
 * @license AngularJS v1.2.22
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 * | {@link ng.directive:form#usage_animations form}                 | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 * | {@link ng.directive:ngModel#usage_animations ngModel}           | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * ```html
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * ```
 *
 * Keep in mind that, by default, if an animation is running, any child elements cannot be animated
 * until the parent element's animation has completed. This blocking feature can be overridden by
 * placing the `ng-animate-children` attribute on a parent container tag.
 *
 * ```html
 * <div class="slide-animation" ng-if="on" ng-animate-children>
 *   <div class="fade-animation" ng-if="on">
 *     <div class="explode-animation" ng-if="on">
 *        ...
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * When the `on` expression value changes and an animation is triggered then each of the elements within
 * will all animate without the block being applied to child elements.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * ```html
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * ```html
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * @-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * @keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * ```css
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * ```
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * ```js
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * ```js
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * ```
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc provider
   * @name $animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .directive('ngAnimateChildren', function() {
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    return function(scope, element, attrs) {
      var val = attrs.ngAnimateChildren;
      if(angular.isString(val) && val.length === 0) { //empty attribute
        element.data(NG_ANIMATE_CHILDREN, true);
      } else {
        scope.$watch(val, function(value) {
          element.data(NG_ANIMATE_CHILDREN, !!value);
        });
      }
    };
  })

  //this private service is only used within CSS-enabled animations
  //IE8 + IE9 do not support rAF natively, but that is fine since they
  //also don't support transitions and keyframes which means that the code
  //below will never be used by the two browsers.
  .factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
    var bod = $document[0].body;
    return function(fn) {
      //the returned function acts as the cancellation function
      return $$rAF(function() {
        //the line below will force the browser to perform a repaint
        //so that all the animated elements within the animation frame
        //will be properly updated and drawn on screen. This is
        //required to perform multi-class CSS based animations with
        //Firefox. DO NOT REMOVE THIS LINE.
        var a = bod.offsetWidth + 1;
        fn();
      });
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for(var i = 0; i < element.length; i++) {
        var elm = element[i];
        if(elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function prepareElement(element) {
      return element && angular.element(element);
    }

    function stripCommentsFromElement(element) {
      return angular.element(extractElementNode(element));
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $$asyncCallback,    $rootScope,   $document) {

      var globalAnimationCounter = 0;
      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, wait again
      // for another digest until enabling animations. The reason why we digest twice
      // is because all structural animations (enter, leave and move) all perform a
      // post digest operation before animating. If we only wait for a single digest
      // to pass then the structural animation would render its animation on page load.
      // (which is what we're trying to avoid when the application first boots up.)
      $rootScope.$$postDigest(function() {
        $rootScope.$$postDigest(function() {
          rootAnimateState.running = false;
        });
      });

      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

      function blockElementAnimations(element) {
        var data = element.data(NG_ANIMATE_STATE) || {};
        data.running = true;
        element.data(NG_ANIMATE_STATE, data);
      }

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations. The default
          //animation is added to the top of the list to prevent
          //any previous animations from affecting the element styling
          //prior to the element being animated.
          if ($sniffer.transitions || $sniffer.animations) {
            matches.push($injector.get(selectors['']));
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      function animationRunner(element, animationEvent, className) {
        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        var node = element[0];
        if(!node) {
          return;
        }

        var isSetClassOperation = animationEvent == 'setClass';
        var isClassBased = isSetClassOperation ||
                           animationEvent == 'addClass' ||
                           animationEvent == 'removeClass';

        var classNameAdd, classNameRemove;
        if(angular.isArray(className)) {
          classNameAdd = className[0];
          classNameRemove = className[1];
          className = classNameAdd + ' ' + classNameRemove;
        }

        var currentClassName = element.attr('class');
        var classes = currentClassName + ' ' + className;
        if(!isAnimatableClassName(classes)) {
          return;
        }

        var beforeComplete = noop,
            beforeCancel = [],
            before = [],
            afterComplete = noop,
            afterCancel = [],
            after = [];

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        forEach(lookup(animationLookup), function(animationFactory) {
          var created = registerAnimation(animationFactory, animationEvent);
          if(!created && isSetClassOperation) {
            registerAnimation(animationFactory, 'addClass');
            registerAnimation(animationFactory, 'removeClass');
          }
        });

        function registerAnimation(animationFactory, event) {
          var afterFn = animationFactory[event];
          var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
          if(afterFn || beforeFn) {
            if(event == 'leave') {
              beforeFn = afterFn;
              //when set as null then animation knows to skip this phase
              afterFn = null;
            }
            after.push({
              event : event, fn : afterFn
            });
            before.push({
              event : event, fn : beforeFn
            });
            return true;
          }
        }

        function run(fns, cancellations, allCompleteFn) {
          var animations = [];
          forEach(fns, function(animation) {
            animation.fn && animations.push(animation);
          });

          var count = 0;
          function afterAnimationComplete(index) {
            if(cancellations) {
              (cancellations[index] || noop)();
              if(++count < animations.length) return;
              cancellations = null;
            }
            allCompleteFn();
          }

          //The code below adds directly to the array in order to work with
          //both sync and async animations. Sync animations are when the done()
          //operation is called right away. DO NOT REFACTOR!
          forEach(animations, function(animation, index) {
            var progress = function() {
              afterAnimationComplete(index);
            };
            switch(animation.event) {
              case 'setClass':
                cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress));
                break;
              case 'addClass':
                cancellations.push(animation.fn(element, classNameAdd || className,     progress));
                break;
              case 'removeClass':
                cancellations.push(animation.fn(element, classNameRemove || className,  progress));
                break;
              default:
                cancellations.push(animation.fn(element, progress));
                break;
            }
          });

          if(cancellations && cancellations.length === 0) {
            allCompleteFn();
          }
        }

        return {
          node : node,
          event : animationEvent,
          className : className,
          isClassBased : isClassBased,
          isSetClassOperation : isSetClassOperation,
          before : function(allCompleteFn) {
            beforeComplete = allCompleteFn;
            run(before, beforeCancel, function() {
              beforeComplete = noop;
              allCompleteFn();
            });
          },
          after : function(allCompleteFn) {
            afterComplete = allCompleteFn;
            run(after, afterCancel, function() {
              afterComplete = noop;
              allCompleteFn();
            });
          },
          cancel : function() {
            if(beforeCancel) {
              forEach(beforeCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              beforeComplete(true);
            }
            if(afterCancel) {
              forEach(afterCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              afterComplete(true);
            }
          }
        };
      }

      /**
       * @ngdoc service
       * @name $animate
       * @kind function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc method
         * @name $animate#enter
         * @kind function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the enter animation
         * @param {DOMElement} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          blockElementAnimations(element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#leave
         * @kind function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {DOMElement} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          element = angular.element(element);
          cancelChildAnimations(element);
          blockElementAnimations(element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#move
         * @kind function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the move animation
         * @param {DOMElement} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          cancelChildAnimations(element);
          blockElementAnimations(element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#addClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#removeClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

          /**
           *
           * @ngdoc function
           * @name $animate#setClass
           * @function
           * @description Adds and/or removes the given CSS classes to and from the element.
           * Once complete, the done() callback will be fired (if provided).
           * @param {DOMElement} element the element which will its CSS classes changed
           *   removed from it
           * @param {string} add the CSS classes which will be added to the element
           * @param {string} remove the CSS class which will be removed from the element
           * @param {Function=} done the callback function (if provided) that will be fired after the
           *   CSS classes have been set on the element
           */
        setClass : function(element, add, remove, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('setClass', [add, remove], element, null, null, function() {
            $delegate.setClass(element, add, remove);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#enabled
         * @kind function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {DOMElement=} element If provided then the element will be used to represent the enable/disable operation
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {

        var runner = animationRunner(element, animationEvent, className);
        if(!runner) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        className = runner.className;
        var elementEvents = angular.element._data(runner.node);
        elementEvents = elementEvents && elementEvents.events;

        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};
        var runningAnimations     = ngAnimateState.active || {};
        var totalActiveAnimations = ngAnimateState.totalActive || 0;
        var lastAnimation         = ngAnimateState.last;

        //only allow animations if the currently running animation is not structural
        //or if there is no animation running at all
        var skipAnimations;
        if (runner.isClassBased) {
          skipAnimations = ngAnimateState.running ||
                           ngAnimateState.disabled ||
                           (lastAnimation && !lastAnimation.isClassBased);
        }

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case an animation was found.
        if (skipAnimations || animationsDisabled(element, parentElement)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var skipAnimation = false;
        if(totalActiveAnimations > 0) {
          var animationsToCancel = [];
          if(!runner.isClassBased) {
            if(animationEvent == 'leave' && runningAnimations['ng-leave']) {
              skipAnimation = true;
            } else {
              //cancel all animations when a structural animation takes place
              for(var klass in runningAnimations) {
                animationsToCancel.push(runningAnimations[klass]);
                cleanup(element, klass);
              }
              runningAnimations = {};
              totalActiveAnimations = 0;
            }
          } else if(lastAnimation.event == 'setClass') {
            animationsToCancel.push(lastAnimation);
            cleanup(element, className);
          }
          else if(runningAnimations[className]) {
            var current = runningAnimations[className];
            if(current.event == animationEvent) {
              skipAnimation = true;
            } else {
              animationsToCancel.push(current);
              cleanup(element, className);
            }
          }

          if(animationsToCancel.length > 0) {
            forEach(animationsToCancel, function(operation) {
              operation.cancel();
            });
          }
        }

        if(runner.isClassBased && !runner.isSetClassOperation && !skipAnimation) {
          skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
        }

        if(skipAnimation) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        if(animationEvent == 'leave') {
          //there's no need to ever remove the listener since the element
          //will be removed (destroyed) after the leave animation ends or
          //is cancelled midway
          element.one('$destroy', function(e) {
            var element = angular.element(this);
            var state = element.data(NG_ANIMATE_STATE);
            if(state) {
              var activeLeaveAnimation = state.active['ng-leave'];
              if(activeLeaveAnimation) {
                activeLeaveAnimation.cancel();
                cleanup(element, 'ng-leave');
              }
            }
          });
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        var localAnimationCount = globalAnimationCounter++;
        totalActiveAnimations++;
        runningAnimations[className] = runner;

        element.data(NG_ANIMATE_STATE, {
          last : runner,
          active : runningAnimations,
          index : localAnimationCount,
          totalActive : totalActiveAnimations
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        fireBeforeCallbackAsync();
        runner.before(function(cancelled) {
          var data = element.data(NG_ANIMATE_STATE);
          cancelled = cancelled ||
                        !data || !data.active[className] ||
                        (runner.isClassBased && data.active[className].event != animationEvent);

          fireDOMOperation();
          if(cancelled === true) {
            closeAnimation();
          } else {
            fireAfterCallbackAsync();
            runner.after(closeAnimation);
          }
        });

        function fireDOMCallback(animationPhase) {
          var eventName = '$animate:' + animationPhase;
          if(elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
            $$asyncCallback(function() {
              element.triggerHandler(eventName, {
                event : animationEvent,
                className : className
              });
            });
          }
        }

        function fireBeforeCallbackAsync() {
          fireDOMCallback('before');
        }

        function fireAfterCallbackAsync() {
          fireDOMCallback('after');
        }

        function fireDoneCallbackAsync() {
          fireDOMCallback('close');
          if(doneCallback) {
            $$asyncCallback(function() {
              doneCallback();
            });
          }
        }

        //it is less complicated to use a flag than managing and canceling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if(!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(runner && runner.isClassBased) {
                cleanup(element, className);
              } else {
                $$asyncCallback(function() {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  if(localAnimationCount == data.index) {
                    cleanup(element, className, animationEvent);
                  }
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        if (node) {
          var nodes = angular.isFunction(node.getElementsByClassName) ?
            node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) :
            node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
          forEach(nodes, function(element) {
            element = angular.element(element);
            var data = element.data(NG_ANIMATE_STATE);
            if(data && data.active) {
              forEach(data.active, function(runner) {
                runner.cancel();
              });
            }
          });
        }
      }

      function cleanup(element, className) {
        if(isMatchingElement(element, $rootElement)) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else if(className) {
          var data = element.data(NG_ANIMATE_STATE) || {};

          var removeAnimations = className === true;
          if(!removeAnimations && data.active && data.active[className]) {
            data.totalActive--;
            delete data.active[className];
          }

          if(removeAnimations || !data.totalActive) {
            element.removeClass(NG_ANIMATE_CLASS_NAME);
            element.removeData(NG_ANIMATE_STATE);
          }
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) {
          return true;
        }

        if (isMatchingElement(element, $rootElement)) {
          return rootAnimateState.running;
        }

        var allowChildAnimations, parentRunningAnimation, hasParent;
        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if (parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
          if (state.disabled) {
            return true;
          }

          //no matter what, for an animation to work it must reach the root element
          //this implies that the element is attached to the DOM when the animation is run
          if (isRoot) {
            hasParent = true;
          }

          //once a flag is found that is strictly false then everything before
          //it will be discarded and all child animations will be restricted
          if (allowChildAnimations !== false) {
            var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
            if(angular.isDefined(animateChildrenFlag)) {
              allowChildAnimations = animateChildrenFlag;
            }
          }

          parentRunningAnimation = parentRunningAnimation ||
                                   state.running ||
                                   (state.last && !state.last.isClassBased);
        }
        while(parentElement = parentElement.parent());

        return !hasParent || (!allowChildAnimations && parentRunningAnimation);
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_BLOCK_CLASS_NAME = 'ng-animate-block-transitions';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var cancelAnimationReflow;
      function afterReflow(element, callback) {
        if(cancelAnimationReflow) {
          cancelAnimationReflow();
        }
        animationReflowQueue.push(callback);
        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          animationReflowQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
        });
      }

      var closingTimer = null;
      var closingTimestamp = 0;
      var animationElementQueue = [];
      function animationCloseHandler(element, totalTime) {
        var node = extractElementNode(element);
        element = angular.element(node);

        //this item will be garbage collected by the closing
        //animation timeout
        animationElementQueue.push(element);

        //but it may not need to cancel out the existing timeout
        //if the timestamp is less than the previous one
        var futureTimestamp = Date.now() + totalTime;
        if(futureTimestamp <= closingTimestamp) {
          return;
        }

        $timeout.cancel(closingTimer);

        closingTimestamp = futureTimestamp;
        closingTimer = $timeout(function() {
          closeAllAnimations(animationElementQueue);
          animationElementQueue = [];
        }, totalTime, false);
      }

      function closeAllAnimations(elements) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(elementData) {
            (elementData.closeAnimationFn || noop)();
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).getAttribute('class');
      }

      function animateSetup(animationEvent, element, className, calculationDecorator) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        var stagger = {};
        if(itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        /* the animation itself may need to add/remove special CSS classes
         * before calculating the anmation styles */
        calculationDecorator = calculationDecorator ||
                               function(fn) { return fn(); };

        element.addClass(className);

        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};

        var timings = calculationDecorator(function() {
          return getElementAnimationDetails(element, eventCacheKey);
        });

        var transitionDuration = timings.transitionDuration;
        var animationDuration = timings.animationDuration;
        if(transitionDuration === 0 && animationDuration === 0) {
          element.removeClass(className);
          return false;
        }

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          running : formerData.running || 0,
          itemIndex : itemIndex,
          stagger : stagger,
          timings : timings,
          closeAnimationFn : noop
        });

        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var isCurrentlyAnimating = formerData.running > 0 || animationEvent == 'setClass';
        if(transitionDuration > 0) {
          blockTransitions(element, className, isCurrentlyAnimating);
        }

        //staggering keyframe animations work by adjusting the `animation-delay` CSS property
        //on the given element, however, the delay value can only calculated after the reflow
        //since by that time $animate knows how many elements are being animated. Therefore,
        //until the reflow occurs the element needs to be blocked (where the keyframe animation
        //is set to `none 0s`). This blocking mechanism should only be set for when a stagger
        //animation is detected and when the element item index is greater than 0.
        if(animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0) {
          blockKeyframeAnimations(element);
        }

        return true;
      }

      function isStructuralAnimation(className) {
        return className == 'ng-enter' || className == 'ng-move' || className == 'ng-leave';
      }

      function blockTransitions(element, className, isAnimating) {
        if(isStructuralAnimation(className) || !isAnimating) {
          extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        } else {
          element.addClass(NG_ANIMATE_BLOCK_CLASS_NAME);
        }
      }

      function blockKeyframeAnimations(element) {
        extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
      }

      function unblockTransitions(element, className) {
        var prop = TRANSITION_PROP + PROPERTY_KEY;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
        element.removeClass(NG_ANIMATE_BLOCK_CLASS_NAME);
      }

      function unblockKeyframeAnimations(element) {
        var prop = ANIMATION_PROP;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function animateRun(animationEvent, element, className, activeAnimationComplete) {
        var node = extractElementNode(element);
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(node.getAttribute('class').indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var activeClassName = '';
        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        var stagger = elementData.stagger;
        var timings = elementData.timings;
        var itemIndex = elementData.itemIndex;
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDelayTime = maxDelay * ONE_SECOND;

        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;

        var style = '', appliedStyles = [];
        if(timings.transitionDuration > 0) {
          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
            appliedStyles.push(CSS_PREFIX + 'transition-property');
            appliedStyles.push(CSS_PREFIX + 'transition-duration');
          }
        }

        if(itemIndex > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'transition-delay');
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'animation-delay');
          }
        }

        if(appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          node.setAttribute('style', oldStyle + '; ' + style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);
        elementData.closeAnimationFn = function() {
          onEnd();
          activeAnimationComplete();
        };

        var staggerTime       = itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
        var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
        var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

        elementData.running++;
        animationCloseHandler(element, totalTime);
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(animationEvent, element, className, calculationDecorator) {
        if(animateSetup(animationEvent, element, className, calculationDecorator)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(animationEvent, element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(animationEvent, element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(animationEvent, element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(animationEvent, element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          unblockTransitions(element, className);
          unblockKeyframeAnimations(element);
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(animationEvent, element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(data) {
          if(data.running) {
            data.running--;
          }
          if(!data.running || data.running === 0) {
            element.removeData(NG_ANIMATE_CSS_DATA_KEY);
          }
        }
      }

      return {
        enter : function(element, animationCompleted) {
          return animate('enter', element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate('leave', element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate('move', element, 'ng-move', animationCompleted);
        },

        beforeSetClass : function(element, add, remove, animationCompleted) {
          var className = suffixClasses(remove, '-remove') + ' ' +
                          suffixClasses(add, '-add');
          var cancellationMethod = animateBefore('setClass', element, className, function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(remove);
            element.addClass(add);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), function(fn) {

            /* when a CSS class is added to an element then the transition style that
             * is applied is the transition defined on the element when the CSS class
             * is added at the time of the animation. This is how CSS3 functions
             * outside of ngAnimate. */
            element.addClass(className);
            var timings = fn();
            element.removeClass(className);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        setClass : function(element, add, remove, animationCompleted) {
          remove = suffixClasses(remove, '-remove');
          add = suffixClasses(add, '-add');
          var className = remove + ' ' + add;
          return animateAfter('setClass', element, className, animationCompleted);
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(className);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);

///#source 1 1 /Scripts/bower_components/angular-sanitize/angular-sanitize.js
/**
 * @license AngularJS v1.2.22
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  if (typeof html !== 'string') {
    if (html === null || typeof html === 'undefined') {
      html = '';
    } else {
      html = '' + html;
    }
  }
  var index, chars, match, stack = [], last = html, text;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    text = '';
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0], '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          // We only have a valid start-tag if there is a '>'.
          if ( match[4] ) {
            html = html.substring( match[0].length );
            match[0].replace( START_TAG_REGEXP, parseStartTag );
          }
          chars = false;
        } else {
          // no ending tag found --- this piece should be encoded as an entity.
          text += '<';
          html = html.substring(1);
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        text += index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  // Note: IE8 does not preserve spaces at the start/end of innerHTML
  // so we must capture them and reattach them afterward
  var parts = spaceRe.exec(value);
  var spaceBefore = parts[1];
  var spaceAfter = parts[3];
  var content = parts[2];
  if (content) {
    hiddenPre.innerHTML=content.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary
    // reflows. However, IE<9 don't support textContent so the innerText
    // fallback is necessary.
    content = 'textContent' in hiddenPre ?
      hiddenPre.textContent : hiddenPre.innerText;
  }
  return spaceBefore + content + spaceAfter;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         angular.module('linkyExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.snippet =
               'Pretty text with some links:\n'+
               'http://angularjs.org/,\n'+
               'mailto:us@somewhere.org,\n'+
               'another@somewhere.org,\n'+
               'and one more: ftp://127.0.0.1/.';
             $scope.snippetWithTarget = 'http://angularjs.org/';
           }]);
       </script>
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

///#source 1 1 /Scripts/bower_components/angular-cookies/angular-cookies.js
/**
 * @license AngularJS v1.3.0-beta.15
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * # ngCookies
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 *
 * <div doc-module-components="ngCookies"></div>
 *
 * See {@link ngCookies.$cookies `$cookies`} and
 * {@link ngCookies.$cookieStore `$cookieStore`} for usage.
 */


angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc service
   * @name $cookies
   *
   * @description
   * Provides read/write access to browser's cookies.
   *
   * Only a simple Object is exposed and by adding or removing properties to/from this object, new
   * cookies are created/deleted at the end of current $eval.
   * The object's properties can only be strings.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * angular.module('cookiesExample', ['ngCookies'])
   *   .controller('ExampleController', ['$cookies', function($cookies) {
   *     // Retrieving a cookie
   *     var favoriteCookie = $cookies.myFavorite;
   *     // Setting a cookie
   *     $cookies.myFavorite = 'oatmeal';
   *   }]);
   * ```
   */
   factory('$cookies', ['$rootScope', '$browser', function ($rootScope, $browser) {
      var cookies = {},
          lastCookies = {},
          lastBrowserCookies,
          runEval = false,
          copy = angular.copy,
          isUndefined = angular.isUndefined;

      //creates a poller fn that copies all cookies from the $browser to service & inits the service
      $browser.addPollFn(function() {
        var currentCookies = $browser.cookies();
        if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
          lastBrowserCookies = currentCookies;
          copy(currentCookies, lastCookies);
          copy(currentCookies, cookies);
          if (runEval) $rootScope.$apply();
        }
      })();

      runEval = true;

      //at the end of each eval, push cookies
      //TODO: this should happen before the "delayed" watches fire, because if some cookies are not
      //      strings or browser refuses to store some cookies, we update the model in the push fn.
      $rootScope.$watch(push);

      return cookies;


      /**
       * Pushes all the cookies from the service to the browser and verifies if all cookies were
       * stored.
       */
      function push() {
        var name,
            value,
            browserCookies,
            updated;

        //delete any cookies deleted in $cookies
        for (name in lastCookies) {
          if (isUndefined(cookies[name])) {
            $browser.cookies(name, undefined);
          }
        }

        //update all cookies updated in $cookies
        for(name in cookies) {
          value = cookies[name];
          if (!angular.isString(value)) {
            value = '' + value;
            cookies[name] = value;
          }
          if (value !== lastCookies[name]) {
            $browser.cookies(name, value);
            updated = true;
          }
        }

        //verify what was actually stored
        if (updated){
          updated = false;
          browserCookies = $browser.cookies();

          for (name in cookies) {
            if (cookies[name] !== browserCookies[name]) {
              //delete or reset all cookies that the browser dropped from $cookies
              if (isUndefined(browserCookies[name])) {
                delete cookies[name];
              } else {
                cookies[name] = browserCookies[name];
              }
              updated = true;
            }
          }
        }
      }
    }]).


  /**
   * @ngdoc service
   * @name $cookieStore
   * @requires $cookies
   *
   * @description
   * Provides a key-value (string-object) storage, that is backed by session cookies.
   * Objects put or retrieved from this storage are automatically serialized or
   * deserialized by angular's toJson/fromJson.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * angular.module('cookieStoreExample', ['ngCookies'])
   *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
   *     // Put cookie
   *     $cookieStore.put('myFavorite','oatmeal');
   *     // Get cookie
   *     var favoriteCookie = $cookieStore.get('myFavorite');
   *     // Removing a cookie
   *     $cookieStore.remove('myFavorite');
   *   }]);
   * ```
   */
   factory('$cookieStore', ['$cookies', function($cookies) {

      return {
        /**
         * @ngdoc method
         * @name $cookieStore#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        get: function(key) {
          var value = $cookies[key];
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookieStore#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         */
        put: function(key, value) {
          $cookies[key] = angular.toJson(value);
        },

        /**
         * @ngdoc method
         * @name $cookieStore#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         */
        remove: function(key) {
          delete $cookies[key];
        }
      };

    }]);


})(window, window.angular);

///#source 1 1 /Scripts/bower_components/angular-route/angular-route.js
/**
 * @license AngularJS v1.3.0-beta.15
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider);

/**
 * @ngdoc provider
 * @name $routeProvider
 * @kind function
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * Note that this example is using {@link ng.directive:script inlined templates}
     * to get it working on jsfiddle as well.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = 'string' == typeof m[i]
              ? decodeURIComponent(m[i])
              : m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              // configure html5 to get links working on jsfiddle
              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if(previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement, function() {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

///#source 1 1 /Scripts/bower_components/angular-elastic/elastic.js
/*
 * angular-elastic v2.3.5
 * (c) 2014 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.elastic', [])

  .constant('msdElasticConfig', {
    append: ''
  })

  .directive('msdElastic', ['$timeout', '$window', 'msdElasticConfig', function($timeout, $window, config) {
    'use strict';

    return {
      require: 'ngModel',
      restrict: 'A, C',
      link: function(scope, element, attrs, ngModel) {

        // cache a reference to the DOM element
        var ta = element[0],
            $ta = element;

        // ensure the element is a textarea, and browser is capable
        if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
          return;
        }

        // set these properties before measuring dimensions
        $ta.css({
          'overflow': 'hidden',
          'overflow-y': 'hidden',
          'word-wrap': 'break-word'
        });

        // force text reflow
        var text = ta.value;
        ta.value = '';
        ta.value = text;

        var appendText = attrs.msdElastic || config.append,
            append = appendText === '\\n' ? '\n' : appendText,
            $win = angular.element($window),
            mirrorStyle = 'position: absolute; top: -999px; right: auto; bottom: auto; left: 0 ;' +
                          'overflow: hidden; -webkit-box-sizing: content-box;' +
                          '-moz-box-sizing: content-box; box-sizing: content-box;' +
                          'min-height: 0 !important; height: 0 !important; padding: 0;' +
                          'word-wrap: break-word; border: 0;',
            $mirror = angular.element('<textarea tabindex="-1" ' +
                                      'style="' + mirrorStyle + '"/>').data('elastic', true),
            mirror = $mirror[0],
            taStyle = getComputedStyle(ta),
            resize = taStyle.getPropertyValue('resize'),
            borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                        taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
            boxOuter = !borderBox ? {width: 0, height: 0} : {
                          width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                                  parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                                  parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                                  parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                          height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                                  parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                                  parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                                  parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                        },
            minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
            heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
            minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
            maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
            mirrored,
            active,
            copyStyle = ['font-family',
                         'font-size',
                         'font-weight',
                         'font-style',
                         'letter-spacing',
                         'line-height',
                         'text-transform',
                         'word-spacing',
                         'text-indent'];

        // exit if elastic already applied (or is the mirror element)
        if ($ta.data('elastic')) {
          return;
        }

        // Opera returns max-height of -1 if not set
        maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

        // append mirror to the DOM
        if (mirror.parentNode !== document.body) {
          angular.element(document.body).append(mirror);
        }

        // set resize and apply elastic
        $ta.css({
          'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
        }).data('elastic', true);

        /*
         * methods
         */

        function initMirror() {
          mirrored = ta;
          // copy the essential styles from the textarea to the mirror
          taStyle = getComputedStyle(ta);
          angular.forEach(copyStyle, function(val) {
            mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
          });
          mirror.setAttribute('style', mirrorStyle);
        }

        function adjust() {
          var taHeight,
              taComputedStyleWidth,
              mirrorHeight,
              width,
              overflow;

          if (mirrored !== ta) {
            initMirror();
          }

          // active flag prevents actions in function from calling adjust again
          if (!active) {
            active = true;

            mirror.value = ta.value + append; // optional whitespace to improve animation
            mirror.style.overflowY = ta.style.overflowY;

            taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

            taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

            // ensure getComputedStyle has returned a readable 'used value' pixel width
            if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
              // update mirror width in case the textarea width has changed
              width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
              mirror.style.width = width + 'px';
            }

            mirrorHeight = mirror.scrollHeight;

            if (mirrorHeight > maxHeight) {
              mirrorHeight = maxHeight;
              overflow = 'scroll';
            } else if (mirrorHeight < minHeight) {
              mirrorHeight = minHeight;
            }
            mirrorHeight += boxOuter.height;

            ta.style.overflowY = overflow || 'hidden';

            if (taHeight !== mirrorHeight) {
              ta.style.height = mirrorHeight + 'px';
              scope.$emit('elastic:resize', $ta);
            }

            // small delay to prevent an infinite loop
            $timeout(function() {
              active = false;
            }, 1);

          }
        }

        function forceAdjust() {
          active = false;
          adjust();
        }

        /*
         * initialise
         */

        // listen
        if ('onpropertychange' in ta && 'oninput' in ta) {
          // IE9
          ta['oninput'] = ta.onkeyup = adjust;
        } else {
          ta['oninput'] = adjust;
        }

        $win.bind('resize', forceAdjust);

        scope.$watch(function() {
          return ngModel.$modelValue;
        }, function(newValue) {
          forceAdjust();
        });

        scope.$on('elastic:adjust', function() {
          forceAdjust();
        });

        $timeout(adjust);

        /*
         * destroy
         */

        scope.$on('$destroy', function() {
          $mirror.remove();
          $win.unbind('resize', forceAdjust);
        });
      }
    };

  }]);

///#source 1 1 /Scripts/angular-translate.js
/**
 * angular-translate - v2.0.1 - 2014-02-25
 * http://github.com/PascalPrecht/angular-translate
 * Copyright (c) 2014 ; Licensed 
 */
angular.module('pascalprecht.translate', ['ng']).run([
  '$translate',
  function ($translate) {
    var key = $translate.storageKey(), storage = $translate.storage();
    if (storage) {
      if (!storage.get(key)) {
        if (angular.isString($translate.preferredLanguage())) {
          $translate.use($translate.preferredLanguage());
        } else {
          storage.set(key, $translate.use());
        }
      } else {
        $translate.use(storage.get(key));
      }
    } else if (angular.isString($translate.preferredLanguage())) {
      $translate.use($translate.preferredLanguage());
    }
  }
]);
angular.module('pascalprecht.translate').provider('$translate', [
  '$STORAGE_KEY',
  function ($STORAGE_KEY) {
    var $translationTable = {}, $preferredLanguage, $availableLanguageKeys = [], $languageKeyAliases, $fallbackLanguage, $fallbackWasString, $uses, $nextLang, $storageFactory, $storageKey = $STORAGE_KEY, $storagePrefix, $missingTranslationHandlerFactory, $interpolationFactory, $interpolatorFactories = [], $interpolationSanitizationStrategy = false, $loaderFactory, $cloakClassName = 'translate-cloak', $loaderOptions, $notFoundIndicatorLeft, $notFoundIndicatorRight, $postCompilingEnabled = false, NESTED_OBJECT_DELIMITER = '.';
    var getLocale = function () {
      var nav = window.navigator;
      return (nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage || '').split('-').join('_');
    };
    var negotiateLocale = function (preferred) {
      var avail = [], locale = angular.lowercase(preferred), i = 0, n = $availableLanguageKeys.length;
      for (; i < n; i++) {
        avail.push(angular.lowercase($availableLanguageKeys[i]));
      }
      if (avail.indexOf(locale) > -1) {
        return locale;
      }
      if ($languageKeyAliases) {
        if ($languageKeyAliases[preferred]) {
          var alias = $languageKeyAliases[preferred];
          if (avail.indexOf(angular.lowercase(alias)) > -1) {
            return alias;
          }
        }
      }
      var parts = preferred.split('_');
      if (parts.length > 1 && avail.indexOf(angular.lowercase(parts[0])) > 1) {
        return parts[0];
      }
    };
    var translations = function (langKey, translationTable) {
      if (!langKey && !translationTable) {
        return $translationTable;
      }
      if (langKey && !translationTable) {
        if (angular.isString(langKey)) {
          return $translationTable[langKey];
        }
      } else {
        if (!angular.isObject($translationTable[langKey])) {
          $translationTable[langKey] = {};
        }
        angular.extend($translationTable[langKey], flatObject(translationTable));
      }
      return this;
    };
    this.translations = translations;
    this.cloakClassName = function (name) {
      if (!name) {
        return $cloakClassName;
      }
      $cloakClassName = name;
      return this;
    };
    var flatObject = function (data, path, result, prevKey) {
      var key, keyWithPath, keyWithShortPath, val;
      if (!path) {
        path = [];
      }
      if (!result) {
        result = {};
      }
      for (key in data) {
        if (!data.hasOwnProperty(key)) {
          continue;
        }
        val = data[key];
        if (angular.isObject(val)) {
          flatObject(val, path.concat(key), result, key);
        } else {
          keyWithPath = path.length ? '' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key : key;
          if (path.length && key === prevKey) {
            keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
            result[keyWithShortPath] = '@:' + keyWithPath;
          }
          result[keyWithPath] = val;
        }
      }
      return result;
    };
    this.addInterpolation = function (factory) {
      $interpolatorFactories.push(factory);
      return this;
    };
    this.useMessageFormatInterpolation = function () {
      return this.useInterpolation('$translateMessageFormatInterpolation');
    };
    this.useInterpolation = function (factory) {
      $interpolationFactory = factory;
      return this;
    };
    this.useSanitizeValueStrategy = function (value) {
      $interpolationSanitizationStrategy = value;
      return this;
    };
    this.preferredLanguage = function (langKey) {
      if (langKey) {
        $preferredLanguage = langKey;
        return this;
      }
      return $preferredLanguage;
    };
    this.translationNotFoundIndicator = function (indicator) {
      this.translationNotFoundIndicatorLeft(indicator);
      this.translationNotFoundIndicatorRight(indicator);
      return this;
    };
    this.translationNotFoundIndicatorLeft = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorLeft;
      }
      $notFoundIndicatorLeft = indicator;
      return this;
    };
    this.translationNotFoundIndicatorRight = function (indicator) {
      if (!indicator) {
        return $notFoundIndicatorRight;
      }
      $notFoundIndicatorRight = indicator;
      return this;
    };
    this.fallbackLanguage = function (langKey) {
      fallbackStack(langKey);
      return this;
    };
    var fallbackStack = function (langKey) {
      if (langKey) {
        if (angular.isString(langKey)) {
          $fallbackWasString = true;
          $fallbackLanguage = [langKey];
        } else if (angular.isArray(langKey)) {
          $fallbackWasString = false;
          $fallbackLanguage = langKey;
        }
        if (angular.isString($preferredLanguage)) {
          $fallbackLanguage.push($preferredLanguage);
        }
        return this;
      } else {
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }
      }
    };
    this.use = function (langKey) {
      if (langKey) {
        if (!$translationTable[langKey] && !$loaderFactory) {
          throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
        }
        $uses = langKey;
        return this;
      }
      return $uses;
    };
    var storageKey = function (key) {
      if (!key) {
        if ($storagePrefix) {
          return $storagePrefix + $storageKey;
        }
        return $storageKey;
      }
      $storageKey = key;
    };
    this.storageKey = storageKey;
    this.useUrlLoader = function (url) {
      return this.useLoader('$translateUrlLoader', { url: url });
    };
    this.useStaticFilesLoader = function (options) {
      return this.useLoader('$translateStaticFilesLoader', options);
    };
    this.useLoader = function (loaderFactory, options) {
      $loaderFactory = loaderFactory;
      $loaderOptions = options || {};
      return this;
    };
    this.useLocalStorage = function () {
      return this.useStorage('$translateLocalStorage');
    };
    this.useCookieStorage = function () {
      return this.useStorage('$translateCookieStorage');
    };
    this.useStorage = function (storageFactory) {
      $storageFactory = storageFactory;
      return this;
    };
    this.storagePrefix = function (prefix) {
      if (!prefix) {
        return prefix;
      }
      $storagePrefix = prefix;
      return this;
    };
    this.useMissingTranslationHandlerLog = function () {
      return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
    };
    this.useMissingTranslationHandler = function (factory) {
      $missingTranslationHandlerFactory = factory;
      return this;
    };
    this.usePostCompiling = function (value) {
      $postCompilingEnabled = !!value;
      return this;
    };
    this.determinePreferredLanguage = function (fn) {
      var locale = fn && angular.isFunction(fn) ? fn() : getLocale();
      if (!$availableLanguageKeys.length) {
        $preferredLanguage = locale;
        return this;
      } else {
        $preferredLanguage = negotiateLocale(locale);
      }
    };
    this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
      if (languageKeys) {
        $availableLanguageKeys = languageKeys;
        if (aliases) {
          $languageKeyAliases = aliases;
        }
        return this;
      }
      return $availableLanguageKeys;
    };
    this.$get = [
      '$log',
      '$injector',
      '$rootScope',
      '$q',
      function ($log, $injector, $rootScope, $q) {
        var Storage, defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'), pendingLoader = false, interpolatorHashMap = {}, langPromises = {}, fallbackIndex, startFallbackIteration;
        var $translate = function (translationId, interpolateParams, interpolationId) {
          var deferred = $q.defer();
          translationId = translationId.trim();
          var promiseToWaitFor = function () {
              var promise = $preferredLanguage ? langPromises[$preferredLanguage] : langPromises[$uses];
              fallbackIndex = 0;
              if ($storageFactory && !promise) {
                var langKey = Storage.get($storageKey);
                promise = langPromises[langKey];
                if ($fallbackLanguage && $fallbackLanguage.length) {
                  var index = indexOf($fallbackLanguage, langKey);
                  fallbackIndex = index > -1 ? index += 1 : 0;
                  $fallbackLanguage.push($preferredLanguage);
                }
              }
              return promise;
            }();
          if (!promiseToWaitFor) {
            determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
          } else {
            promiseToWaitFor.then(function () {
              determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
            }, deferred.reject);
          }
          return deferred.promise;
        };
        var indexOf = function (array, searchElement) {
          for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === searchElement) {
              return i;
            }
          }
          return -1;
        };
        var applyNotFoundIndicators = function (translationId) {
          if ($notFoundIndicatorLeft) {
            translationId = [
              $notFoundIndicatorLeft,
              translationId
            ].join(' ');
          }
          if ($notFoundIndicatorRight) {
            translationId = [
              translationId,
              $notFoundIndicatorRight
            ].join(' ');
          }
          return translationId;
        };
        var useLanguage = function (key) {
          $uses = key;
          $rootScope.$emit('$translateChangeSuccess');
          if ($storageFactory) {
            Storage.set($translate.storageKey(), $uses);
          }
          defaultInterpolator.setLocale($uses);
          angular.forEach(interpolatorHashMap, function (interpolator, id) {
            interpolatorHashMap[id].setLocale($uses);
          });
          $rootScope.$emit('$translateChangeEnd');
        };
        var loadAsync = function (key) {
          if (!key) {
            throw 'No language key specified for loading.';
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateLoadingStart');
          pendingLoader = true;
          $injector.get($loaderFactory)(angular.extend($loaderOptions, { key: key })).then(function (data) {
            var translationTable = {};
            $rootScope.$emit('$translateLoadingSuccess');
            if (angular.isArray(data)) {
              angular.forEach(data, function (table) {
                angular.extend(translationTable, flatObject(table));
              });
            } else {
              angular.extend(translationTable, flatObject(data));
            }
            pendingLoader = false;
            deferred.resolve({
              key: key,
              table: translationTable
            });
            $rootScope.$emit('$translateLoadingEnd');
          }, function (key) {
            $rootScope.$emit('$translateLoadingError');
            deferred.reject(key);
            $rootScope.$emit('$translateLoadingEnd');
          });
          return deferred.promise;
        };
        if ($storageFactory) {
          Storage = $injector.get($storageFactory);
          if (!Storage.get || !Storage.set) {
            throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or set() method!');
          }
        }
        if (angular.isFunction(defaultInterpolator.useSanitizeValueStrategy)) {
          defaultInterpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
        }
        if ($interpolatorFactories.length) {
          angular.forEach($interpolatorFactories, function (interpolatorFactory) {
            var interpolator = $injector.get(interpolatorFactory);
            interpolator.setLocale($preferredLanguage || $uses);
            if (angular.isFunction(interpolator.useSanitizeValueStrategy)) {
              interpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
            }
            interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
          });
        }
        var getTranslationTable = function (langKey) {
          var deferred = $q.defer();
          if ($translationTable.hasOwnProperty(langKey)) {
            deferred.resolve($translationTable[langKey]);
            return deferred.promise;
          } else {
            langPromises[langKey].then(function (data) {
              translations(data.key, data.table);
              deferred.resolve(data.table);
            }, deferred.reject);
          }
          return deferred.promise;
        };
        var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator) {
          var deferred = $q.defer();
          getTranslationTable(langKey).then(function (translationTable) {
            if (translationTable.hasOwnProperty(translationId)) {
              Interpolator.setLocale(langKey);
              deferred.resolve(Interpolator.interpolate(translationTable[translationId], interpolateParams));
              Interpolator.setLocale($uses);
            } else {
              deferred.reject();
            }
          }, deferred.reject);
          return deferred.promise;
        };
        var getFallbackTranslationInstant = function (langKey, translationId, interpolateParams, Interpolator) {
          var result, translationTable = $translationTable[langKey];
          if (translationTable.hasOwnProperty(translationId)) {
            Interpolator.setLocale(langKey);
            result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
            Interpolator.setLocale($uses);
          }
          return result;
        };
        var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
          var deferred = $q.defer();
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(function (translation) {
              deferred.resolve(translation);
            }, function () {
              var nextFallbackLanguagePromise = resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
              deferred.resolve(nextFallbackLanguagePromise);
            });
          } else {
            deferred.resolve(translationId);
          }
          return deferred.promise;
        };
        var resolveForFallbackLanguageInstant = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
          var result;
          if (fallbackLanguageIndex < $fallbackLanguage.length) {
            var langKey = $fallbackLanguage[fallbackLanguageIndex];
            result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
            if (!result) {
              result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
            }
          }
          return result;
        };
        var fallbackTranslation = function (translationId, interpolateParams, Interpolator) {
          return resolveForFallbackLanguage(startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex, translationId, interpolateParams, Interpolator);
        };
        var fallbackTranslationInstant = function (translationId, interpolateParams, Interpolator) {
          return resolveForFallbackLanguageInstant(startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex, translationId, interpolateParams, Interpolator);
        };
        var determineTranslation = function (translationId, interpolateParams, interpolationId) {
          var deferred = $q.defer();
          var table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && table.hasOwnProperty(translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              $translate(translation.substr(2), interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
            } else {
              deferred.resolve(Interpolator.interpolate(translation, interpolateParams));
            }
          } else {
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackTranslation(translationId, interpolateParams, Interpolator).then(function (translation) {
                deferred.resolve(translation);
              }, function (_translationId) {
                deferred.reject(applyNotFoundIndicators(_translationId));
              });
            } else {
              deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
          return deferred.promise;
        };
        var determineTranslationInstant = function (translationId, interpolateParams, interpolationId) {
          var result, table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
          if (table && table.hasOwnProperty(translationId)) {
            var translation = table[translationId];
            if (translation.substr(0, 2) === '@:') {
              result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId);
            } else {
              result = Interpolator.interpolate(translation, interpolateParams);
            }
          } else {
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
            }
            if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
              fallbackIndex = 0;
              result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
            } else {
              result = applyNotFoundIndicators(translationId);
            }
          }
          return result;
        };
        $translate.preferredLanguage = function () {
          return $preferredLanguage;
        };
        $translate.cloakClassName = function () {
          return $cloakClassName;
        };
        $translate.fallbackLanguage = function (langKey) {
          if (langKey !== undefined && langKey !== null) {
            fallbackStack(langKey);
            if ($loaderFactory) {
              if ($fallbackLanguage && $fallbackLanguage.length) {
                for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                  if (!langPromises[$fallbackLanguage[i]]) {
                    langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
                  }
                }
              }
            }
            $translate.use($translate.use());
          }
          if ($fallbackWasString) {
            return $fallbackLanguage[0];
          } else {
            return $fallbackLanguage;
          }
        };
        $translate.useFallbackLanguage = function (langKey) {
          if (langKey !== undefined && langKey !== null) {
            if (!langKey) {
              startFallbackIteration = 0;
            } else {
              var langKeyPosition = indexOf($fallbackLanguage, langKey);
              if (langKeyPosition > -1) {
                startFallbackIteration = langKeyPosition;
              }
            }
          }
        };
        $translate.proposedLanguage = function () {
          return $nextLang;
        };
        $translate.storage = function () {
          return Storage;
        };
        $translate.use = function (key) {
          if (!key) {
            return $uses;
          }
          var deferred = $q.defer();
          $rootScope.$emit('$translateChangeStart');
          if (!$translationTable[key] && $loaderFactory) {
            $nextLang = key;
            langPromises[key] = loadAsync(key).then(function (translation) {
              translations(translation.key, translation.table);
              deferred.resolve(translation.key);
              if ($nextLang === key) {
                useLanguage(translation.key);
                $nextLang = undefined;
              }
            }, function (key) {
              $nextLang = undefined;
              $rootScope.$emit('$translateChangeError');
              deferred.reject(key);
              $rootScope.$emit('$translateChangeEnd');
            });
          } else {
            deferred.resolve(key);
            useLanguage(key);
          }
          return deferred.promise;
        };
        $translate.storageKey = function () {
          return storageKey();
        };
        $translate.isPostCompilingEnabled = function () {
          return $postCompilingEnabled;
        };
        $translate.refresh = function (langKey) {
          if (!$loaderFactory) {
            throw new Error('Couldn\'t refresh translation table, no loader registered!');
          }
          var deferred = $q.defer();
          function resolve() {
            deferred.resolve();
            $rootScope.$emit('$translateRefreshEnd');
          }
          function reject() {
            deferred.reject();
            $rootScope.$emit('$translateRefreshEnd');
          }
          $rootScope.$emit('$translateRefreshStart');
          if (!langKey) {
            var tables = [];
            if ($fallbackLanguage && $fallbackLanguage.length) {
              for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                tables.push(loadAsync($fallbackLanguage[i]));
              }
            }
            if ($uses) {
              tables.push(loadAsync($uses));
            }
            $q.all(tables).then(function (tableData) {
              angular.forEach(tableData, function (data) {
                if ($translationTable[data.key]) {
                  delete $translationTable[data.key];
                }
                translations(data.key, data.table);
              });
              if ($uses) {
                useLanguage($uses);
              }
              resolve();
            });
          } else if ($translationTable[langKey]) {
            loadAsync(langKey).then(function (data) {
              translations(data.key, data.table);
              if (langKey === $uses) {
                useLanguage($uses);
              }
              resolve();
            }, reject);
          } else {
            reject();
          }
          return deferred.promise;
        };
        $translate.instant = function (translationId, interpolateParams, interpolationId) {
          if (typeof translationId === 'undefined' || translationId === '') {
            return translationId;
          }
          translationId = translationId.trim();
          var result, possibleLangKeys = [];
          if ($preferredLanguage) {
            possibleLangKeys.push($preferredLanguage);
          }
          if ($uses) {
            possibleLangKeys.push($uses);
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
          }
          for (var i = 0, c = possibleLangKeys.length; i < c; i++) {
            var possibleLangKey = possibleLangKeys[i];
            if ($translationTable[possibleLangKey]) {
              if ($translationTable[possibleLangKey][translationId]) {
                result = determineTranslationInstant(translationId, interpolateParams, interpolationId);
              }
            }
            if (typeof result !== 'undefined') {
              break;
            }
          }
          if (!result) {
            result = translationId;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
            }
          }
          return result;
        };
        if ($loaderFactory) {
          if (angular.equals($translationTable, {})) {
            $translate.use($translate.use());
          }
          if ($fallbackLanguage && $fallbackLanguage.length) {
            for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
              langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
            }
          }
        }
        return $translate;
      }
    ];
  }
]);
angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', [
  '$interpolate',
  function ($interpolate) {
    var $translateInterpolator = {}, $locale, $identifier = 'default', $sanitizeValueStrategy = null, sanitizeValueStrategies = {
        escaped: function (params) {
          var result = {};
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              result[key] = angular.element('<div></div>').text(params[key]).html();
            }
          }
          return result;
        }
      };
    var sanitizeParams = function (params) {
      var result;
      if (angular.isFunction(sanitizeValueStrategies[$sanitizeValueStrategy])) {
        result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
      } else {
        result = params;
      }
      return result;
    };
    $translateInterpolator.setLocale = function (locale) {
      $locale = locale;
    };
    $translateInterpolator.getInterpolationIdentifier = function () {
      return $identifier;
    };
    $translateInterpolator.useSanitizeValueStrategy = function (value) {
      $sanitizeValueStrategy = value;
      return this;
    };
    $translateInterpolator.interpolate = function (string, interpolateParams) {
      if ($sanitizeValueStrategy) {
        interpolateParams = sanitizeParams(interpolateParams);
      }
      return $interpolate(string)(interpolateParams);
    };
    return $translateInterpolator;
  }
]);
angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');
angular.module('pascalprecht.translate').directive('translate', [
  '$translate',
  '$q',
  '$interpolate',
  '$compile',
  '$parse',
  '$rootScope',
  function ($translate, $q, $interpolate, $compile, $parse, $rootScope) {
    return {
      restrict: 'AE',
      scope: true,
      compile: function (tElement, tAttr) {
        var translateValuesExist = tAttr.translateValues ? tAttr.translateValues : undefined;
        var translateInterpolation = tAttr.translateInterpolation ? tAttr.translateInterpolation : undefined;
        var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);
        return function linkFn(scope, iElement, iAttr) {
          scope.interpolateParams = {};
          iAttr.$observe('translate', function (translationId) {
            if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
              scope.translationId = $interpolate(iElement.text().replace(/^\s+|\s+$/g, ''))(scope.$parent);
            } else {
              scope.translationId = translationId;
            }
          });
          if (translateValuesExist) {
            iAttr.$observe('translateValues', function (interpolateParams) {
              if (interpolateParams) {
                scope.$parent.$watch(function () {
                  angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
                });
              }
            });
          }
          if (translateValueExist) {
            var fn = function (attrName) {
              iAttr.$observe(attrName, function (value) {
                scope.interpolateParams[angular.lowercase(attrName.substr(14))] = value;
              });
            };
            for (var attr in iAttr) {
              if (iAttr.hasOwnProperty(attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                fn(attr);
              }
            }
          }
          var applyElementContent = function (value, scope) {
            iElement.html(value);
            var globallyEnabled = $translate.isPostCompilingEnabled();
            var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
            var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
            if (globallyEnabled && !locallyDefined || locallyEnabled) {
              $compile(iElement.contents())(scope);
            }
          };
          var updateTranslationFn = function () {
              if (!translateValuesExist && !translateValueExist) {
                return function () {
                  var unwatch = scope.$watch('translationId', function (value) {
                      if (scope.translationId && value) {
                        $translate(value, {}, translateInterpolation).then(function (translation) {
                          applyElementContent(translation, scope);
                          unwatch();
                        }, function (translationId) {
                          applyElementContent(translationId, scope);
                          unwatch();
                        });
                      }
                    }, true);
                };
              } else {
                return function () {
                  scope.$watch('interpolateParams', function (value) {
                    if (scope.translationId && value) {
                      $translate(scope.translationId, value, translateInterpolation).then(function (translation) {
                        applyElementContent(translation, scope);
                      }, function (translationId) {
                        applyElementContent(translationId, scope);
                      });
                    }
                  }, true);
                };
              }
            }();
          var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslationFn);
          updateTranslationFn();
          scope.$on('$destroy', unbind);
        };
      }
    };
  }
]);
angular.module('pascalprecht.translate').directive('translateCloak', [
  '$rootScope',
  '$translate',
  function ($rootScope, $translate) {
    return {
      compile: function (tElement) {
        $rootScope.$on('$translateLoadingSuccess', function () {
          tElement.removeClass($translate.cloakClassName());
        });
        tElement.addClass($translate.cloakClassName());
      }
    };
  }
]);
angular.module('pascalprecht.translate').filter('translate', [
  '$parse',
  '$translate',
  function ($parse, $translate) {
    return function (translationId, interpolateParams, interpolation) {
      if (!angular.isObject(interpolateParams)) {
        interpolateParams = $parse(interpolateParams)();
      }
      return $translate.instant(translationId, interpolateParams, interpolation);
    };
  }
]);
///#source 1 1 /Scripts/angular-translate-loader-static-files.js
/*!
 * angular-translate - v2.1.0 - 2014-04-02
 * http://github.com/PascalPrecht/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
angular.module('pascalprecht.translate').factory('$translateStaticFilesLoader', [
  '$q',
  '$http',
  function ($q, $http) {
      return function (options) {
          if (!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
              throw new Error('Couldn\'t load static files, no prefix or suffix specified!');
          }
          var deferred = $q.defer();
          $http({
              url: [
                options.prefix,
                options.key,
                options.suffix
              ].join(''),
              method: 'GET',
              params: ''
          }).success(function (data) {
              deferred.resolve(data);
          }).error(function (data) {
              deferred.reject(options.key);
          });
          return deferred.promise;
      };
  }
]);
///#source 1 1 /Scripts/angular-translate-storage-cookie.js
/*!
 * angular-translate - v2.1.0 - 2014-04-02
 * http://github.com/PascalPrecht/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */

/**
 * @requires $cookieStore
 * This service is used when telling angular-translate to use cookieStore as storage.
 *
 */

angular.module('pascalprecht.translate').factory('$translateCookieStorage', [
  '$cookieStore',
  function ($cookieStore) {
      var $translateCookieStorage = {
          get: function (name) {
              return $cookieStore.get(name);
          },
          set: function (name, value) {
              $cookieStore.put(name, value);
          }
      };
      return $translateCookieStorage;
  }
]);
///#source 1 1 /Scripts/angular-translate-storage-local.js
/*!
 * angular-translate - v2.1.0 - 2014-04-02
 * http://github.com/PascalPrecht/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
angular.module('pascalprecht.translate').factory('$translateLocalStorage', [
  '$window',
  '$translateCookieStorage',
  function ($window, $translateCookieStorage) {
      var localStorageAdapter = {
          get: function (name) {
              return $window.localStorage.getItem(name);
          },
          set: function (name, value) {
              $window.localStorage.setItem(name, value);
          }
      };
      var $translateLocalStorage = 'localStorage' in $window && $window.localStorage !== null ? localStorageAdapter : $translateCookieStorage;
      return $translateLocalStorage;
  }
]);
///#source 1 1 /App/app.js
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
    'ui.bootstrap.tpls' // or add only the related templates: 'template/accordion/accordion-group.html', 'template/accordion/accordion.html',
    

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
            templateUrl: 'App/views/pickOrderCreate.html',
            title: 'Create PickOrder'
        })
        .when('/pickOrders/:id', {
            controller: 'pickOrderController',
            templateUrl: 'App/views/pickOrderEdit.html',
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
            templateUrl: 'App/views/customerCreate.html',
            title: 'Create Customer'
        })
        .when('/customers/:id', {
            controller: 'customerController',
            templateUrl: 'App/views/customerEdit.html',
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



//app.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptor');
//}]);
///#source 1 1 /App/controllers/confirmController.js
// http://blog.rivermoss.com/20140105/confirmation-dialog-using-angular-and-angular-ui-for-bootstrap-part-2/
app.controller('confirmController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    $scope.data = data;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
///#source 1 1 /App/controllers/homeController.js
app.controller('homeController', ['$scope', function ($scope) {
    //alert(22);
}]);
///#source 1 1 /App/controllers/navbarController.js
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
    }, {
    //    'title': 'OptionSets',
    //    'link': '/optionsets'
    //}, {
        'title': 'Attributes',
        'link': '/attributes'
    }, {
        'title': 'AttributeSets',
        'link': '/attributesets'
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

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };

}]);

///#source 1 1 /App/controllers/pickOrdersController.js
app.controller('pickOrdersController', ['$scope', '$location', 'pickOrderService', 'dialogService', function ($scope, $location, pickOrderService, dialogService) {
    $scope.pickOrders = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.pickOrders) {
                if ($scope.pickOrders[i].pickOrderId == item.pickOrderId) break;
            };

            pickOrderService.delete(item.pickOrderId).then(function () {
                $scope.pickOrders.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });
        });
    };

    $scope.create = function () {
        $location.path('/pickOrders/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        pickOrderService.getAll().then(function (data) {
            $scope.pickOrders = data;
        });
    };
}]);
///#source 1 1 /App/controllers/pickOrderController.js
app.controller('pickOrderController', ['$scope', '$window', '$route', 'pickOrderService', 'customerService', '$location', function ($scope, $window, $route, pickOrderService, customerService, $location) {
    $scope.pickOrder = {};
    $scope.customers = [];
    
    getCustomers();
    if ($route.current.title == "PickOrderEdit") {
        init();
    }

    function init() {
        getPickOrder();
        
    }

    function getPickOrder() {
        pickOrderService.getById($route.current.params.id).then(function (data) {
            //$scope.pickOrder = data;
            $scope.pickOrder.pickOrderId = data.pickOrderId;
            $scope.pickOrder.name = data.name;
            $scope.pickOrder.createdOn = data.createdOn;
            $scope.pickOrder.customer = {customerId:data.customerId, name:data.customerName};
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getCustomers() {
        customerService.getAll().then(function (data) {
            $scope.customers = data;
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            var pickOrder = {};
            pickOrder.name = $scope.pickOrder.name;
            pickOrder.createdOn = $scope.pickOrder.createdOn;
            pickOrder.customerId = $scope.pickOrder.customer.customerId;
            pickOrder.customerName = $scope.pickOrder.customer.name;

            //alert(JSON.stringify(pickOrder));
            //return false;

            pickOrderService.create(pickOrder)
                .then(function (data) {
                    $location.path('/pickOrders');
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

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            var pickOrder = {};
            pickOrder.pickOrderId = $scope.pickOrder.pickOrderId;
            pickOrder.name = $scope.pickOrder.name;
            pickOrder.createdOn = $scope.pickOrder.createdOn;
            pickOrder.customerId = $scope.pickOrder.customer.customerId;
            pickOrder.customerName = $scope.pickOrder.customer.name;

            //alert(JSON.stringify(pickOrder));
            pickOrderService.update(pickOrder)
                .then(function (data) {
                    $location.path('/pickOrders');
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
app.controller('productsController', ['$scope', '$location', 'productService', 'dialogService', function ($scope, $location, productService, dialogService) {
    $scope.products = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.products) {
                if ($scope.products[i].id == item.id) break;
            };

            productService.delete(item.id).then(function () {
                $scope.products.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/products/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        productService.getAll().then(function (data) {
            $scope.products = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };
}]);
///#source 1 1 /App/controllers/productController.js
app.controller('productController', ['$scope', '$window', '$route', 'productService', 'attributeSetService', 'optionSetService', '$location', '$q', function ($scope, $window, $route, productService, attributeSetService, optionSetService, $location, $q) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.product = {};
    $scope.attributeSets = [];

    $scope.dotObject = {};
    $scope.dotObject.attributes = {}; // default or selected attribute values
    $scope.dotObject.optionSets = {};

    var promiseToGetProduct, promiseToGetAttributeSets;
    

    // we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    // otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    // and init the model there
    // worth to mention that the model is working properly in the view side {{my-model}}
    // the above mention behavior is due to the fact that a new scope is created within Select element
    // https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    // https://egghead.io/lessons/angularjs-the-dot
    // http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    //$scope.dotObject = {};
    //$scope.dotObject.selectedAttributeSet = {};
    //$scope.dotObject.selectedAttributeSet.attributes = [];

    getAttributeSets();

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit product';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new product';
    }

    function init() {
        getProduct();

        $q.all([promiseToGetProduct, promiseToGetAttributeSets])
        .then(function (result) {
            //// remove already used attributes from the list of available attributes
            //$scope.attributeSet.attributes.forEach(function (attr) {
            //    var idx = getIndexInArray($scope.attributes, attr.attributeId, "attributeId");
            //    if (idx != -1) {
            //        $scope.attributes.splice(idx, 1);
            //    };
            //});

            // set selected AttributeSet
            $scope.dotObject.selectedAttributeSet = getObject($scope.attributeSets, 'id', $scope.product.attributeSetId);

            //$scope.selectedAttributeSet = $scope.attributeSets[0].attributeSetId;

            //getOptionSets();

            // setCurrentValues
            $scope.dotObject.attributes = $scope.product.attributes;

            setCurrentAttributeValues();

        }, function (reason) {
            alert('failure');
        });


    }


    function getProduct() {
        promiseToGetProduct = productService.getById($route.current.params.id).then(function (data) {
            $scope.product = data;
            //$scope.product.attributes = JSON.parse(data.attributes);

            //$scope.selectedAttributeSet = getObject($scope.attributeSets, 'attributeSetId', data.attributeSetId);
            
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributeSets() {
        promiseToGetAttributeSets = attributeSetService.getAll().then(function (data) {
            //data.forEach(function (attributeSet) {
            //    attributeSet.attributes.forEach(function (attribute) {
            //        if (attribute.typeDetails)
            //            attribute.typeDetails = JSON.parse(attribute.typeDetails);
            //    });
            //});

            //alert(JSON.stringify(data, null, 4));

            $scope.attributeSets = data;
            $scope.dotObject.attributeSets = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }



    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // add attributeSet info
            $scope.product.attributeSetId = $scope.dotObject.selectedAttributeSet.id;
            $scope.product.attributeSetName = $scope.dotObject.selectedAttributeSet.name;

            // remove 'unused' attributes (with no value) and add to product
            $scope.product.attributes = [];
            $scope.dotObject.selectedAttributeSet.attributes.forEach(function (node) {

                if (node.value || node.values) {
                    // return just some properties
                    var attr = {};
                    attr.id = node.id;
                    attr.name = node.name;

                    if (node.value) {
                        attr.value = node.value; // Text, SingleOption
                    } else {
                        attr.values = node.values; // MultiOptions
                    };

                    $scope.product.attributes.push(attr);
                };
            });

            // save product
            productService.create($scope.product)
                .then(function (data) {
                    $location.path('/products');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // add attributeSet info
            $scope.product.attributeSetId = $scope.dotObject.selectedAttributeSet.id;
            $scope.product.attributeSetName = $scope.dotObject.selectedAttributeSet.name;

            // remove 'unused' attributes (with no value) and add to product
            $scope.product.attributes = [];
            $scope.dotObject.selectedAttributeSet.attributes.forEach(function (node) {
                if (node.value || node.values) {
                    // return just some properties
                    var attr = {};
                    attr.id = node.id;
                    attr.name = node.name;

                    if (node.value) {
                        attr.value = node.value; // Text, SingleOption
                    } else {
                        attr.values = node.values; // MultiOptions
                    };

                    $scope.product.attributes.push(attr);
                }
            });

            // save product
            productService.update($scope.product)
                .then(function (data) {
                    $location.path('/products');
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

    $scope.changeAttributeSet = function () {
        // reset previous options
        $scope.dotObject.optionSets = {};
        $scope.dotObject.attributes = {};

        // set selected AttributeSet
        //$scope.dotObject.selectedAttributeSet = getObject($scope.attributeSets, 'id', $scope.product.attributeSetId);

        //getOptionSets();
        setDefaultAttributeValues();
    }

    //function getOptionSets() {
    //    // get DDL values for each attribute (for 'optionSet' type only)
    //    $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
    //         if (attr.type == 'OptionSet' || attr.type == 'OptionSet-MultiVal') {
    //            optionSetService.getById(attr.typeDetails.optionSetId).then(function (data) {
    //                $scope.dotObject.optionSets[attr.typeDetails.optionSetId] = JSON.parse(data.options);
    //            })
    //            .catch(function (err) {
    //                alert(JSON.stringify(err, null, 4));
    //            });
    //        }
    //    });
    //}


    function setDefaultAttributeValues() {
        // get DDL values for each attribute (for 'optionSet' type only)
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            if (attr.type == 'SingleOption' || attr.type == 'MultipleOptions') {
                // set default value in DDL
                // TODO - refactor this
                //if (attr.typeDetails.defaultValue) {
                //    //$scope.dotObject.attributes[attr.typeDetails.optionSetId] = attr.typeDetails.defaultValue;
                //    $scope.dotObject.attributes[attr.attributeId] = attr.typeDetails.defaultValue;
                //}

                //if (attr.typeDetails.defaultValues) {
                //    //$scope.dotObject.attributes[attr.typeDetails.optionSetId] = attr.typeDetails.defaultValue;
                //    $scope.dotObject.attributes[attr.attributeId] = attr.typeDetails.defaultValues;
                //}

                attr.value = attr.defaultValue;
            }
        });
    }

    function setCurrentAttributeValues() {
        // get DDL values for each attribute (for 'optionSet' type only)
        $scope.dotObject.selectedAttributeSet.attributes.forEach(function (attr, idx) {
            if (attr.type == 'SingleOption' || attr.type == 'MultipleOptions') {
                // set default value in DDL

                var corespondingProductAttribute = getObject($scope.product.attributes, 'id', attr.id);
                if (corespondingProductAttribute) {
                    if (attr.type == 'MultipleOptions')
                        attr.values = corespondingProductAttribute.values;
                    else
                        attr.value = corespondingProductAttribute.value;
                } else {
                    //attr.value = null;
                }

                //alert(JSON.stringify(attr, null, 4));
                
            }
        });
    }


    // find object in array (objects with one level depth)
    function getObject(data, propertyName, propertyValue) {
        var item = undefined;
        for (i = 0; i < data.length; i++) {
            if (data[i][propertyName] === propertyValue) {
                item = data[i];
                break;
            };
        };
        return item;
    }

}]);
///#source 1 1 /App/controllers/customersController.js
app.controller('customersController', ['$scope', '$location', 'customerService', 'dialogService', function ($scope, $location, customerService, dialogService) {
    $scope.customers = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.customers) {
                if ($scope.customers[i].customerId == item.customerId) break;
            };

            customerService.delete(item.customerId).then(function () {
                $scope.customers.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/customers/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        customerService.getAll().then(function (data) {
            $scope.customers = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };
}]);
///#source 1 1 /App/controllers/customerController.js
app.controller('customerController', ['$scope', '$window', '$route', 'customerService', '$location', function ($scope, $window, $route, customerService, $location) {
    $scope.customer = {};

    if ($route.current.title == "CustomerEdit") {
        init();
    }

    function init() {
        getCustomer();
    }

    function getCustomer() {
        customerService.getById($route.current.params.id).then(function (data) {
            $scope.customer = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.customer));
            customerService.create($scope.customer)
                .then(function (data) {
                    $location.path('/customers');
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

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.customer));
            customerService.update($scope.customer)
                .then(function (data) {
                    $location.path('/customers');
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
///#source 1 1 /App/controllers/optionSetsController.js
app.controller('optionSetsController', ['$scope', '$rootScope', '$route', '$location', 'optionSetService', 'dialogService', function ($scope, $rootScope, $route, $location, optionSetService, dialogService) {
    $scope.optionSets = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.optionSets) {
                if ($scope.optionSets[i].optionSetId == item.optionSetId) break;
            };

            optionSetService.delete(item.optionSetId).then(function () {
                $scope.optionSets.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/optionsets/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        optionSetService.getAll().then(function (data) {
            $scope.optionSets = data;

            //// optional --> convert options from string to object
            //// only if you want to display them  in List view
            //data.forEach(function (item) {
            //    try {
            //        if (item.options == '')
            //            item.options = [];
            //        else
            //            item.options = JSON.parse(item.options)
            //    }
            //    catch (err) {
            //        item.options = [];
            //        alert(err + ' for Options property of entity ' + item.name);
            //    };
            //});
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'OptionSet', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in dublu exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);
///#source 1 1 /App/controllers/optionSetController.js
app.controller('optionSetController', ['$scope', '$window', '$route', 'optionSetService', '$location', function ($scope, $window, $route, optionSetService, $location) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnOptions = false;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.optionSet = {};

    $scope.dotObject={}

    $scope.optionBtnAreVisible = false;

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit optionSet';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new optionSet';
    }

    function init() {
        getOptionSet();
    }

    function getOptionSet() {
        optionSetService.getById($route.current.params.id).then(function (data) {
            $scope.optionSet = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // remove description property if it has no value --> shorter JSON result
            if ($scope.optionSet.options) {
                $scope.optionSet.options.forEach(function (item) {
                    if (item.description == '') delete item.description;
                });
            }

            optionSetService.create($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {

            // remove description property if it has no value --> shorter JSON result
            $scope.optionSet.options.forEach(function (item) {
                if (item.description == '') delete item.description;
            });

            optionSetService.update($scope.optionSet)
                .then(function (data) {
                    $location.path('/optionsets');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
    };

    $scope.cancel = function () {
        $window.history.back();
    }

    $scope.addOptionOnEnter = function (event) {
        if (event.which == 13) { //enter key
            event.preventDefault();
            event.stopPropagation();
            $scope.addOption();
        };
    }

    $scope.addOption = function () {
        if ($scope.newOptionValue) {
            if (!$scope.optionSet.options) $scope.optionSet.options = [];
            $scope.optionSet.options.push({ name: $scope.newOptionValue });
        } else {
            alert("Enter a value and then press the button!");
            return;
        };
        
        $scope.newOptionValue = undefined;
        $scope.isFocusOnOptions = true;

        // remove $$haskKey property from objects
        // met.1 - use angular.copy: --> $scope.optionSet.options = angular.copy($scope.optionSet.options);
        // met.2 - alert(angular.toJson($scope.optionSet.options));
        // met.3 - use 'track by' in ng-repeat (I use that method because it is faster: http://www.codelord.net/2014/04/15/improving-ng-repeat-performance-with-track-by/)
        // and don't have to clean up the object later on

    };

    $scope.removeOption = function (idx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.optionSet.options.splice(idx, 1);
    };

    $scope.optionUp = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var options = $scope.optionSet.options;

        var optionsLength = options.length;

        if (oldIdx > 0) {
            tmp = options[newIdx];
            options[newIdx] = options[oldIdx];
            options[oldIdx] = tmp;
        } else { // oldIndex is first position
            newIdx = optionsLength - 1; // circular list
            tmp = options[oldIdx];

            // move all remaining options one position up
            for (var i = 1; i <= optionsLength; i++) {
                options[i - 1] = options[i];
            };
            options[newIdx] = tmp;
        }
        // options is just another reference to $scope.optionSet.options;
        // so we don't have to switch back (e.g. $scope.optionSet.options = options)
    }

    $scope.optionDown = function (oldIdx, option, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var options = $scope.optionSet.options;

        var optionsLength = options.length;

        if (oldIdx < optionsLength - 1) {
            tmp = options[newIdx];
            options[newIdx] = options[oldIdx];
            options[oldIdx] = tmp;
        } else { // oldIndex is last position
            newIdx = 0; // circular list
            tmp = options[oldIdx];

            // move all remaining options one position down
            for (var i = (optionsLength - 1); i > 0; i--) {
                options[i] = options[i-1];
            };
            options[newIdx] = tmp;
        }
        // options is just another reference to $scope.optionSet.options;
        // so we don't have to switch back (e.g. $scope.optionSet.options = options)
    }

    // helper functions
    // get the index of selected object in array (objects with one level depth, selected by one of its property)
    function getIndex(data, propertyName, propertyValue) {
        var idx = -1;
        for (i = 0; i < data.length; i++) {
            if (data[i][propertyName] === propertyValue) {
                idx = i;
                break;
            };
        };
        return idx;

        // met. 2 (shorter but requires full scan of array; IE > 8)
        //return data.map(function (e) { return e[propertyName]; }).indexOf(propertyValue);
    }

}]);
///#source 1 1 /App/controllers/attributesController.js
app.controller('attributesController', ['$scope', '$rootScope', '$route', '$location', 'attributeService', 'dialogService', function ($scope, $rootScope, $route, $location, attributeService, dialogService) {
    $scope.attributes = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.attributes) {
                if ($scope.attributes[i].id == item.id) break;
            };

            attributeService.delete(item.id).then(function () {
                $scope.attributes.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/attributes/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        attributeService.getAll().then(function (data) {
            $scope.attributes = data;

            // optional --> convert typeDetails from string to object
            // only if you want to display them  in List view
            //data.forEach(function (item) {
            //    try {
            //        if (item.typeDetails == '')
            //            item.typeDetails = [];
            //        else
            //            item.typeDetails = JSON.parse(item.typeDetails)
            //    }
            //    catch (err) {
            //        item.typeDetails = [];
            //        alert(err + ' for Options property of entity ' + item.name);
            //    };
            //});
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'Attribute', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);
///#source 1 1 /App/controllers/attributeController.js
app.controller('attributeController', ['$scope', '$window', '$route', 'attributeService', '$location', function ($scope, $window, $route, attributeService, $location) {

    //// we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    //// otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    //// and init the model there
    //// worth to mention that the model is working properly in the view side {{my-model}}
    //// the above mention behavior is due to the fact that a new scope is created within Select element
    //// https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    //// https://egghead.io/lessons/angularjs-the-dot
    //// http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    $scope.dotObject = {};

    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.attribute = {};

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit attribute';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new attribute';
    }

    function init() {
        getAttribute();
    }


    function getAttribute() {
        attributeService.getById($route.current.params.id).then(function (data) {
            $scope.attribute = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            attributeService.create($scope.attribute)
                .then(function (data) {
                    $location.path('/attributes');
                })
                .catch(function (err) {
                    alert(JSON.stringify(err.data, null, 4));
                });
        }
        else {
            //alert('Invalid form');
        }
    };

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            // remove DefaultValue if the corresponding option has been removed from list
            if ($scope.attribute.type == "SingleOption" && $scope.attribute.options.indexOf($scope.attribute.defaultValue) == -1) {
                $scope.attribute.defaultValue = null;
            }

            if ($scope.attribute.type == "MultipleOptions") {
                $scope.attribute.defaultValues.forEach(function (defaultValue) {
                    if ($scope.attribute.options.indexOf(defaultValue) == -1) {
                        var index = $scope.attribute.defaultValues.indexOf(defaultValue);    // <-- Not supported in <IE9
                        if (index !== -1) {
                            $scope.attribute.defaultValues.splice(index, 1);
                        }
                    }
                });
            };

            attributeService.update($scope.attribute)
                .then(function (data) {
                    $location.path('/attributes');
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
        $window.history.back();
    }

    $scope.changeType = function () {
        // clear previous default value when you switch the type
        $scope.attribute.defaultValue = '';
    }


}]);
///#source 1 1 /App/controllers/attributeSetsController.js
app.controller('attributeSetsController', ['$scope', '$rootScope', '$route', '$location', 'attributeSetService', 'dialogService', function ($scope, $rootScope, $route, $location, attributeSetService, dialogService) {
    $scope.attributeSets = [];
    $scope.errors = {};

    init();

    $scope.delete = function (item) {
        dialogService.confirm('Are you sure you want to delete this item?', item.name).then(function () {

            // get the index for selected item
            var i = 0;
            for (i in $scope.attributeSets) {
                if ($scope.attributeSets[i].id == item.id) break;
            };

            attributeSetService.delete(item.id).then(function () {
                $scope.attributeSets.splice(i, 1);
            })
            .catch(function (err) {
                $scope.errors = JSON.stringify(err.data, null, 4);
                alert($scope.errors);
            });

        });
    };

    $scope.create = function () {
        $location.path('/attributesets/create');
    }

    $scope.refresh = function () {
        init();
    };

    function init() {
        attributeSetService.getAll().then(function (data) {
            $scope.attributeSets = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    };


    // http://stackoverflow.com/a/18856665/2726725
    // daca nu folosesc 'destroy' si pornesc app.pe pagina 'AttributeSet', merg pe alt meniu (ex. 'Products') si revin, 
    // atunci evenimentul se va declansa in continuare "in duble exemplar"
    var cleanUpFunc = $rootScope.$on('$translateChangeSuccess', function () {
        init(); //refresh data using the new translation
    });

    $scope.$on('$destroy', function() {
        cleanUpFunc();
    });

}]);
///#source 1 1 /App/controllers/attributeSetController.js
app.controller('attributeSetController', ['$scope', '$window', '$route', 'attributeService', 'attributeSetService', '$location', '$q', function ($scope, $window, $route, attributeService, attributeSetService, $location, $q) {
    $scope.isEditMode = $route.current.isEditMode;
    $scope.isFocusOnName = $scope.isEditMode ? false : true;

    $scope.attributeSet = {};
    $scope.attributes = [];
    var promiseToGetAttributeSet, promiseToGetAttributes;

    // we need an object (dotObject) to be able to use two-way data binding for ng-models in Select elements
    // otherwise ue need to send the ng-model value of select control as parameter to a ng-change() function
    // and init the model there
    // worth to mention that the model is working properly in the view side {{my-model}}
    // the above mention behavior is due to the fact that a new scope is created within Select element
    // https://groups.google.com/forum/#!topic/angular/7Nd_me5YrHU
    // https://egghead.io/lessons/angularjs-the-dot
    // http://stackoverflow.com/questions/17606936/angularjs-dot-in-ng-model
    $scope.dotObject = {};

    $scope.attributeBtnAreVisible = false;

    getAttributes();

    if ($scope.isEditMode) {
        $scope.pageTitle = 'Edit attributeSet';
        init();
    }
    else { // create mode
        $scope.pageTitle = 'Add new attributeSet';
        $scope.attributeSet.attributes = [];
    }


    function init() {
        getAttributeSet();

        $q.all([promiseToGetAttributeSet, promiseToGetAttributes])
        .then(function (result) {

            // remove already used attributes from the list of available attributes
            $scope.attributeSet.attributes.forEach(function(attr) {
                var idx = getIndexInArray($scope.attributes, attr.id, "id");
                if (idx != -1) {
                    $scope.attributes.splice(idx, 1);
                };
            });
        }, function (reason) {
            alert('failure');
        });
    }

    function getAttributeSet() {
        promiseToGetAttributeSet = attributeSetService.getById($route.current.params.id).then(function (data) {
            $scope.attributeSet = data;
        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    function getAttributes() {
        promiseToGetAttributes = attributeService.getAll().then(function (data) {
            $scope.attributes = data;

            //// optional: loop through the options and set title (for tool-tip on options)
            //// http://sandipchitale.blogspot.ro/2013/03/tip-setting-title-attributes-of-option.html
            //setTimeout(function () {
            //    var options = document.querySelectorAll("#optionSetAttributes option");
            //    if (options) {
            //        for (var i = 1; i < options.length; i++) {
            //            options[i].title = $scope.attributes[i-1].description;
            //        }
            //    }
            //}, 0);

        })
        .catch(function (err) {
            alert(JSON.stringify(err, null, 4));
        });
    }

    $scope.create = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            //alert(JSON.stringify($scope.attributeSet, null, 4));
            attributeSetService.create($scope.attributeSet)
                .then(function (data) {
                    $location.path('/attributesets');
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

    $scope.update = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            attributeSetService.update($scope.attributeSet)
                .then(function (data) {
                    $location.path('/attributesets');
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
        $window.history.back();
    }

    $scope.addAttribute = function () {
        //alert(JSON.stringify($scope.dotObject.selectedAttribute, null, 4));
        if ($scope.dotObject.selectedAttribute) {
            $scope.attributeSet.attributes.push($scope.dotObject.selectedAttribute);
        } else {
            alert("Select from the list and then press the button!");
            return;
        };

        // remove selected attribute from available list
        var idx = getIndexInArray($scope.attributes, $scope.dotObject.selectedAttribute.attributeId, "attributeId");
        if (idx != -1) {
            // alert(attr.name);
            $scope.attributes.splice(idx, 1);
        };

        $scope.dotObject.selectedAttribute = undefined;
    };

    $scope.removeAttribute = function (idx, attribute, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        $scope.attributeSet.attributes.splice(idx, 1);

        // make it available for further selections
        $scope.attributes.push(attribute);
    };

    $scope.attributeUp = function (oldIdx, attribute, e) {
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx - 1, tmp;
        var attributesLength = $scope.attributeSet.attributes.length;

        if (oldIdx > 0) {
            tmp = $scope.attributeSet.attributes[newIdx];
            $scope.attributeSet.attributes[newIdx] = $scope.attributeSet.attributes[oldIdx];
            $scope.attributeSet.attributes[oldIdx] = tmp;
        } else { // oldIndex is first position
            newIdx = attributesLength - 1; // circular list
            tmp = $scope.attributeSet.attributes[oldIdx];

            // move all remaining attributes one position up
            for (var i = 1; i <= attributesLength; i++) {
                $scope.attributeSet.attributes[i - 1] = $scope.attributeSet.attributes[i];
            };
            $scope.attributeSet.attributes[newIdx] = tmp;
        }
    }

    $scope.attributeDown = function (oldIdx, attribute, e) {
        //alert(JSON.stringify(attribute));
        // to not expand the panel at the end of action
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        var newIdx = oldIdx + 1, tmp;
        var attributesLength = $scope.attributeSet.attributes.length;

        if (oldIdx < attributesLength - 1) {
            tmp = $scope.attributeSet.attributes[newIdx];
            $scope.attributeSet.attributes[newIdx] = $scope.attributeSet.attributes[oldIdx];
            $scope.attributeSet.attributes[oldIdx] = tmp;
        } else { // oldIndex is last position
            newIdx = 0; // circular list
            tmp = $scope.attributeSet.attributes[oldIdx];

            // move all remaining attributes one position down
            for (var i = (attributesLength - 1); i > 0; i--) {
                $scope.attributeSet.attributes[i] = $scope.attributeSet.attributes[i-1];
            };
            $scope.attributeSet.attributes[newIdx] = tmp;
        }
    }

    // helper functions
    function getIndexInArray(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }

}]);
///#source 1 1 /App/services/productService.js
app.factory('productService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/products/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/pickOrderService.js
app.factory('pickOrderService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/pickOrders/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/customerService.js
app.factory('customerService', ['$http', function ($http) {

    var factory = {};
    var rootUrl = '/api/customers/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/optionSetService.js
app.factory('optionSetService', ['$http', '$translate', function ($http, $translate) {

    var factory = {};
    var rootUrl = '/api/optionSets/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        return $http.get(rootUrl + '?lang=' + $translate.use()).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/attributeService.js
app.factory('attributeService', ['$http', '$translate', function ($http, $translate) {

    var factory = {};
    var rootUrl = '/api/attributes/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        //return $http.get(rootUrl + '?lang=' + $translate.use()).then(function (result) {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/attributeSetService.js
app.factory('attributeSetService', ['$http', '$translate', function ($http, $translate) {

    var factory = {};
    var rootUrl = '/api/attributeSets/';

    factory.create = function (item) {
        return $http.post(rootUrl, item);
    };

    factory.getAll = function () {
        //return $http.get(rootUrl + '?lang=' + $translate.use()).then(function (result) {
        return $http.get(rootUrl).then(function (result) {
            return result.data;
        });
    };

    factory.getById = function (itemId) {
        return $http.get(rootUrl + encodeURIComponent(itemId)).then(function (result) {
            return result.data;
        });
    };

    factory.update = function (item) {
        return $http.put(rootUrl, item);
    };

    factory.delete = function (itemId) {
        return $http.delete(rootUrl + encodeURIComponent(itemId));
    };


    return factory;
}]);
///#source 1 1 /App/services/dialogService.js
// http://plnkr.co/edit/KnRMGw5Avz2MW3TnzuVT?p=preview
/*  usage

    $dialog.confirm(<message>, <description>, <title>, <yes>, <no>).then(function() {
        // put your main action here
    });

     or

    $dialog.confirm(<message>, <description>, <title>, <yes>, <no>).then(function () {
        // put your main action here
    }, function () {
        // rejected
    });
*/
app.service('dialogService', function ($modal, $rootScope, $q) {

    function createScope(title, message, details) {
        var deferred = $q.defer();
        var scope = $rootScope.$new(true);

        scope.ok = function (value) {
            deferred.resolve(value);
            this.$hide();
        };

        scope.cancel = function () {
            deferred.reject();
            this.$hide();
        };

        scope.title = title;
        scope.message = message || '';
        scope.details = details || '';
        scope.promise = deferred.promise;

        return scope;
    }

    function confirm(message, details, title, yes, no) {
        var scope = createScope(title || 'Confirm', message || 'Are you sure?', details);

        scope.yes = yes || 'Yes';
        scope.no = no || 'No';

        $modal({ template: 'App/views/dialog.confirm.html', scope: scope, show: true });

        return scope.promise;
    }

    function alert(message, details, title, close) {
        var scope = createScope(title || 'Alert', message, details);

        scope.close = close || 'Close';

        $modal({ template: 'App/views/dialog.alert.html', scope: scope, show: true });

        return scope.promise;
    }

    return {
        confirm: confirm,
        alert: alert
    };
})
///#source 1 1 /App/directives/myFocus.js
http://stackoverflow.com/a/17739731/2726725

app.directive('myFocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.myFocus, function (newValue, oldValue) {
                $timeout(function () {
                    if (newValue) { element[0].focus(); }
                }, 0);
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



///#source 1 1 /App/directives/inPlaceEditText.js
// Usage: <ANY in-place-edit-text value="widget.name"> 
app.directive('inPlaceEditText', [function () {
    return {
        restrict: 'A',
        scope: { value: '=' },
        template: '<span class="inplaceedit-child0 active" ng-click="edit()">' +
                        '{{value}}' +
                        '<span class="inplaceedit-icon">&#x270f;</span>' +
                  '</span>' +
                  '<input class="inplaceedit-child1" ng-model="value"></input>',

        link: function ($scope, element, attrs) {
            var spanElement = angular.element(element.children()[0]);
            var inputElement = angular.element(element.children()[1]);

            // ng-click handler to activate edit-in-place
            $scope.edit = function () {
                spanElement.removeClass('active');
                inputElement.addClass('active');

                inputElement[0].focus();
            };

            inputElement.bind('blur', function () {
                spanElement.addClass('active');
                inputElement.removeClass('active');

                if (inputElement.val() == '') {
                    $scope.value = 'New widget'; // Monica's spec.
                };
            });

            element.bind("keydown keypress", function (event) {
                if (event.keyCode === 13) {
                    // alert('enter');
                };
                if (event.keyCode == 27) {
                    // alert('escape');
                };
            });

        }
    };
}]);
///#source 1 1 /App/directives/editableSimpleList.js
// Usage: <editable-simple-list items="attribute.options" />
app.directive('editableSimpleList', [function () {
    return {
        restrict: 'E',
        scope: { items: '=' },
        templateUrl: '/App/templates/editableSimpleList.tpl.html',


        // without this construction Angular throw an "Unknown provider" message when we try to use the $scope variable inside the function
        controller: ['$scope', function ($scope) {

            // initialize variables here
            $scope.dotObject = {};
            $scope.dotObject.modifiedItem = '';

            $scope.items = $scope.items || [];

            $scope.isVisibleAddNewItem = false;

            $scope.isFocusOnAddItem = false;
            $scope.isFocusOnEditItem = false;

            $scope.selectedIndex = -1; //no item selected

            $scope.isItemInEditMode = false;


            $scope.addItem = function () {
                var items = $scope.items;

                if ($scope.newItemValue) {
                    items.push($scope.newItemValue);
                } else {
                    alert("Enter a value and then press the button!");
                    return;
                };

                $scope.newItemValue = undefined;
                $scope.isFocusOnAddItem = true;

                // remove $$haskKey property from objects
                // met.1 - use angular.copy: --> $scope.itemSet.items = angular.copy($scope.itemSet.items);
                // met.2 - alert(angular.toJson($scope.itemSet.items));
                // met.3 - use 'track by' in ng-repeat (I use that method because it is faster: http://www.codelord.net/2014/04/15/improving-ng-repeat-performance-with-track-by/)
                // and don't have to clean up the object later on
            };

            // toggle selection for a given item by name 
            // http://stackoverflow.com/a/14520103/2726725
            $scope.toggleSelection = function toggleSelection(currentIndex) {
                $scope.isVisibleAddNewItem = false;

                if ($scope.selectedIndex == currentIndex)
                    $scope.selectedIndex = -1;
                else
                    $scope.selectedIndex = currentIndex;
            };

            $scope.addItemOnEnter = function (e) {
                if (e.which == 13) { //enter key
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.addItem();
                };
            }

            $scope.updateItemOnEnter = function (idx, item, e) {
                if (e.which == 13) { //enter key
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.updateItem(idx, item, e);
                };
            }


            $scope.editItem = function (idx, item, e) {
                $scope.isItemInEditMode = true;
                $scope.dotObject.modifiedItem = item;
                $scope.isFocusOnEditItem = true;
            };

            $scope.cancelItem = function (idx, item, e) {
                $scope.isItemInEditMode = false;
                $scope.dotObject.modifiedItem = '';
                $scope.isFocusOnEditItem = false;
            };

            $scope.updateItem = function (idx, item, e) {
                $scope.items[idx] = $scope.dotObject.modifiedItem;

                $scope.isItemInEditMode = false;
                $scope.dotObject.modifiedItem = '';
            };

            $scope.removeItem = function (idx, item, e) {
                $scope.items.splice(idx, 1);

                // instead of clear selection, we are selecting the next item in list (allowing so to easy delete multiple records)
                $scope.selectedIndex = idx;
            };

            $scope.itemUp = function () {

                var items = $scope.items;
                var oldIdx = $scope.selectedIndex;
                var newIdx = oldIdx - 1, tmp;

                var itemsLength = items.length;

                if (oldIdx > 0) {
                    tmp = items[newIdx];
                    items[newIdx] = items[oldIdx];
                    items[oldIdx] = tmp;
                } else { // oldIndex correspond to first position
                    newIdx = itemsLength - 1; // circular list
                    tmp = items[oldIdx];

                    // move all remaining items one position up
                    for (var i = 1; i <= itemsLength; i++) {
                        items[i - 1] = items[i];
                    };
                    items[newIdx] = tmp;
                };

                // <items> is just another reference to $scope.items;
                // so we don't have to switch back (e.g. $scope.items = items)

                // update selectedIndex to the new index
                $scope.selectedIndex = newIdx;
            }

            $scope.itemDown = function () {

                var items = $scope.items;
                var oldIdx = $scope.selectedIndex;
                var newIdx = oldIdx + 1, tmp;

                var itemsLength = items.length;

                if (oldIdx < itemsLength - 1) {
                    tmp = items[newIdx];
                    items[newIdx] = items[oldIdx];
                    items[oldIdx] = tmp;
                } else { // oldIndex correspond to last position
                    newIdx = 0; // circular list
                    tmp = items[oldIdx];

                    // move all remaining items one position down
                    for (var i = (itemsLength - 1) ; i > 0; i--) {
                        items[i] = items[i - 1];
                    };
                    items[newIdx] = tmp;
                };

                // <items> is just another reference to $scope.items;
                // so we don't have to switch back (e.g. $scope.items = items)

                // update selectedIndex to the new index
                $scope.selectedIndex = newIdx;
            }
        }],

        //link: function ($scope, element, attrs) {

        //}
    };
}]);
