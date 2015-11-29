d3 = require 'd3'
require '../../helpers'
_ = require 'lodash'
PlotCtrl = require '../../directives/plotCtrl'

template = '''
	<div class='explainer'>
	  <div>
	    <p>Hover to choose a time.</p>
	  </div>
	</div>
	<svg ng-init='vm.resize()' class='topChart' >
		<g boilerplate-der width='vm.width' height='vm.height' ver-ax-fun='vm.verAxFun' hor-ax-fun='vm.horAxFun' ver='vm.Ver' hor='vm.Hor' mar='vm.mar' name='vm.name'>
		</g>
		<g class='main' ng-attr-clip-path='url(#{{vm.name}})' shifter='[vm.mar.left, vm.mar.top]'>
			<foreignObject width='30' height='30' x='-15' y='-20' shifter='[vm.width, vm.Ver(0)]'>
					<text class='label'>$t$</text>
			</foreignObject>
			<path ng-attr-d='{{vm.lineFun(vm.Data.trajectory)}}' class='fun v' />
			<path ng-attr-d='{{vm.triangleData}}' class='tri' />
			<line class='tri dv' d3-der='{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}'/>
			<foreignObject width='30' height='30' shifter='[(vm.Hor(vm.point.t) - 16), vm.sthing]'>
					<text class='tri-label' >$\\dot{y}$</text>
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
		@name = 'derivativeA'
		@Ver.domain [-1.5,1.5]
		@Hor.domain [0,6]
		@lineFun
			# .interpolate 'cardinal'
			.y (d)=> @Ver d.v
			.x (d)=> @Hor d.t

		setTimeout =>
			@Data.play()

	move: =>
		t = @Hor.invert d3.event.x - d3.event.target.getBoundingClientRect().left
		@Data.setT t
		@scope.$evalAsync()

	@property 'sthing', get:->
		@Ver(@point.dv/2 + @point.v) - 7

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
		controller: ['$scope','$element', '$window','derivativeData', Ctrl]

module.exports = der
