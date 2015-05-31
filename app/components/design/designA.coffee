angular = require 'angular'
d3 = require 'd3'
Data = require './designData'
require '../../helpers'
template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}' >
		<defs>
			<clippath id='plotA'>
				<rect d3-der='{width: vm.width, height: vm.height}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='[vm.mar.left, vm.mar.top]'>
			<rect class='background' d3-der='{width: vm.width, height: vm.height}' behavior='vm.drag_rect' />
			<g ver-axis-der width='vm.width' scale='vm.Ver' fun='vm.verAxFun'></g>
			<g hor-axis-der height='vm.height' scale='vm.Hor' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' shifter='[-31, vm.height/2]'>
					<text class='label'>$v$</text>
			</foreignObject>
			<foreignObject width='30' height='30' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
		</g>
		<g class='main' clip-path="url(#plotA)" shifter='[vm.mar.left, vm.mar.top]' >
			<line class='zero-line' d3-der='{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}' />
			<line class='zero-line' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />
			<g ng-class='{hide: !vm.Data.show}' >
				<line class='tri v' d3-der='{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.v)}'/>
				<path ng-attr-d='{{vm.triangleData()}}' class='tri' />
				<path ng-attr-d='{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}' class='tri dv' />
			</g>
			<path ng-attr-d='{{vm.lineFun(vm.Data.Cart.trajectory)}}' class='fun target' />
			<path ng-attr-d='{{vm.lineFun(vm.Data.dots)}}' class='fun v' />
			<g ng-repeat='dot in vm.dots track by dot.id' datum=dot shifter='[vm.Hor(dot.t),vm.Ver(dot.v)]' behavior='vm.drag' dot-der ></g>
			<circle class='dot small' r='4' shifter='[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]' />
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

		@Ver = d3.scale.linear().domain [-.1,2.1]

		@Hor = d3.scale.linear().domain [-.1,5]

		@Data = Data

		@horAxFun = d3.svg.axis()
			.scale @Hor
			.ticks 5
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @Ver
			.ticks 5
			.orient 'left'
		
		@lineFun = d3.svg.line()
			.y (d)=> @Ver d.v
			.x (d)=> @Hor d.t

		@drag_rect = d3.behavior.drag()
			.on 'dragstart', ()=>
				Data.show= true
				event.stopPropagation()
				if event.which is 3
					return event.preventDefault()
				rect = event.toElement.getBoundingClientRect()
				t = @Hor.invert event.x - rect.left
				v  = @Ver.invert event.y - rect.top
				Data.add_dot t , v
				@scope.$evalAsync()
			.on 'drag', => @on_drag(Data.selected)
			.on 'dragend', => 
				Data.show = false
				@scope.$evalAsync()

		@drag = d3.behavior.drag()
			.on 'dragstart', (dot)=>
				event.stopPropagation()
				event.preventDefault()
				if event.which is 3
					Data.remove_dot dot
					@scope.$evalAsync()
				else
					Data.show = true
			.on 'drag', @on_drag
			.on 'dragend', => 
				# Data.show = false
				@scope.$evalAsync()

		angular.element @window
			.on 'resize', @resize

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	@property 'dots', get:-> 
		res = Data.dots.filter (d)->
			d.id != 'first'

	on_drag: (dot)=> 
			if event.which is 3
				event.preventDefault()
				return
			Data.update_dot dot, @Hor.invert(d3.event.x), @Ver.invert(d3.event.y)
			@scope.$evalAsync()

	@property 'point', get: -> Data.selected

	triangleData:->
		point = Data.selected
		@lineFun [{v: point.v, t: point.t}, {v:point.dv + point.v, t: point.t+1}, {v: point.dv + point.v, t: point.t}]

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width*.6 - @mar.top - @mar.bottom
		@Ver.range [@height, 0]
		@Hor.range [0, @width]
		@scope.$evalAsync()


der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
