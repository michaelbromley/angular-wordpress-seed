

function HomeMenuController($rootScope, $scope, BlogService, MetadataService) {
    var vm = this;

    vm.featuredPosts = [];
    vm.featuredProjects = [];

    vm.completeTyping = function() {
        vm.typingComplete = true;
        vm.showLinks = true;
    };

    $scope.$watch(function() {
        return $rootScope.isHomePage;
    }, function(val) {
        vm.isExpanded = val;
        if (val) {
            // transitioned to home page
            setMetadata();
            if (vm.featuredPosts.length === 0) {
                loadFeatures();
            }
        } else {
            // on some other page
            vm.showLinks = true;
        }
    });

    function loadFeatures() {
        BlogService.featuredPosts().then(function(posts) {
            vm.featuredPosts = posts;
        });
        BlogService.featuredProjects().then(function(projects) {
            vm.featuredProjects = projects;
        });
    }

    function setMetadata() {
        // pass an empty object to use the defaults.
        MetadataService.setMetadata({});
    }
}

angular
    .module('app')
    .controller('HomeMenuController', HomeMenuController);