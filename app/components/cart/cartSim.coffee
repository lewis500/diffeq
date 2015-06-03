_ = require 'lodash'
require '../../helpers'

template = '''
	<div cart-der data="vm.cartData.point" max="vm.max" sample='vm.sample'></div>
'''

class Ctrl
	constructor: (@scope, @cartData)->
		@sample = []
		# @cart = @cartData.point
		@max = 3

	# @property 'max', get:->
	# 	3

der = ->
	directive = 
		scope: {}
		restrict: 'A'
		bindToController: true
		template: template
		controller: ['$scope', 'cartData', Ctrl]
		controllerAs: 'vm'

module.exports = der
