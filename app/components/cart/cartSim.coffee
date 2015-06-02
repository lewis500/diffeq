_ = require 'lodash'
d3= require 'd3'
{min} = Math
Cart = require './cartData'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height="{{vm.svgHeight}}">
		<defs>
			<clippath id='cartSim'>
				<rect d3-der='{width: vm.width, height: vm.height}' />
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{::[vm.mar.left, vm.mar.top]}}' >
			<rect d3-der='{width: vm.width, height: vm.height}' class='background'/>
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$x$</text>
			</foreignObject>
		</g>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}' clip-path="url(#cartSim)" >
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<g class='g-cart' cart-object-der left='vm.X(vm.Cart.x)' transform='translate(0,25)'></g>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@Cart = Cart
		@mar = 
			left: 30
			right: 10
			top: 10
			bottom: 18
		@X = d3.scale.linear().domain [-.1,3] 

		@axisFun = d3.svg.axis()
			.scale @X
			.ticks 5
			.orient 'bottom'

		angular.element @window
			.on 'resize' , ()=>@resize()

	tran: (tran)->
		tran.ease 'linear'
			.duration 60

	@property 'svgHeight', get:-> @height + @mar.top+@mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = 60
		@X.range([0, @width])
		@scope.$evalAsync()



der = ()->
	directive = 
		template: template
		scope: {}
		restrict: 'A'
		bindToController: true
		templateNamespace: 'svg'
		controller: ['$scope', '$element', '$window', Ctrl]
		controllerAs: 'vm'

module.exports = der
