function PostController($stateParams, $anchorScroll, $timeout, $location, BlogService, MetadataService) {
    var vm = this;

    vm.post = {};
    vm.loaded = false;

    BlogService.post($stateParams.id).then(function(post) {
        vm.post = post;
        vm.loaded = true;
        vm.disqusUrl = post.ID + '/' + post.slug;
        vm.postUrl = $location.absUrl();

        MetadataService.setMetadata({
            title: post.title,
            description: post.excerpt
        });

        $timeout(function() {
            if ($location.hash() !== '') {
                $anchorScroll();
            }
        }, 2000);
    });
}


angular
    .module('app')
    .controller('PostController', PostController);