d3 = require 'd3'
angular = require 'angular'

der = ($parse)-> #goes on a svg element
	directive = 
		restrict: 'A'
		link: (scope, el, attr)->
			sel = d3.select el[0]
			scope.$watch ->
					$parse(attr.d3Der)(scope)
				, (v)->
					sel.attr v
				, true

module.exports = der