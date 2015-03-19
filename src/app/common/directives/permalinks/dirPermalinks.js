/**
 * Directive to make elements permalinkable.
 * @returns {{restrict: string, link: Function}}
 */
function dirPermalink($window) {

    /**
     * Convert a text string to a url-friendly slug
     * From http://stackoverflow.com/a/5782563/772859
     * @returns {string}
     * @param text
     */
    function makeSlug(text) {
        var from,
            to,
            str = text;

        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return '_section-' + str;
    }

    return {
        restrict: 'A',
        compile: function(tElement) {
            var slug = makeSlug(tElement.text());
            tElement.attr('id', slug);
            tElement.addClass('permalink');


            return function(scope, element, attrs) {
                element.on('click', function () {
                    $window.location.hash = slug;
                });
            };
        }
    };
}

angular.module('app')
    .directive('dirPermalink', dirPermalink);