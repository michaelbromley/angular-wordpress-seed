function AboutController(MetadataService) {
    var vm = this;

    MetadataService.setMetadata({
        title: 'About This Blog',
        description: 'Some des.'
    });
}

angular
    .module('app')
    .controller('AboutController', AboutController);