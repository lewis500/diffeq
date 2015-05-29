angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}'>
		<defs>
			<clippath id='reg'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='[vm.mar.left, vm.mar.top]'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' ng-mousemove='vm.move($event)' />
			<g ver-axis-der width='vm.width' scale='vm.V' fun='vm.verAxFun'></g>
			<g hor-axis-der height='vm.height' scale='vm.T' fun='vm.horAxFun' shifter='[0,vm.height]'></g>

			<foreignObject width='30' height='30' y='17' shifter='[vm.width/2, vm.height]'>
				<text class='label' >$t$</text>
			</foreignObject>
		</g>
		<g class='main' clip-path="url(#reg)" shifter='[vm.mar.left, vm.mar.top]'>
			<line class='zero-line hor' ng-class='{"correct": vm.correct}' d3-der='{x1: 0, x2: vm.width, y1: vm.V(0), y2: vm.V(0)}'/>
			<line class='tri v' d3-der='{x1: vm.T(vm.point.t), x2: vm.T(vm.point.t), y1: vm.V(0), y2: vm.V(vm.point.v )}'/>
			<path ng-attr-d='{{vm.lineFun(vm.data)}}' class='fun v' />
			<circle r='3px' shifter='[vm.T(vm.point.t), vm.V(vm.point.v)]' class='point v'/>
			<foreignObject width='30' height='30' shifter='[(vm.T(vm.point.t) - 16), vm.sthing]'>
					<text class='tri-label' font-size='13px'>$y$</text>
			</foreignObject>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 35

		@V = d3.scale.linear().domain [-1,1]
		@T = d3.scale.linear().domain [0,2.5]

		@horAxFun = d3.svg.axis()
			.scale @T
			.tickFormat(d3.format 'd')
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @V
			.ticks 5
			.tickFormat (d)->
				if Math.floor(d) != d then return
				d
			.orient 'left'

		@lineFun = d3.svg.line()
			.y (d)=> @V d.v
			.x (d)=> @T d.t

		vFun = (t)->5* (t-.5) * (t-1) * (t-2)**2

		@data = _.range 0 , 3 , 1/50
			.map (t)->
				res = 
					v: vFun t
					t: t

		@point = _.sample @data

		@correct = false

		angular.element @window
			.on 'resize', @resize

		@move = (event) =>
			rect = event.target.getBoundingClientRect()
			t = @T.invert event.x - rect.left
			v = vFun t
			@point = 
				t: t
				v: v
			@correct = Math.abs(@point.v) <= 0.05 
			@scope.$evalAsync()

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @el[0].parentElement.clientHeight - @mar.left - @mar.right - 10
		@V.range [@height, 0]
		@T.range [0, @width]
		@scope.$evalAsync()

	@property 'sthing', get:->
		@V(@point.v/2) - 7

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
