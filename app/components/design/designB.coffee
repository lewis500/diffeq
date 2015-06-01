Data = require './designData'
angular = require 'angular'
d3 = require 'd3'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()'  width='100%' class='bottomChart'>
		<defs>
			<clippath id='plotB'>
				<rect d3-der='{width: vm.width, height: vm.height}' />
			</clippath>
		</defs>
		<g class='boilerplate' shifter='[vm.mar.left, vm.mar.top]'>
			<rect class='background' d3-der='{width: vm.width, height: vm.height}' />
			<g ver-axis-der width='vm.width' scale='vm.Ver' fun='vm.verAxFun'></g>
			<g hor-axis-der height='vm.height' scale='vm.V' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' shifter='[-31, vm.height/2]'>
					<text class='label'>$\\dot{v}$</text>
			</foreignObject>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$v$</text>
			</foreignObject>
		</g>
		<g class='main' clip-path="url(#plotB)" shifter='[vm.mar.left, vm.mar.top]'>
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

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 10
			right: 20
			bottom: 37

		@Ver = d3.scale.linear().domain [-1.9, .1]

		@Hor = d3.scale.linear().domain [-.1,2.15]

		@horAxFun = d3.svg.axis()
			.scale @Hor
			.ticks 5
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @Ver
			.ticks 5
			.orient 'left'

		@Data = Data

		@lineFun = d3.svg.line()
			.y (d)=> @Ver d.dv
			.x (d)=> @Hor d.v

		angular.element @window
			.on 'resize', @resize

	@property 'dots', get:->
		Data.dots
			.filter (d)-> (d.id !='first') and (d.id !='last')

	@property 'selected', get:->
		Data.selected
		
	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @el[0].clientHeight - @mar.top - @mar.bottom
		@Ver.range [@height, 0]
		@Hor.range [0, @width] 
		@scope.$evalAsync()


der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element','$window', Ctrl]

module.exports = der
