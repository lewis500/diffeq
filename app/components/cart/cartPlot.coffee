_ = require 'lodash'
d3= require 'd3'
{min} = Math
Cart = require './cartData'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}'>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}'>
			<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' class='background'/>
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<g class='g-cart'>
				<rect class='cart' ng-attr-y='{{vm.height/3}}' ng-attr-width='{{vm.height/3}}' ng-attr-height='{{vm.height/3}}'/>
			</g>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@cart = Cart
		@mar = 
			left: 10
			right: 10
			top: 10
			bottom: 18
		@X = d3.scale.linear().domain [-.25,5] 
		sel  = d3.select @el[0]
		cart = sel.select '.g-cart'

		@axisFun = d3.svg.axis()
			.scale @X
			.ticks 5
			.orient 'bottom'

		@scope.$watch 'vm.cart.x', (x)=>
			xPx = @X(x)
			cart
				.transition()
				.duration 15
				.ease 'linear'
				.attr 'transform', "translate(#{xPx},0)"

		angular.element @window
			.on 'resize' , ()=>@resize()

	# @property 

	@property 'svg_height' , get:-> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width*.3 - @mar.top - @mar.bottom
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
