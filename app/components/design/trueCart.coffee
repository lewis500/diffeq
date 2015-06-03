Data = require './designData'
_ = require 'lodash'
require '../../helpers'
delT = .025

class Service
	constructor: (@Data)->
		@trajectory = _.range 0, 4.5 , delT
			.map (t)->
				t: t
				x: 2/.8 * (1-Math.exp(-.8*t))
				v: 2*Math.exp -.8*t
				dv: -.8*2*Math.exp -.8*t

	loc: (t)->	2/.8 * (1-Math.exp(-.8*t))

	@property 'x', get:-> @loc @Data.t

	@property 'v', get:-> 2* Math.exp(-.8*@Data.t)

	@property 'dv', get:-> -.8*2* Math.exp(-.8*@Data.t)

module.exports = ['designData', Service]