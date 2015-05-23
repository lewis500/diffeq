Cart = require './thirdData'
_ = require 'lodash'

template = '''
	<div flex='column'>
		<div flex>
			<button ng-click='vm.play()'>Play</button>
		</div>
		<div flex layout='row'>
			<div flex third-left-der></div>
			<div flex>right</div>
		</div>
	</div>
'''

class bigCtrl
	constructor: (@scope)->
		@cart = Cart

		@eval_throt = _.throttle(()=>
				@scope.$evalAsync()
		, 100)

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		d3.timer( (t)=>
			@cart.move(t/1000)
			@eval_throt()
			if (@cart.v < .01) then @paused is true
			@paused
		, 10)

der = ()->
	directive = 
		controllerAs: 'vm'
		restrict: 'A'
		scope: {}
		controller: ['$scope', bigCtrl]
		template: template

module.exports = der