require '../../helpers'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<svg ng-init='vm.resize()'  class='bottomChart'>
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='"designB"'>
			<foreignObject width='30' height='30' y='5' x='-8' shifter='[vm.width, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<foreignObject width='30' height='30' y='0' x='-15' shifter='[0, 0]'>
					<text class='label' >$v$</text>
			</foreignObject>
		</g>
		<g class='main' clip-path="url(#designB)" shifter='[vm.mar.left, vm.mar.top]'>	
			<path ng-attr-d='{{vm.lineFun(vm.trueCart.trajectory)}}' class='fun target' />
			<g ng-class='{hide: !vm.Data.show}' >
				<line class='tri v' d3-der='{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}'/>
				<line class='tri dv' d3-der='{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}'/>
				<path d3-der='{d:vm.lineFun(vm.trueCart.trajectory)}' class='fun correct' ng-class='{hide: !vm.Data.correct}' />
			</g>
			<g ng-repeat='dot in vm.dots track by dot.id' shifter='[vm.Hor(dot.v),vm.Ver(dot.dv)]' dot-b-der=dot></g>
			<foreignObject width='70' height='30' y='0' shifter='[vm.Hor(.3), vm.Ver(-.1)]'>
					<text class='tri-label' >$v'=-.8v$</text>
			</foreignObject>
			<rect class='experiment' ng-attr-height='{{vm.height}}' ng-attr-width='{{vm.width}}' />
		</g>
	</svg>
'''

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window, @fakeCart, @trueCart, @Data)->
		super @scope, @el, @window

		@Ver.domain [-1.7, .2]
		@Hor.domain [-.1,2.15]

		@lineFun
			.y (d)=> @Ver d.dv
			.x (d)=> @Hor d.v

	@property 'dots', get:->
		@fakeCart.dots.filter (d)-> (d.id !='first') and (d.id !='last')

	@property 'selected', get:-> @fakeCart.selected
		

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', 'fakeCart', 'trueCart', 'designData', Ctrl]

module.exports = der
