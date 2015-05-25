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
		@paused = true
		d3.timer.flush()
		@paused = false
		setTimeout =>
			d3.timer (t)=>
				@cart.move t/1000
				@scope.$evalAsync()
				if (@cart.v < .01) then @paused = true
				if @paused then console.log 'leaving'
				@paused

	pause: ->
		@paused = true

der = ()->
	directive = 
		controllerAs: 'vm'
		# restrict: 'E'
		scope: {}
		controller: ['$scope', Ctrl]
		template: template

module.exports = der