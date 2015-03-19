/**
 * Strip HTML tags from a string. Used when displaying content meta tags.
 * @returns {Function}
 */
function stripHtmlTags() {
    return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };
}

angular
    .module('app')
    .filter('stripHtmlTags', stripHtmlTags);