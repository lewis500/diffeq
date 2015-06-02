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
		templateNamespace: 'svg'

module.exports = der