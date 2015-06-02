_ = require 'lodash'
d3= require 'd3'
{min} = Math
require '../../helpers'
Cart = require './trueCart'
Data = require './designData'

template = '''
	<div cart-der data="vm.Cart" max="vm.max" sample='vm.sample'></div>
'''

class Ctrl
	constructor: (@scope)->
		@Cart = Cart
		@max = 4
		@sample = _.range 0, 6 , .5

der = ->
	directive = 
		template: template
		scope: {}
		restrict: 'A'
		bindToController: true
		templateNamespace: 'svg'
		controller: ['$scope', Ctrl]
		controllerAs: 'vm'

module.exports = der
