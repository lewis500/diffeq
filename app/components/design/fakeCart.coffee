Data = require './designData'
_ = require 'lodash'

class Cart
	constructor: ->

	loc: (t)->
		i = _.findLastIndex Data.dots, (d)->
			d.t <= t
		a = Data.dots[i]
		dt = t - a.t
		dv = Data.dots[i+1]?.dv ? 0
		a.x + a.v * dt + 0.5*dv * dt**2

	@property 'x', get:-> @loc Data.t

	@property 'v', get:->
		t = Data.t
		i = _.findLastIndex Data.dots, (d)->
			d.t <= t
		a = Data.dots[i]
		dt = t - a.t
		dv = Data.dots[i+1]?.dv ? 0
		a.v + dv * dt

module.exports = new Cart