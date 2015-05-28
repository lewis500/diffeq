Data = require './designData'
angular = require 'angular'
d3 = require 'd3'
require '../../helpers'

template = '''
	<h3>Plot B</h3>
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
			<foreignObject width='30' height='30' shifter='[-31, vm.height/2]'>
					<text class='label'>$\\dot{v}$</text>
			</foreignObject>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$v$</text>
			</foreignObject>
		</g>
		<g class='main' clip-path="url(#plotB)" shifter='[vm.mar.left, vm.mar.top]'>
			<line class='zero-line' d3-der='{x1: 0, x2: vm.width, y1: vm.DV(0), y2: vm.DV(0)}' />
			<line class='zero-line' d3-der="{x1: vm.V(0), x2: vm.V(0), y1: vm.height, y2: 0}" />
			<path ng-attr-d='{{vm.lineFun(vm.Data.target_data)}}' class='fun target' />
			<g ng-class='{hide: !vm.Data.show}' >
				<line class='tri v' d3-der='{x1: vm.V(0), x2: vm.V(vm.point.v), y1: vm.DV(vm.point.dv), y2: vm.DV(vm.point.dv)}'/>
				<line class='tri dv' d3-der='{x1: vm.V(vm.point.v), x2: vm.V(vm.point.v), y1: vm.DV(0), y2: vm.DV(vm.point.dv)}'/>
				<path ng-attr-d='{{vm.lineFun(vm.Data.target_data)}}' class='fun correct' ng-class='{hide: !vm.Data.correct}' />
			</g>
			<g ng-repeat='dot in vm.dots track by dot.id' shifter='[vm.V(dot.v),vm.DV(dot.dv)]' dot-b-der></g>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 10
			right: 20
			bottom: 37

		@DV = d3.scale.linear().domain [-5, .25]

		@V = d3.scale.linear().domain [-.25,4]

		@horAxFun = d3.svg.axis()
			.scale @V
			.ticks 4
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @DV
			.ticks 5
			.orient 'left'

		@Data = Data

		@lineFun = d3.svg.line()
			.y (d)=> @DV d.dv
			.x (d)=> @V d.v

		angular.element @window
			.on 'resize', @resize

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	@property 'dots', get:->
		Data.dots
			.filter (d)-> d.id !='first'

	hilite: (v)->
		d3.select this
			.transition()
			.duration 100
			.ease 'cubic'
			.attr 'r' , if v then 6 else 4

	@property 'point', get: -> Data.selected

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width
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
