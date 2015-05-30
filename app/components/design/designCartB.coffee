_ = require 'lodash'
d3= require 'd3'
{min} = Math
Data = require './designData'
require '../../helpers'

template = '''
	<svg ng-init='vm.resize()' width='100%' height='{{vm.svg_height}}'>
		<g shifter='{{::[vm.mar.left, vm.mar.top]}}'>
			<rect width='{{vm.width}}' height='{{vm.height}}' class='background'/>
			<g hor-axis-der height='vm.height' scale='vm.X' fun='vm.axisFun' shifter='[0,vm.height]'></g>
			<foreignObject width='30' height='30' y='20' shifter='[vm.width/2, vm.height]'>
					<text class='label' >$t$</text>
			</foreignObject>
			<g class='g-cart' d3-der='{transform: "translate(" + vm.X(vm.Data.true_x) + ",0)"}' >
				<rect class='cart' x='-12.5' width='25' y='{{vm.height/2-12.5}}' height='25'/>
			</g>
			<g class='g-cart' ng-repeat='asdf in vm.Data.true_sample' d3-der='{transform: "translate(" + vm.X(asdf.x) + ",0)"}' style='opacity:.3;'>
				<rect class='cart' x='-12.5' width='25' y='{{vm.height/2-12.5}}' height='25'/>
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

		@axisFun = d3.svg.axis()
			.scale @X
			.ticks 5
			.orient 'bottom'

		@scope.$watch -> 
				Data.maxX
			, (v)=>
				@X.domain [-.25, v]

		@tran = (tran)->
			tran.ease 'linear'
				.duration 60

		angular.element @window
			.on 'resize' , @resize

	@property 'svg_height' , get:-> @height + @mar.top + @mar.bottom

	resize: ()=>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @width*.1 - @mar.top - @mar.bottom
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
