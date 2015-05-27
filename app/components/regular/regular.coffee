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
		</g>
		<g class='main' clip-path="url(#reg)" shifter='[vm.mar.left, vm.mar.top]'>
			<line class='zero-line' x1='0' ng-attr-x2='{{vm.width}}' ng-attr-y1='{{vm.V(0)}}' ng-attr-y2='{{vm.V(0)}}' />
			<path ng-attr-d='{{vm.lineFun(vm.data)}}' class='fun v' />
			<circle r='3px' shifter='[vm.T(vm.point.t), vm.V(vm.point.v)]' class='point'/>
		</g>
	</svg>
'''

class regCtrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 25

		@V = d3.scale.linear().domain [-1,1]
		@T = d3.scale.linear().domain [0,3]

		@horAxFun = d3.svg.axis()
			.scale @T
			.tickValues [0,1,2,3]
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @V
			.ticks 5
			.orient 'left'
		
		@lineFun = d3.svg.line()
			.y (d)=> @V d.v
			.x (d)=> @T d.t

		parser = math.parser()
		parser.eval 'v(t) = 5* (t-.5) * (t-1) * (t-2)^2'
		v = parser.get 'v'


		@data = _.range 0 , 3 , 1/50
			.map (t)->
				res = 
					v: v(t)
					t: t

		@point = _.sample @data

		angular.element @window
			.on 'resize', @resize

		@move = (event) =>
			rect = event.target.getBoundingClientRect()
			t = @T.invert (event.x - rect.left)
			@point = 
				t: t
				v: v(t)
			@scope.$evalAsync()

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

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
		controller: ['$scope','$element', '$window', regCtrl]

module.exports = der
