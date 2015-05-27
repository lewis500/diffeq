_ = require 'lodash'
{exp, sqrt, atan, min, max} = Math

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot' 

class Service
	constructor: ()->
		firstDot = new Dot 0 , 4
		firstDot.id = 'first'
		@dots = [ firstDot]

		@selected = firstDot

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
		@dots.splice @dots.indexOf(dot), 1

	update_dots: -> 
		@dots.sort (a,b)-> a.t - b.t
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			dot.dv = if prev then (dot.v - prev.v)/max(dot.t - prev.t, .01) else 0

	update_dot: (dot, t, v)->
		if dot.id == 'first'
			return
		@selected = dot
		dot.t = t
		dot.v = v
		@update_dots()

service = new Service

module.exports = service