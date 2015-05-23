_ = require 'lodash'
Ctrl = require '../../models/controller'
secondData = require './secondData'
angular = require 'angular'
d3 = require 'd3'

template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='second-der'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' behavior='vm.drag_rect'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' shifter='{{[0,vm.height]}}'></g>
		</g>
		<g class='main' clip-path="url(#second-der)" shifter='{{[vm.mar.left, vm.mar.top]}}'>
			<path class='fun y' line-der watch='vm.watch' data='vm.dots' line-fun='vm.lineFun'></path>
			<g ng-repeat='dot in vm.dots track by dot.id' datum='dot' shifter='{{[vm.X(dot.t),vm.Y(dot.y)]}}' behavior='vm.drag' dot-der>
			</g>
		</g>
	</svg>
'''

class secondLeftCtrl extends Ctrl
	constructor: ($scope, $element)->
		super($scope, $element)
		@dots = secondData.dots
		@lineFun = d3.svg.line()
			.y((d)=> @Y(d.y))
			.x((d)=> @X(d.t))

		@drag_rect = d3.behavior.drag()
			.on 'dragstart', ()=>
				event.stopPropagation()
				if event.which is 3
					event.preventDefault()
					return
				rect = event.toElement.getBoundingClientRect()
				t = @X.invert(event.x - rect.left)
				y = @Y.invert(event.y - rect.top)
				secondData.add_dot(t,y)
				@scope.$evalAsync()
			.on 'drag', ()=> @on_drag(secondData.selected)

		@drag = d3.behavior.drag()
			.on 'dragstart', (dot)=>
				event.stopPropagation()
				if event.which is 3
					secondData.remove_dot(dot)
					event.preventDefault()
					@scope.$evalAsync()
					return
			.on 'drag', @on_drag

	watch: (data)-> data.reduce((a,b)-> 
			a + b.t + b.y
		, 0)

	on_drag: (dot)=> 
			if event.which is 3
				event.preventDefault()
				return
			secondData.update_dot(dot, @X.invert(d3.event.x), @Y.invert(d3.event.y))
			@scope.$evalAsync()

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		link: (scope, el, attr)->
			d3.selectAll('rect.background')
				.on('contextmenu', ()->
					event.preventDefault()
					false
				)
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', secondLeftCtrl]

module.exports = der
