_ = require 'lodash'
{exp, sqrt, atan} = Math
Cart = require './cartData'

template = '''
	<md-button ng-click='vm.click()' ng-init='vm.play()'>{{vm.paused ? 'PLAY' : 'PAUSE'}} </md-button>
'''

class Ctrl
	constructor: (@scope)->

	click: ->
		if @paused then @play() else @pause()

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		last = 0
		d3.timer (elapsed)=>
				dt = elapsed - last
				Cart.increment dt/1000
				last = elapsed
				if Cart.t > 4
					Cart.set_t 0
				@scope.$evalAsync()
				@paused
			, 1

	pause: ->
		@paused = true

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		controller: ['$scope', Ctrl]
		template: template

module.exports = der