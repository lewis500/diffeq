_ = require 'lodash'
{exp, sqrt, atan} = Math
Cart = require './cartData'

template = '''
	<div flex layout='row'>
		<md-button flex class="md-raised" ng-click='vm.play()'>Play</md-button>
		<md-button flex class="md-raised" ng-click='vm.pause()'>Pause</md-button>
	</div>
'''

class Ctrl
	constructor: (@scope)->
		@cart = Cart

	play: ->
		Cart.paused = true
		d3.timer.flush()
		@cart.restart()
		Cart.paused = false
		setTimeout =>
			last = 0
			d3.timer (elapsed)=>
				@cart.increment (elapsed - last)/1000
				last = elapsed
				if (@cart.v < .01) then Cart.paused = true
				@scope.$evalAsync()
				Cart.paused

	pause: ->
		Cart.paused = true

der = ()->
	directive = 
		controllerAs: 'vm'
		# restrict: 'E'
		scope: {}
		controller: ['$scope', Ctrl]
		template: template

module.exports = der