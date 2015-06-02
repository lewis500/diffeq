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
			width: '='
			fun: '='
		link: (scope, el, attr, vm)->
			yAxisFun = vm.fun ? d3.svg.axis()
				.scale vm.scale
				.orient 'left'

			sel = d3.select(el[0]).classed('y axis', true)

			update = =>
				yAxisFun.tickSize( -vm.width)
				sel.call(yAxisFun)

			scope.$watchCollection ['scale.domain()','scale.range()','width'], update, true
				


module.exports = der