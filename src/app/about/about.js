function AboutController(MetadataService, $timeout) {
    var vm = this;

    $timeout(function() {
        var chromata = new Chromata(document.querySelector('.me'), {
            colorMode: 'greyscale',
            key: 'high',
            lineMode: 'square',
            lineWidth: 1,
            origin: ['20% 20%', '20% 99%', '69% 99%', '51% 43%', '73% 45%', '60% 60%'],
            pathFinderCount: 18,
            speed: 2,
            turningAngle: Math.PI/2,
            outputSize: 'container'
        });
        chromata.start();
    }, 1000);

    MetadataService.setMetadata({
        title: 'Michael Bromley - About Me',
        description: 'Web developer.'
    });
}

angular
    .module('app')
    .controller('AboutController', AboutController);