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
			height: '='
			tickFormat: '='
		link: (scope, el, attr, vm)->
			xAxisFun = d3.svg.axis()
				.scale vm.scale
				.orient 'bottom'

			sel = d3.select(el[0]).classed('x axis', true)

			if @tickFormat then xAxisFun.tickFormat 'tickFormat'

			update = ()=>
				xAxisFun.tickSize( -vm.height)
				sel.call(xAxisFun)
				
			update()
				
			scope.$watch('vm.scale.domain()', update , true)
			angular.element(window).on('resize', update)

module.exports = der