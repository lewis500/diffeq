Data = require './plotData'
angular = require 'angular'
d3 = require 'd3'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()'  width='100%' ng-attr-height='{{vm.svg_height}}'>
		<defs>
			<clippath id='plotB'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='[vm.mar.left, vm.mar.top]'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			<g ver-axis-der width='vm.width' scale='vm.DV' fun='vm.verAxFun'></g>
			<g hor-axis-der height='vm.height' scale='vm.V' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
		</g>
		<g class='main' clip-path="url(#plotB)" shifter='[vm.mar.left, vm.mar.top]'>
			<path ng-attr-d='{{vm.lineFun(vm.Data.dots)}}' class='fun dy'/>
			<g ng-repeat='dot in vm.Data.dots track by dot.id' datum=dot shifter='[vm.V(dot.v),vm.DV(dot.dv)]' dot-der>
			</g>
			<path ng-attr-d='{{vm.lineFun(vm.Data.target_data)}}' class='fun target' />
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 30

		@DV = d3.scale.linear().domain [-4, 0]

		@V = d3.scale.linear().domain [0,4]

		@horAxFun = d3.svg.axis()
			.scale @V
			.ticks 4
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @DV
			# .tickFormat d3.format('.0d')
			# .tickValues @DV.ticks(3)
			.orient 'left'

		@Data = Data

		@lineFun = d3.svg.line()
			.y (d)=> @DV d.dv
			.x (d)=> @V d.v

		angular.element @window
			.on 'resize', @resize

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width * .7
		@DV.range [@height, 0]
		@V.range [0, @width] 
		@scope.$evalAsync()


der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element','$window', Ctrl]

module.exports = der
