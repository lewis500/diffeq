_ = require 'lodash'
require '../../helpers'

template = '''
	<div cart-der data="vm.trueCart" max="vm.max" sample='vm.sample'></div>
'''

class Ctrl
	constructor: (@scope, @trueCart)->
		@max = 4
		@sample = _.range 0, 5 , .5

	@property 'max', get:->
		@trueCart.loc 4.5

der = ->
	directive = 
		scope: {}
		restrict: 'A'
		bindToController: true
		template: template
		controller: ['$scope', 'trueCart', Ctrl]
		controllerAs: 'vm'

module.exports = der
