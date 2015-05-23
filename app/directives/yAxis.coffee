d3 = require 'd3'
angular = require 'angular'

der = ()->
	directive = 
		controller: ()->
		controllerAs: 'vm'
		bindToController: true
		restrict: 'A'
		templateNamespace: 'svg'
		scope: 
			scale: '='
			width: '='
			tickFormat: '='
		link: (scope, el, attr, vm)->
			yAxisFun = d3.svg.axis()
				.scale vm.scale
				.orient 'left'

			sel = d3.select(el[0]).classed('y axis', true)

			if @tickFormat then yAxisFun.tickFormat 'tickFormat'

			update = ()=>
				yAxisFun.tickSize( -vm.width)
				sel.call(yAxisFun)

			update()
				
			scope.$watch('vm.scale.domain()', update , true)
			angular.element(window).on('resize', update)

module.exports = der