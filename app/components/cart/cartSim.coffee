_ = require 'lodash'
d3= require 'd3'
{min} = Math
Cart = require './cartData'
require '../../helpers'

# template = ''

# template = '''
# 	<svg ng-init='vm.resize()' width='100%' ng-attr-height="{{vm.svgHeight}}">
# 		<defs>
# 			<clippath id='cartSim'>
# 				<rect d3-der='{width: vm.width, height: vm.height}' />
# 			</clippath>
# 		</defs>
# 		<g class='boilerplate' shifter='{{::[vm.mar.left, vm.mar.top]}}' >
# 			<rect d3-der='{width: vm.width, height: vm.height}' class='background'/>
# 			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
# 			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
# 					<text class='label' >$x$</text>
# 			</foreignObject>
# 		</g>
# 		<g shifter='{{::[vm.mar.left, vm.mar.top]}}' clip-path="url(#cartSim)" >
# 			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
# 					<text class='label' >$t$</text>
# 			</foreignObject>
# 			<g class='g-cart' cart-object-der left='vm.X(vm.Cart.x)' shifter='[0,vm.height]' size='vm.size'></g>
# 		</g>
# 	</svg>
# '''

class Ctrl
	constructor: (@scope, @el, @window)->
		@Cart = Cart
		@max = 4
		@sample = []

der = ()->
	directive = 
		template: '<div cart-der data="vm.Cart" max="vm.max" sample="vm.sample"></div>'
		scope: {}
		restrict: 'A'
		bindToController: true
		# templateNamespace: 'svg'
		controller: ['$scope', '$element', '$window', Ctrl]
		controllerAs: 'vm'

module.exports = der
