_ = require 'lodash'
{exp, sqrt, atan} = Math

class Cart
	constructor: (@options)->
		{@x0, @v0, @b} = @options
		@restart()
	restart: ->
		@t = 0
		@trajectory = []
		@move(0)
		@paused = true
	set_t: (t)->
		@t = t
		@move t
	increment: (dt)->
		@t+=dt
		@move @t
	move: (t)->
		@v = @v0 * exp(-@b * t)
		@x = @x0 + @v0/@b * (1-exp(-@b*t))
		@dv = -@v
		@trajectory.push {t: t, v: @v, x: @x}

module.exports = new Cart {x0: 0, v0: 4, b: 1}