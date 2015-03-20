function AboutController(MetadataService) {
    var vm = this;

    MetadataService.setMetadata({
        title: 'Michael Bromley - About Me',
        description: 'Web developer.'
    });
}

angular
    .module('app')
    .controller('AboutController', AboutController);