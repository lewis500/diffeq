_ = require 'lodash'
Ctrl = require '../../models/controller'
secondData = require './secondData'
angular = require 'angular'
d3 = require 'd3'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='second-right'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' shifter='{{[0,vm.height]}}'></g>
		</g>
		<g class='main' clip-path="url(#second-right)" shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<g ng-repeat='dot in vm.dots track by dot.id' datum='dot' shifter='{{[vm.X(dot.t),vm.Y(dot.dy)]}}'>
				<circle r='4' class='dot dy'></circle>
			</g>
		</g>
	</svg>
'''

class secondRightCtrl extends Ctrl
	constructor: ($scope, $element)->
		super($scope, $element)
		@dots = secondData.dots
		@lineFun = d3.svg.line()
			.y((d)=> @Y(d.dy))
			.x((d)=> @X(d.t))

	watch: (data)-> data.reduce((a,b)-> 
			a + b.t + b.dy
		, 0)

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', secondRightCtrl]

module.exports = der
