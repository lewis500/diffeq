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
			scale: '='
			height: '='
			fun: '='
		link: (scope, el, attr, vm)->
			xAxisFun = vm.fun ? (d3.svg.axis()
							.scale vm.scale
							.orient 'bottom')

			sel = d3.select el[0]
				.classed 'x axis', true

			update = ()=>
				xAxisFun.tickSize -vm.height
				sel.call xAxisFun
				
			update()
				
			scope.$watch 'vm.scale.domain()', update , true
			scope.$watch 'vm.height', update , true

			angular.element $window
				.on 'resize', update

module.exports = der