angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()' class='topChart'>
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='vm.name'></g>
		<g class='main' ng-attr-clip-path="url(#{{vm.name}})" shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' x='-15' y='-20' shifter='[vm.width, vm.Ver(0)]'>
					<text class='label'>$t$</text>
			</foreignObject>
			<path d3-der='{d:vm.lineFun(vm.Data.trajectory)}' class='fun dv' />
			<line class='tri dv' d3-der='{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}'/>
			<foreignObject width='30' height='30' shifter='[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]'>
					<text class='tri-label'>$\\dot{y}$</text>
			</foreignObject>
			<foreignObject width='100' height='30' shifter='[vm.Hor(.9), vm.Ver(1)]'>
				<text class='tri-label'>$\\cos(t)$</text>
			</foreignObject>
			<circle r='4px'  shifter='[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]' class='point dv'/>
			<rect class='experiment' ng-attr-height='{{vm.height}}' ng-attr-width='{{vm.width}}' />
		</g>
	</svg>
'''

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window, @Data)->
		super @scope, @el, @window
		@Ver.domain [-1.5,1.5]
		@Hor.domain [0,6]
		@name = 'derivativeB'
		@lineFun
			.y (d)=> @Ver d.dv
			.x (d)=> @Hor d.t

	move: =>
		t = @Hor.invert d3.event.x - d3.event.target.getBoundingClientRect().left
		@Data.setT t
		@scope.$evalAsync()

	@property 'point', get:->
		@Data.point

der = ->
	directive = 
		controllerAs: 'vm'
		scope: {}
		link: (scope,el,attr, vm)->
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
		controller: ['$scope','$element', '$window', 'derivativeData', Ctrl]

module.exports = der
