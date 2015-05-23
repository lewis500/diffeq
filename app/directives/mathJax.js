angular.module('mathjax', [])
  .directive('mathjax', function() {
    return function(scope, el, attrs, ctrl) {
      scope.$watch(attrs.mathjax, function() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, el[0]]);
      });
    };
  });
