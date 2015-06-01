angular = require 'angular'
d3 = require 'd3'
Data = require './designData'
require '../../helpers'
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
				Data.increment dt/1000
				last = elapsed
				if Data.t > 4
					Data.t = 0
					# setTimeout =>
					# 	@play()
					# true
				@scope.$evalAsync()
				@paused
			, 1

	pause: -> @paused = true

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: template
		templateNamespace: 'svg'
		controller: ['$scope', Ctrl]

module.exports = der
