_ = require 'lodash'
{exp, sqrt, atan} = Math

class Cart
	constructor: (@options)->
		{@x0, @v0, @b} = @options
		@restart()
	restart: ->
		# [@x, @v] = [@x0, @v0]
		@trajectory = []
		@move(0)
		# @trajectory = [{t: 0, x: @x0, v: @v0}]
	move: (t)->
		@v = @v0 * exp(-@b * t)
		@x = @x0 + @v0/@b * (1-exp(-@b*t))
		@trajectory.push {t: t, v: @v, x: @x}

template = '''
	<div flex='column'>
		<div flex>
			<button ng-click='vm.play()'>Play</button>
			<button ng-click='vm.pause()'>Pause</button>
		</div>
		<div flex layout='row'>
			<div flex third-left-der cart='vm.cart'></div>
			<div flex>right</div>
		</div>
	</div>
'''

class Ctrl
	constructor: (@scope)->
		@cart = new Cart {x0: 0, v0: .8, b: 1}
		console.log @cart

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		setTimeout =>
			# @cart.restart()
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
		restrict: 'A'
		scope: {}
		controller: ['$scope', Ctrl]
		template: template

module.exports = der