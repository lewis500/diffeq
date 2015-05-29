angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
Cart = require './cartData'
template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}'>
		<defs>
			<clippath id='sol'>
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
			<foreignObject width='30' height='30' shifter='[-31, vm.height/2-8]'>
					<text class='label' >$v$</text>
			</foreignObject>
			<line class='zero-line' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> 
			<line class='zero-line' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> 
		</g>
		<g class='main' clip-path="url(#sol)" shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' shifter='[(vm.T(vm.point.t) - 16), vm.sthing]' style='font-size: 13px; font-weight: 100;'>
					<text class='label' font-size='13px'>$v$</text>
			</foreignObject>
			<line class='tri v' d3-der='{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}'/>
			<path ng-attr-d='{{vm.lineFun(vm.data)}}' class='fun v' />
			<circle r='3px' shifter='[vm.T(vm.point.t), vm.V(vm.point.v)]' class='point v'/>
		</g>
	</svg>
'''
				# <path ng-attr-d='{{vm.triangleData()}}' class='tri' />
				# <path ng-attr-d='{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}' class='tri dv' />

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 35

		@V = d3.scale.linear().domain [-.1,5]
		@T = d3.scale.linear().domain [-.1,5]

		@point = Cart

		@horAxFun = d3.svg.axis()
			.scale @T
			.ticks 5
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @V
			.ticks 5
			.orient 'left'
		
		@lineFun = d3.svg.line()
			.y (d)=> @V d.v
			.x (d)=> @T d.t

		vFun = (t)-> 4*Math.exp -t

		@data = _.range 0 , 5 , 1/60
			.map (t)->
				res = 
					v: vFun t
					t: t

		angular.element @window
			.on 'resize', @resize

		@move = (event) =>
			if not Cart.paused then return
			rect = event.target.getBoundingClientRect()
			t = @T.invert event.x - rect.left
			t = Math.max 0 , t
			Cart.set_t t
			@scope.$evalAsync()

	@property 'sthing', get:->
		@V(@point.v/2) - 7

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width*.7 - @mar.left - @mar.right
		@V.range [@height, 0]
		@T.range [0, @width]
		@scope.$evalAsync()

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
