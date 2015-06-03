template = '''
	<defs>
		<clippath ng-attr-id='{{::vm.name}}'>
			<rect ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' />
		</clippath>
	</defs>
	<g class='boilerplate' shifter='{{::[vm.mar.left, vm.mar.top]}}'>
		<rect class='background' ng-attr-width='{{vm.width}}' ng-attr-height='{{vm.height}}' />
		<g ver-axis-der width='vm.width' scale='vm.ver' fun='vm.verAxFun'></g>
		<g hor-axis-der height='vm.height' scale='vm.hor' fun='vm.horAxFun' shifter='[0,vm.height]'></g>
		<line class='zero-line hor' d3-der='{x1: 0, x2: vm.width, y1: vm.ver(0), y2: vm.ver(0)}'/>
		<line class='zero-line hor' d3-der='{x1: vm.hor(0), x2: vm.hor(0), y1:0, y2: vm.height}'/>
		<g ng-transclude>
		</g>
	</g>
'''

der = ->
	directive = 
		controller: ['$scope', (@scope) ->]
		controllerAs: 'vm'
		bindToController: true
		scope: 
			width: '='
			height: '='
			verAxFun: '='
			horAxFun: '='
			mar: '='
			ver: '='
			hor: '='
			name: '='
		template: template
		transclude: true
		templateNamespace: 'svg'

module.exports = der