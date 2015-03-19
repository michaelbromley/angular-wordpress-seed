angular.module('app')
    .filter('decodeHtmlCodes', function() {
        /**
         * Convert HTML entities which are encoded as decimals to their equivalent character
         */
        return function(input) {
            if (!input) {
                return "";
            }
            return input.replace(/&#(\d+);/g, function (m, n) {
                return String.fromCharCode(n);
            });
        };
    });
