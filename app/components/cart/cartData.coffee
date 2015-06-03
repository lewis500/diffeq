_ = require 'lodash'
vFun = (t)->2*Math.exp -.8*t
dvFun = (t)-> -.8 * 2*Math.exp -.8*t
xFun = (t)-> 2/.8*(1-Math.exp(-.8*t))

class Service
	constructor: ($rootScope)->
		@rootScope = $rootScope
		@setT 0
		@paused =  false
		@trajectory = _.range 0 , 6 , 1/10
			.map (t)->
				res =
					x: xFun t
					dv: dvFun t
					v: vFun t
					t: t
		@move 0 

	click: ->
		if @paused then @play() else @pause()

	pause: ->
		@paused = true

	increment:(dt) ->
		@t += dt
		@move(@t)

	setT: (t)->
		@t = t
		@move @t

	play: ->
		@paused = true
		d3.timer.flush()
		@paused = false
		last = 0
		d3.timer (elapsed)=>
				dt = elapsed - last
				@increment dt/1000
				last = elapsed
				if @t > 6 then @setT 0
				@rootScope.$evalAsync()
				@paused
			, 1

	move: (t)->
		@point = 
			x: xFun t
			dv: dvFun t
			v: vFun t
			t: t

module.exports = Service