math = require 'mathjs'
_ = require 'lodash'

class QuadService
	constructor: ()->
		parser = math.parser()
		parser.eval('y(t) = t^3-7*t^2+14*t-5')
		parser.eval('dy(t)=3*t^2-14*t+14')

		EQ = 
			y: parser.get('y')
			dy: parser.get('dy')

		@data = _.range(0, 8, .1)
			.map (t)->
				res = 
					t: t,
					y: EQ.y(t),
					dy: EQ.dy(t)

		@point = _.sample(@data)

module.exports = new QuadService 
