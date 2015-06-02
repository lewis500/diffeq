Data = require './designData'
angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()'  class='bottomChart'>
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='"designB"'></g>
		<g class='main' clip-path="url(#designB)" shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' shifter='[-38, vm.height/2]'>
					<text class='label'>$\\dot{v}$</text>
			</foreignObject>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label'>$v$</text>
			</foreignObject>
			<line class='zero-line' d3-der='{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}' />
			<line class='zero-line' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />
			<path ng-attr-d='{{vm.lineFun(vm.Data.target_data)}}' class='fun target' />
			<g ng-class='{hide: !vm.Data.show}' >
				<line class='tri v' d3-der='{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}'/>
				<line class='tri dv' d3-der='{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}'/>
				<path d3-der='{d:vm.lineFun(vm.Data.target_data)}' class='fun correct' ng-class='{hide: !vm.Data.correct}' />
			</g>
			<g ng-repeat='dot in vm.dots track by dot.id' shifter='[vm.Hor(dot.v),vm.Ver(dot.dv)]' dot-b-der=dot></g>
			<foreignObject width='70' height='30' y='0' shifter='[vm.Hor(1.7), vm.Ver(-1.2)]'>
					<text class='tri-label' >$v'=-.8v$</text>
			</foreignObject>
		</g>
	</svg>
'''

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window)->
		super @scope, @el, @window

		@Ver.domain [-1.9, .1]
		@Hor.domain [-.1,2.15]

		@Data = Data

		@lineFun
			.y (d)=> @Ver d.dv
			.x (d)=> @Hor d.v

	@property 'dots', get:->
		Data.dots
			.filter (d)-> (d.id !='first') and (d.id !='last')

	@property 'selected', get:->
		Data.selected
		

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element','$window', Ctrl]

module.exports = der
