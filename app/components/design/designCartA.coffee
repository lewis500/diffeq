_ = require 'lodash'
d3= require 'd3'
{min} = Math
require '../../helpers'
Cart = require './fakeCart'

template = '''
	<svg ng-init='vm.resize()' width='100%' class='cartChart' ng-attr-height='{{::vm.svgHeight}}'>
		<defs>
			<clippath id='dCartA'>
				<rect d3-der='{width: vm.width, height: vm.height}' />
			</clippath>
		</defs>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}'  clip-path="url(#dCartA)" >
			<rect d3-der='{width: vm.width, height: vm.height}' class='background'/>
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<g class='g-cart' ng-repeat='t in vm.sample' d3-der='{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}' style='opacity:.3;'>
				<line class='time-line' d3-der='{x1: 0, x2: 0, y1: 0, y2: 60}' />
			</g>
			<g class='g-cart' cart-object-der left='vm.X(vm.Cart.x)' transform='translate(0,25)'></g>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 10
			right: 10
			top: 0
			bottom: 0
			
		@X = d3.scale.linear().domain [-.1,3] 

		@sample = _.range( 0, 6 , .5)
		console.log @sample

		@Cart = Cart

		@axisFun = d3.svg.axis()
			.scale @X
			.ticks 5
			.orient 'bottom'

		@tran = (tran)->
			tran.ease 'linear'
				.duration 60

		angular.element @window
			.on 'resize' , @resize

	@property 'svgHeight' , get:-> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = 60
		@X.range [0, @width]
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
