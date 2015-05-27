angular = require 'angular'
d3 = require 'd3'
require '../../helpers'
math = require 'mathjs'
_ = require 'lodash'
template = '''
	<g >
	</g>
'''


der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', regCtrl]

module.exports = der
