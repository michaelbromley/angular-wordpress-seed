function BlogController($anchorScroll, $stateParams, $state, BlogService, MetadataService) {
    var vm = this;
    var apiCallFunction;

    vm.posts = [];
    vm.loaded = false;
    vm.subtitle = '';

    MetadataService.setMetadata({
        title: 'Blog',
        description: 'A collection of articles on some topics.'
    });

    if (typeof $stateParams.tag !== 'undefined') {
        apiCallFunction = BlogService.allPostsByTag($stateParams.tag);
        vm.subtitle = 'tagged with "' + $stateParams.tag + '"';
    } else if (typeof $stateParams.searchTerm !== 'undefined') {
        apiCallFunction = BlogService.allPostsBySearchTerm($stateParams.searchTerm);
        vm.subtitle = 'searching "' + $stateParams.searchTerm + '"';
    } else {
        apiCallFunction = BlogService.allPosts();
    }

    apiCallFunction.then(function(posts) {
        vm.posts = posts;
        vm.loaded = true;
    });

    vm.scrollToTop = function() {
        $anchorScroll();
    };

    vm.search = function(term) {
        $state.go('postsBySearch', { searchTerm: term });
    };
}

angular
    .module('app')
    .controller('BlogController', BlogController);