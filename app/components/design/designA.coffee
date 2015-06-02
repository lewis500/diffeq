angular = require 'angular'
d3 = require 'd3'
Data = require './designData'
require '../../helpers'
Fake = require './fakeCart'
Real = require './trueCart'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()' class='bottomChart'>
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='"designA"'></g>
		<g class='main' clip-path="url(#designA)" shifter='[vm.mar.left, vm.mar.top]' >
			<rect style='opacity:0' ng-attr-height='{{vm.height}}' ng-attr-width='{{vm.width}}' behavior='vm.drag_rect'></rect>
			<foreignObject width='30' height='30' shifter='[-38, vm.height/2]'>
					<text class='label'>$v$</text>
			</foreignObject>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<line class='zero-line' d3-der='{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}' />
			<line class='zero-line' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />
			<g ng-class='{hide: !vm.Data.show}' >
				<line class='tri v' d3-der='{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}'/>
				<path ng-attr-d='{{vm.triangleData()}}' class='tri' />
				<line d3-der='{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}' class='tri dv' />
			</g>
			<path ng-attr-d='{{vm.lineFun(vm.Data.Cart.trajectory)}}' class='fun target' />
			<path ng-attr-d='{{vm.lineFun(vm.Data.dots)}}' class='fun v' />
			<g ng-repeat='dot in vm.dots track by dot.id' datum=dot shifter='[vm.Hor(dot.t),vm.Ver(dot.v)]' behavior='vm.drag' dot-a-der=dot ></g>
			<circle class='dot small' r='4' shifter='[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]' />
			<foreignObject width='70' height='30' shifter='[vm.Hor(4), vm.Ver(.33)]'>
					<text class='tri-label' >$2e^{-.8t}$</text>
			</foreignObject>
			<circle r='4px'  shifter='[vm.Hor(vm.Data.t), vm.Ver(vm.Fake.v)]' class='point fake'/>
			<circle r='4px'  shifter='[vm.Hor(vm.Data.t), vm.Ver(vm.Real.v)]' class='point real'/>
		</g>
	</svg>
'''

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window)->
		super @scope, @el, @window
		@Ver.domain [-.1,2.1]
		@Hor.domain [-.1,5]
		@Data = Data
		@Fake = Fake
		@Real = Real

		@lineFun
			.y (d)=> @Ver d.v
			.x (d)=> @Hor d.t

		@drag_rect = d3.behavior.drag()
			.on 'dragstart', ()=>
				d3.event.sourceEvent.stopPropagation()
				event.preventDefault()
				if event.which == 3
					return 
				Data.set_show true
				rect = event.toElement.getBoundingClientRect()
				t = @Hor.invert event.x - rect.left
				v  = @Ver.invert event.y - rect.top
				Data.add_dot t , v
				@scope.$evalAsync()
			.on 'drag', => @on_drag @selected
			.on 'dragend',=>
				event.preventDefault()
				Data.set_show true
				event.stopPropagation()

		@drag = d3.behavior.drag()
			.on 'dragstart', (dot)=>
				d3.event.sourceEvent.stopPropagation()
				if event.which == 3
					event.preventDefault()
					Data.remove_dot dot
					Data.set_show false
					@scope.$evalAsync()
			.on 'drag', @on_drag

	@property 'dots', get:-> 
		Data.dots.filter (d)-> (d.id !='first') and (d.id !='last')

	@property 'selected', get:->
		Data.selected


	on_drag: (dot)=> 
			# if event.which is 3
			# 	event.preventDefault()
			# 	return
			Data.update_dot dot, @Hor.invert(d3.event.x), @Ver.invert(d3.event.y)
			@scope.$evalAsync()

	triangleData:->
		point = @selected
		@lineFun [{v: point.v, t: point.t}, {v:point.dv + point.v, t: point.t+1}, {v: point.dv + point.v, t: point.t}]

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
