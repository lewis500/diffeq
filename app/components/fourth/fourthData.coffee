{exp} = Math
_ = require 'lodash'

class fourthData
	constructor: ()->
		y0 = .5

		@data = _.range( 0, 8, .1)
			.map (t)->
				res = 
					t: t
					y: y0*exp(.5*t)
					dy: .5*y0*exp(.5*t)

		@point = _.sample( @data, 1)

module.exports = new fourthData