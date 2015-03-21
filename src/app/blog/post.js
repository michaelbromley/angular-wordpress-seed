function PostController($stateParams, $anchorScroll, $timeout, $location, BlogService, MetadataService) {
    var vm = this;

    vm.post = {};

    BlogService.post($stateParams.id).then(function(post) {
        vm.post = post;

        MetadataService.setMetadata({
            title: post.title,
            description: post.excerpt
        });
    });
}


angular
    .module('app')
    .controller('PostController', PostController);