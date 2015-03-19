/**
 * Directive that forces focus onto an element when the expression evaluates to true.
 *
 * @param $parse
 * @param $timeout
 * @returns {{link: link}}
 */
function focusOn($parse, $timeout) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusOn);

            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    }, 50);
                }
            });
        }
    };
}

angular
    .module('app')
    .directive('focusOn', focusOn);

/**
 * Directive that forces and element to blur when the expression evaluates to true.
 *
 * @param $parse
 * @param $timeout
 * @returns {{link: link}}
 */
function blurOn($parse, $timeout) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.blurOn);

            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].blur();
                    }, 50);
                }
            });
        }
    };
}

angular
    .module('app')
    .directive('blurOn', blurOn);