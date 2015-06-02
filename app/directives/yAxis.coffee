d3 = require 'd3'
angular = require 'angular'

der = ($window)->
	directive = 
		controller: angular.noop
		controllerAs: 'vm'
		bindToController: true
		restrict: 'A'
		templateNamespace: 'svg'
		scope: 
			width: '='
			fun: '='
		link: (scope, el, attr, vm)->
			scale = vm.fun.scale()

			sel = d3.select(el[0]).classed('y axis', true)

			update = =>
				vm.fun.tickSize( -vm.width)
				sel.call vm.fun

			scope.$watch ->
				# console.log scale.range()
				[scale.domain(), scale.range() ,vm.width]
			, update
			, true

module.exports = der