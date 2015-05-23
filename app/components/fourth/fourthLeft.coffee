fourthData = require './fourthData'
_ = require 'lodash'
Ctrl = require '../../models/controller'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='fourthLeft'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' ng-mousemove='vm.mousemove($event)'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' shifter='{{[0,vm.height]}}'></g>
		</g>
		<g class='main' clip-path="url(#fourthLeft)" shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<path class='fun y' line-der watch='vm.watch' data='vm.data' line-fun='vm.lineFun'></path>
			<circle shifter="{{[vm.X(vm.point.t), vm.Y(vm.point.y)]}}" r='4' ></circle>
			<path class='triangle' ng-attr-d='M {{vm.X(vm.point.t)}} {{vm.Y(vm.point.y)}} L {{vm.X(vm.point.t)}} {{vm.Y(vm.point.dy + vm.point.y)}} L {{vm.X(vm.point.t + 1)}} {{vm.Y(vm.point.dy + vm.point.y)}} z'></path>
		</g>
	</svg>
'''

class fourthLeftCtrl extends Ctrl
	constructor: ($scope, $element)->
		super($scope, $element)
		@data = fourthData.data
		@point = fourthData.point

		@lineFun = d3.svg.line()
			.y((d)=> @Y(d.y))
			.x((d)=> @X(d.t))

	watch: (data)-> data.slice(-1).y

	mousemove: (event) =>
		rect = event.toElement.getBoundingClientRect()
		@point = _.findLast fourthData.data, (d)=> (d.t <= @X.invert(event.x - rect.left))
		@scope.$evalAsync()


der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', fourthLeftCtrl]

module.exports = der
