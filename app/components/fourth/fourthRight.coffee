d3 = require 'd3'
fourthData = require './fourthData'
Ctrl = require '../../models/controller'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='fourthRight'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{::[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' shifter='{{[0,vm.height]}}'></g>
		</g>
		<g class='main' clip-path="url(#fourthRight)" shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<path class='fun dy' line-der watch='vm.watch' data='vm.data' line-fun='vm.lineFun'></path>
		</g>
	</svg>
'''

class fourthRightCtrl extends Ctrl
	constructor: ($scope, $element)->
		super($scope, $element)
		@data = fourthData.data
		@point = fourthData.point

		@lineFun = d3.svg.line()
			.y((d)=> @Y(d.dy))
			.x((d)=> @X(d.y))

	watch: (data)-> data.slice(-1).dy

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', fourthRightCtrl]

module.exports = der
