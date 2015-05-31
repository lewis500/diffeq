_ = require 'lodash'
{exp} = Math

class Cart
	constructor: (@options)->
		{@v0, @k} = @options
		@restart()
	restart: ->
		@t = 0
		@trajectory = _.range 0 , 6 , 1/50
			.map (t)=>
				v = @v0 * exp(-@k * t)
				res = 
					v: v
					x: @v0/@k * (1-exp(-@k*t))
					dv: -@k*v
					t: t
		@move 0
		@paused = true
	set_t: (t)->
		@t = t
		@move t
	increment: (dt)->
		@t+=dt
		@move @t
	move: (t)->
		@v = @v0 * exp( -@k * t)
		@x = @v0/@k * (1-exp(-@k*t))
		@dv = -@k*@v

module.exports = new Cart {v0: 2, k: .8}