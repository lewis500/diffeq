_ = require 'lodash'
d3= require 'd3'
{min} = Math
Data = require './plotData'
require '../../helpers'

template = '''
	<md-slider flex min="0" max="5" step='0.1' ng-model="vm.Data.t" aria-label="red" id="red-slider"></md-slider>
	{{vm.Data.t | number: 2}}
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.svg_height}}'>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}'>
			<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' class='background'/>
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<g class='g-cart' shifter='[vm.X(vm.Data.x),0]'>
				<rect class='cart' ng-attr-y='{{vm.height/3}}' ng-attr-x='{{-vm.height/6}}' ng-attr-width='{{vm.height/3}}' ng-attr-height='{{vm.height/3}}'/>
			</g>
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @el, @window)->
		@Data = Data
		@mar = 
			left: 30
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

		@scope.$watch -> 
				Data.maxX
			, (v)=>
				@X.domain [-.25, v+1]

		# @scope.$watch =>
		# 		@X(Data.area)
		# 	, (x)=>
		# 		cart
		# 			.transition()
		# 			.duration 15
		# 			.ease 'linear'
		# 			.attr 'transform', "translate(#{x},0)"

		angular.element @window
			.on 'resize' , ()=>@resize()

	@property 'svg_height' , get:-> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width*.3 - @mar.top - @mar.bottom
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
