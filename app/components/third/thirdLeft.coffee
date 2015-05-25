template = '''
	<svg ng-init='vm.resize()' width='100%' ng-attr-height='{{vm.height + vm.mar.top + vm.mar.bottom}}'>
		<defs>
			<clippath id='third-der'>
				<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			</clippath>
		</defs>
		<g class='boilerplate' ng-attr-transform='translate({{::vm.mar.left}}, {{::vm.mar.top}})'>
			<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}'></rect>
			<g y-axis-der scale='vm.Y' width='vm.width'></g>
			<g ex-axis-der scale='vm.X' height='vm.height' ng-attr-transform='translate(0, {{vm.height}})'></g>
		</g>
		<g class='main' clip-path="url(#third-der)" ng-attr-transform='translate({{::vm.mar.left}}, {{::vm.mar.top}})'>
			<path class='fun y' />
		</g>
	</svg>
'''

class Ctrl
	constructor: (@scope, @element, @window)->
		@Y = d3.scale.linear().domain [0,1]
		@X = d3.scale.linear().domain [0,8] 
		@mar = 
			left: 30
			top: 20
			right: 10
			bottom: 30

		angular.element @window
			.on 'resize', @resize

		lineFun = d3.svg.line()
			.y (d)=> @Y d.v
			.x (d)=> @X d.t

		line = d3.select @element[0]
			.select 'path.fun.y'
			.datum @cart.trajectory

		@scope.$watch =>
				@cart.trajectory.length
			, =>
				console.log 'hello'
				line.attr 'd', null
					.transition()
					.attr 'd', lineFun

	resize: ()=>
		@width = @element[0].clientWidth - @mar.left - @mar.right
		@height = @width * .7
		@Y.range [@height , 0]
		@X.range [0 , @width] 
		@scope.$evalAsync()

der = ()->
	directive = 
		template: template
		scope: 
			cart: '='
		restrict: 'A'
		bindToController: true
		templateNamespace: 'svg'
		controller: ['$scope', '$element', '$window', Ctrl]
		controllerAs: 'vm'

module.exports = der
