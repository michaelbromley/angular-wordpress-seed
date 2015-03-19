function ContactController($http, $timeout, MetadataService) {
    var vm = this;

    MetadataService.setMetadata({
        title: 'Michael Bromley - Get In Touch',
        description: 'Email me ok?'
    });

    vm.emailAddressSubmit = function(e) {
        if(e.which === 13) {
            vm.emailFilledOut = true;
        }
    };

    vm.emailFormSubmit = function() {
        vm.sending = true;

        var postData = {
            email: vm.emailAddress,
            message: vm.message
        };

        var promise = $http.post('assets/scripts/xhr-contact-form.php', postData);
        promise.then(function(response) {
            vm.sending = false;
            if (response.data === "1") {
                success();
            } else {
                error();
            }
        });
    };

    function success() {
        vm.success = true;
        $timeout(function() {
            vm.showAck = true;
        }, 1000);
    }

    function error() {
        vm.error = true;
        $timeout(function() {
            vm.showAck = true;
        }, 1000);
    }

}

angular
    .module('app')
    .controller('ContactController', ContactController);