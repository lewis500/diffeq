angular = require 'angular'
d3 = require 'd3'
Data = require './designData'
require '../../helpers'
template = '''
	<mg-button ng-click='vm.click()'>{{vm.paused ? 'PLAY' : 'PAUSE'}} </md-button>
'''


class Ctrl
	constructor: (@scope, @el, @window)->
		@Data = Data
		@pause()

	click: ->
		if @paused then @play() else @pause()

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		setTimeout =>
			d3.timer (elapsed)=>
				Data.t = elapsed/1000
				@scope.$evalAsync()
				if elapsed > 4000
					@pause()
					setTimeout =>
						@play()
				@paused

	pause: -> @paused = true

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
