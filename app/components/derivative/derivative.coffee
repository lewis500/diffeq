angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
math = require 'mathjs'
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
			<line class='zero-line' x1='0' ng-attr-x2='{{vm.width}}' ng-attr-y1='{{vm.V(0)}}' ng-attr-y2='{{vm.V(0)}}' />
			<path ng-attr-d='{{vm.lineFun(vm.data)}}' class='fun v' />
			<path ng-attr-d='{{vm.triangleData()}}' class='tri' />
			<path ng-attr-d='{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}' class='tri fun dv' />
			<path ng-attr-d='{{vm.lineFun([{v: vm.point.dv, t: vm.point.t}, {v: 0, t: vm.point.t}])}}' class='fun dv' style='opacity: .4;'/>
			<path ng-attr-d='{{vm.lineFun2(vm.data)}}' class='fun dv' style='opacity: .3' />
			<circle r='3px'  shifter='[vm.T(vm.point.t), vm.V(vm.point.v)]' class='point'/>
		</g>
	</svg>
'''
			
class triCtrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 35

		@V = d3.scale.linear().domain [-2,2]
		@T = d3.scale.linear().domain [0,8]

		@horAxFun = d3.svg.axis()
			.scale @T
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @V
			.ticks 5
			.orient 'left'

		@lineFun = d3.svg.line()
			.y (d)=> @V d.v
			.x (d)=> @T d.t
		@lineFun2 = d3.svg.line()
			.y (d)=> @V d.dv
			.x (d)=> @T d.t

		parser = math.parser()
		parser.eval 'v(t) = sin(t)'
		parser.eval 'dv(t) = cos(t)'
		v = parser.get 'v'
		dv = parser.get 'dv'

		@data = _.range 0 , 8 , 1/50
			.map (t)->
				res = 
					dv: dv t
					v: v t
					t: t

		@point = _.sample @data

		angular.element @window
			.on 'resize', @resize

		@move = (event) =>
			rect = event.target.getBoundingClientRect()
			t = @T.invert (event.x - rect.left)
			@point = 
				t: t
				v: v t
				dv: dv t
			@scope.$evalAsync()

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	triangleData:->
		@lineFun [{v: @point.v, t: @point.t}, {v:@point.dv + @point.v, t: @point.t+1}, {v: @point.dv + @point.v, t: @point.t}]

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @el[0].parentElement.clientHeight - @mar.left - @mar.right
		@V.range [@height, 0]
		@T.range [0, @width]
		@scope.$evalAsync()

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', triCtrl]

module.exports = der
