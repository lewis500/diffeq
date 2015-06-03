_ = require 'lodash'
d3= require 'd3'
require '../helpers'
PlotCtrl = require './plotCtrl'

template = '''
	<svg ng-init='vm.resize()' ng-attr-height="{{vm.svgHeight}}">
		<defs>
			<clippath id='cartSim'>
				<rect d3-der='{width: vm.width, height: vm.height}' />
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{::[vm.mar.left, vm.mar.top]}}' >
			<rect d3-der='{width: vm.width, height: vm.height}' class='background'/>
			<g hor-axis-der height='vm.height' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$x$</text>
			</foreignObject>
		</g>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}' clip-path="url(#cartSim)" >
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<g ng-repeat='t in vm.sample' d3-der='{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}'>
				<line class='time-line' d3-der='{x1: 0, x2: 0, y1: 0, y2: vm.height}' />
			</g>
			<g class='g-cart' cart-object-der left='vm.Hor(vm.data.x)' top='vm.height' size='vm.size'></g>
		</g>
	</svg>
'''
			# <rect class='experiment' ng-attr-height='{{vm.height}}' ng-attr-width='{{vm.width}}' />

class Ctrl extends PlotCtrl
	constructor: (@scope, @el, @window)->
		super @scope, @el, @window
		# @mar.left = @mar.right = 10
		@mar.top = 5
		@mar.bottom = 25

		@scope.$watch 'vm.max', =>
			@Hor.domain [-.1, @max]


	@property 'size', get: -> (@Hor(0.4) - @Hor(0))/80

der = ->
	directive = 
		template: template
		scope: 
			data: '='
			max: '='
			sample: '='
		restrict: 'A'
		bindToController: true
		# transclude: true
		templateNamespace: 'svg'
		controller: ['$scope', '$element', '$window', Ctrl]
		controllerAs: 'vm'

module.exports = der
