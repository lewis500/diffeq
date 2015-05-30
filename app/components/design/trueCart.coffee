Cart = require '../cart/cartData'
Data = require './designData'
_ = require 'lodash'
require '../../helpers'

class Cart
	constructor: ->

	loc: (t)->
		res = _.findLast Cart.trajectory, (d)->
			d.t<=t

	@property 'x', get:-> @loc Data.t

module.exports = new Cart