d3 = require 'd3'

der = ($parse)->
	directive =
		restrict: 'A'
		link: (scope, el, attr)->
			sel = d3.select el[0]
			u = 't-' + Math.random()
			tran = $parse(attr.tran)(scope)
			reshift = (v)-> 
				if tran
					sel.transition u
						.attr 'transform' , "translate(#{v[0]},#{v[1]})"
						.call tran
				else
					sel.attr 'transform' , "translate(#{v[0]},#{v[1]})"

				d3.select el[0]
					

			scope.$watch ->
					$parse(attr.shifter)(scope)
				, reshift
				, true

module.exports = der