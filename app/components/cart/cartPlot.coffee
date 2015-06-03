angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()' class='topChart' >
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='vm.name'></g>
		<g class='main' ng-attr-clip-path='url(#{{vm.name}})' shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<line class='zero-line hor' d3-der='{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}'/>
			<path ng-attr-d='{{vm.lineFun(vm.Data.trajectory)}}' class='fun v' />
			<line class='tri v' d3-der='{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver(0)}'/>
			<foreignObject width='30' height='30' shifter='[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2)]'>
					<text class='tri-label' >$y$</text>
			</foreignObject>
			<foreignObject width='100' height='30' shifter='[vm.Hor(1.65), vm.Ver(1.38)]'>
				<text class='tri-label'>$\\sin(t)$</text>
			</foreignObject>
			<circle r='3px'  shifter='[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]' class='point v'/>
			<rect class='experiment' ng-attr-height='{{vm.height}}' ng-attr-width='{{vm.width}}' />
		</g>
	</svg>
'''

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window, @Data)->
		super @scope, @el, @window
		@name = 'cartPlot'
		@Ver.domain [0,2]
		@Hor.domain [0,4.5]
		@lineFun
			.y (d)=> @Ver d.v
			.x (d)=> @Hor d.t

		setTimeout =>
			@Data.play()

	move: =>
		t = @Hor.invert event.x - event.target.getBoundingClientRect().left
		@Data.setT t
		@scope.$evalAsync()

	@property 'point', get:->
		@Data.point

	@property 'triangleData', get:->
		@lineFun [{v: @point.v, t: @point.t}, {v:@point.dv + @point.v, t: @point.t+1}, {v: @point.dv + @point.v, t: @point.t}]


der = ->
	directive = 
		controllerAs: 'vm'
		scope: {}
		link: (scope, el, attr, vm)->
			d3.select el[0]
				.select 'rect.background'
				.on 'mouseover',->
					vm.Data.pause()
				.on 'mousemove', ->
					vm.move()
				.on 'mouseout', ->
					vm.Data.play()
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window','cartData', Ctrl]

module.exports = der