d3 = require 'd3'

der = ($parse)->
	directive = 
		templateNamespace: 'svg'
		link: (scope, el, attr)->
			reshift = (newVal)-> d3.select(el[0]).attr 'transform', 'translate(' + newVal + ')'

			scope.$watch(()->
				$parse(attr.shifter)()
			, reshift, true)

module.exports = der