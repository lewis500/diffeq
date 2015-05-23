d3 = require 'd3'
{exp, sqrt, atan} = Math

class simpleCart
	constructor: (@options)->
		{@x0, @v0, @b} = @options
		@restart()
	restart: ->
		[@x, @v] = [@x0, @v0]
		@trajectory = []
	move: (t)->
		@v = @v0 * exp(-@b * t)
		@x = @x0 + @v0/@b * (1-exp(-@b*t))
		@trajectory.push {t: t, v: @v, x: @x}

module.exports = new simpleCart({x0: 0, v0: .8, b: 1})