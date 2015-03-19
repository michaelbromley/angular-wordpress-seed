/**
 * Directive to encapsulate the revealing/auto-hiding search input.
 * @returns {{restrict: string, link: Function}}
 */
function revealingSearchInput($timeout) {

    return {
        restrict: 'E',
        templateUrl: 'common/directives/revealingSearchInput/revealingSearchInput.tpl.html',
        replace: true,
        scope: {
            searchCallback: "&"
        },
        link: function(scope, element) {

            scope.searchButtonClick = function() {
                if (!scope.showSearchInput) {
                    scope.showSearchInput = true;
                    element.find('input')[0].focus();
                } else if (!scope.searchTerm) {
                    scope.showSearchInput = false;
                } else {
                    scope.searchCallback({ term : scope.searchTerm });
                }
            };

            scope.searchInputBlur = function() {
                $timeout(function() {
                    scope.showSearchInput = false;
                }, 100);
            };
        }
    };
}

angular.module('app')
    .directive('revealingSearchInput', revealingSearchInput);