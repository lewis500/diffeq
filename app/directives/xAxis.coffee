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
			height: '='
			fun: '='
		link: (scope, el, attr, vm)->
			scale = vm.fun.scale()

			sel = d3.select el[0]
				.classed 'x axis', true

			update = =>
				vm.fun.tickSize -vm.height
				sel.call vm.fun
				
			scope.$watch ->
				[scale.domain(), scale.range() ,vm.height]
			, update
			, true


module.exports = der