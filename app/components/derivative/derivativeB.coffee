angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
Data = require './derivativeData'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()' class='topChart'>
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='vm.name'></g>
		<g class='main' ng-attr-clip-path="url(#{{vm.name}})" shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<line class='zero-line hor' d3-der='{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}'/>
			<path d3-der='{d:vm.lineFun(vm.data)}' class='fun dv' />
			<line class='tri dv' d3-der='{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}'/>
			<foreignObject width='30' height='30' shifter='[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]'>
					<text class='tri-label'>$\\dot{y}$</text>
			</foreignObject>
			<foreignObject width='100' height='30' shifter='[vm.Hor(.9), vm.Ver(1)]'>
				<text class='tri-label'>$\\cos(t)$</text>
			</foreignObject>
			<circle r='4px'  shifter='[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]' class='point dv'/>
		</g>
	</svg>
'''
			
class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window)->
		super @scope, @el, @window

		@Ver.domain [-1.5,1.5]
		@Hor.domain [0,6]

		@name = 'derivativeB'

		@data = Data.data

		@lineFun
			.y (d)=> @Ver d.dv
			.x (d)=> @Hor d.t

		@move = (event) =>
			t = @Hor.invert event.x - event.target.getBoundingClientRect().left
			Data.move t
			@scope.$evalAsync()

	@property 'point', get:->
		Data.point

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
