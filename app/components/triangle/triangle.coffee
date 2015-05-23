d3 = require 'd3'

template = '''
	<g class='g-triangle' shifter='{{[vm.x,vm.y]}}'>
	</g>
'''


der = ()->
	directive = 
		template: template
		controller: ()->
		bindToController: true
		templateNamespace: 'svg'
		controllerAs: 'vm'
		scope:
			y: '='
			x: '='
			dy: '='
			dx: '='

module.exports = der