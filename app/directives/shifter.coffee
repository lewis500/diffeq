d3 = require 'd3'

der = ($parse)->
	directive =
		link: (scope, el, attr)->
			reshift = (v)-> 
				d3.select el[0]
					.attr 'transform' , "translate(#{v[0]},#{v[1]})"

			scope.$watch ()->
					$parse(attr.shifter)(scope)
				, reshift
				, true

module.exports = der