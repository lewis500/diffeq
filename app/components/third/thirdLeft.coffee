Cart = require './thirdData'
Ctrl = require '../../models/controller'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='third-der'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' shifter='{{[0,vm.height]}}'></g>
		</g>
		<g class='main' clip-path="url(#third-der)" shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<path class='fun y' line-der watch='vm.watch' data='vm.cart.trajectory' line-fun='vm.lineFun'></path>
		</g>
	</svg>
'''

class thirdLeftCtrl extends Ctrl
	constructor: (@scope, @element)->
		super(@scope, @element)
		@cart = Cart
		@Y.domain([0,1])
		@lineFun = d3.svg.line()
			.y((d)=> @Y(d.v))
			.x((d)=> @X(d.t))

	watch: (data) -> 
		data.length

der = ()->
	directive = 
		template: template
		scope: {}
		restrict: 'A'
		templateNamespace: 'svg'
		controller: ['$scope', '$element', thirdLeftCtrl]
		controllerAs: 'vm'

module.exports = der
