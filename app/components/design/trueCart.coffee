Real = require '../cart/cartData'
Data = require './designData'
_ = require 'lodash'
require '../../helpers'

class Cart
	constructor: ->

	loc: (t)->
		traj = _.findLast Real.trajectory, (d)->
				d.t<=t
			.x

	@property 'x', get:-> @loc Data.t

module.exports = new Cart