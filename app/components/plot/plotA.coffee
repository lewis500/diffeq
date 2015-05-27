angular = require 'angular'
d3 = require 'd3'
Data = require './plotData'
require '../../helpers'
template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}'>
		<defs>
			<clippath id='plotA'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='[vm.mar.left, vm.mar.top]'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' behavior='vm.drag_rect'></rect>
			<g ver-axis-der width='vm.width' scale='vm.V' fun='vm.verAxFun'></g>
			<g hor-axis-der height='vm.height' scale='vm.T' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
		</g>
		<g class='main' clip-path="url(#plotA)" shifter='[vm.mar.left, vm.mar.top]'>
			<line class='zero-line' x1='0' ng-attr-x2='{{vm.width}}' ng-attr-y1='{{vm.V(0)}}' ng-attr-y2='{{vm.V(0)}}' />
			<line class='zero-line' y1='0' ng-attr-y2='{{vm.height}}' ng-attr-x1='{{vm.T(0)}}' ng-attr-x2='{{vm.T(0)}}' />
			<g ng-class='{hide: !vm.show}' >
				<path ng-attr-d='{{vm.triangleData()}}' class='tri' />
				<path ng-attr-d='{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}' class='fun dv' />
			</g>
			<path ng-attr-d='{{vm.lineFun(vm.Data.dots)}}' class='fun v'></path>
			<g ng-repeat='dot in vm.Data.dots track by dot.id' datum=dot shifter='[vm.T(dot.t),vm.V(dot.v)]' behavior='vm.drag' dot-der></g>
		</g>
	</svg>
'''
# point = Data.selected

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 30

		@V = d3.scale.linear().domain [-.25,5]

		@T = d3.scale.linear().domain [-.5,6]

		@show = false

		@Data = Data

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

		@drag_rect = d3.behavior.drag()
			.on 'dragstart', ()=>
				@show= true
				event.stopPropagation()
				if event.which is 3
					return event.preventDefault()
				rect = event.toElement.getBoundingClientRect()
				t = @T.invert event.x - rect.left
				v  = @V.invert event.y - rect.top
				Data.add_dot t , v
				@scope.$evalAsync()
			.on 'drag', => @on_drag(Data.selected)
			.on 'dragend', => 
				@show = false
				@scope.$evalAsync()

		@drag = d3.behavior.drag()
			.on 'dragstart', (dot)=>
				@show = true
				event.stopPropagation()
				if event.which is 3
					Data.remove_dot dot
					event.preventDefault()
					@scope.$evalAsync()
			.on 'drag', @on_drag
			.on 'dragend', => 
				@show = false
				@scope.$evalAsync()

		angular.element @window
			.on 'resize', @resize

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	on_drag: (dot)=> 
			if event.which is 3
				event.preventDefault()
				return
			Data.update_dot dot, @T.invert(d3.event.x), @V.invert(d3.event.y)
			@scope.$evalAsync()

	@property 'point', get: -> Data.selected

	triangleData:->
		point = Data.selected
		@lineFun [{v: point.v, t: point.t}, {v:point.dv + point.v, t: point.t+1}, {v: point.dv + point.v, t: point.t}]

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width * .7
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
