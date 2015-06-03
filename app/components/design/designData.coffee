angular = require 'angular'
d3 = require 'd3'
require '../../helpers'

class Service
	constructor: (@rootScope)->
		@t = 0
		@show = @paused = false

	click: ->
		if @paused then @play() else @pause()

	increment: (dt)->
		@t+=dt

	setT: (t)->
		@t = t

	set_show: (v)->
		@show = v

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		last = 0
		console.log 'asdf'
		d3.timer (elapsed)=>
				dt = elapsed - last
				@increment dt/1000
				last = elapsed
				if @t > 4.5 then @setT 0
				@rootScope.$evalAsync()
				@paused
			, 1

	pause: -> @paused = true

module.exports = ['$rootScope', Service]