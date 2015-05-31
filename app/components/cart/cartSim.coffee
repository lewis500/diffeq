_ = require 'lodash'
d3= require 'd3'
{min} = Math
Cart = require './cartData'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()' width='100%' height='125px'>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' d3-der='{width: vm.width, height: vm.height}' ng-mousemove='vm.move($event)' />
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<g class='g-cart' cart-object-der left='vm.X(vm.Cart.x)'></g>
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

	# @property 'svg_height' , get:-> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @el[0].clientHeight - @mar.top - @mar.bottom
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
