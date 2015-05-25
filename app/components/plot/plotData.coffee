_ = require 'lodash'
{exp, sqrt, atan, min} = Math

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot' 

class Service
	constructor: ()->
		@dots = []
		@selected = undefined

		@target_data = _.range 0, 8, 1/50
			.map (t)-> 
				res  = 
					t: t
					v: 4* exp(-t)
					dv: -4 * exp(-t)

	add_dot: (t, v)->
		@selected = new Dot t,v
		@dots.push @selected
		@update_dot(@selected, t, v)

	remove_dot: (dot)->
		@dots.splice(@dots.indexOf(dot), 1)

	update_dots: ()-> 
		@dots.sort (a,b)-> a.t - b.t
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			dot.dv = if prev then min(100,(dot.v - prev.v)/(dot.t - prev.t)) else 0

	update_dot: (dot, t, v)->
		dot.t = t
		dot.v = v
		@update_dots()

service = new Service

module.exports = service