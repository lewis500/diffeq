d3 = require 'd3'
angular = require 'angular'

der = ($parse)-> #goes on a svg element
	directive = 
		restrict: 'A'
		scope: 
			d3Der: '='
			tran: '='
		link: (scope, el, attr)->
			sel = d3.select el[0]
			u = 't-' + Math.random()
			scope.$watch 'd3Der'
				, (v)->
					if scope.tran
						sel.transition(u)
							.attr v
							.call(scope.tran)
					else
						sel.attr v

				, true
module.exports = der