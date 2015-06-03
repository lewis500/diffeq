_ = require 'lodash'
d3= require 'd3'
{min} = Math
require '../../helpers'
# Cart = require './fakeCart'
# Data = require './designData'
Dots = require './designDots'

template = '''
	<div cart-der data="vm.Cart" max="vm.max" sample='vm.sample'></div>
'''

# class Cart
# 	constructor: ->

# 	loc: (t)->


# 	# @property 

class Ctrl
	constructor: (@scope)->
		# @Cart = Cart
		@max = 4
		@sample = _.range 0, 6 , .5
	loc: (t)->


der = ->
	directive = 
		# template: template
		require: '^designData'
		scope: {}
		restrict: 'A'
		bindToController: true
		templateNamespace: 'svg'
		# link: (scope, el, attr, vm, designCtrl)->


		controller: ['$scope', Ctrl]
		controllerAs: 'vm'

module.exports = der
