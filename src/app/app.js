angular.module('app', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination']);

/**
 *
 * @param $stateProvider
 * @param $locationProvider
 * @param $urlRouterProvider
 * @ngInject
 */
function routesConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/",
            views: {
                'main': {
                    templateUrl: 'home/home.tpl.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('blog', {
            url: "/blog",
            views: {
                'main': {
                    templateUrl: 'blog/blog.tpl.html',
                    controller: 'BlogController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('postsByTag', {
            url: "/tag/:tag",
            views: {
                'main': {
                    templateUrl: 'blog/blog.tpl.html',
                    controller: 'BlogController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('postsBySearch', {
            url: "/search/:searchTerm",
            views: {
                'main': {
                    templateUrl: 'blog/blog.tpl.html',
                    controller: 'BlogController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('post', {
            url: '/blog/:id/:title',
            views: {
                'main': {
                    templateUrl: 'blog/post.tpl.html',
                    controller: 'PostController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('about', {
            url: "/about",
            views: {
                'main': {
                    templateUrl: 'about/about.tpl.html',
                    controller: 'AboutController',
                    controllerAs: 'vm'
                }
            }
        });

    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.rule(function ($injector, $location) {
        var slashHashRegex,
            matches,
            path = $location.url();

        // check to see if the path already has a slash where it should be
        if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
            return path.substring(0, path.length - 1);
        }

        // if there is a trailing slash *and* there is a hash, remove the last slash so the route will correctly fire
        slashHashRegex = /\/(#[^\/]*)$/;
        matches = path.match(slashHashRegex);
        if (1 < matches.length) {
            return path.replace(matches[0], matches[1]);
        }
    });
}

var config = {
    // global constant config values live here
    ROOT_URL: '%%ROOT_URL%%',
    API_URL: '%%API_URL%%'
};

function AppController($rootScope, $window, $location, $timeout, MetadataService) {
    var vm = this;

    vm.showMobileMenu = false;

    vm.toggleMobileMenu = function(e) {
        e.preventDefault();
        vm.showMobileMenu = !vm.showMobileMenu;
    };

    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        vm.activeSection = toState.name;
        vm.showMobileMenu = false;
    });

    $rootScope.$watchCollection( function() {
        return MetadataService.getMetadata();
    }, function (meta) {
        if (typeof meta.title !== 'undefined') {
            $rootScope.meta = meta;
            $timeout(function () {
                // push event to google analytics. This is done in a $timeout
                // so the current $digest loop has a chance to actually update the
                // HTML with the correct page title etc. Check for localhost to prevent
                // dev sessions from being recorded in analytics.
                if ($location.host() !== 'localhost') {
                    $window.ga('send', 'pageview', {page: $location.path()});
                }
            });
        }
    });
}

angular
    .module('app')
    .config(routesConfig)
    .constant('config', config)
    .controller('AppController', AppController);