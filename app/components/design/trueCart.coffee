Data = require './designData'
_ = require 'lodash'
require '../../helpers'

class Cart
	constructor: ->

	loc: (t)->
		2/.8 * (1-Math.exp(-.8*t))

	@property 'x', get:-> @loc Data.t

module.exports = new Cart