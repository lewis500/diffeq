_ = require 'lodash'
{min} = Math

class Dot
	constructor: (@t, @y)->
		@id = _.uniqueId 'dot' 

class Service
	constructor: ()->
		@dots = []
		@selected = undefined

	add_dot: (t, y)->
		@selected = new Dot t,y
		@dots.push @selected
		@update_dot(@selected, t, y)

	remove_dot: (dot)->
		@dots.splice(@dots.indexOf(dot), 1)

	update_dots: ()-> 
		@dots.sort (a,b)-> a.t - b.t
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			dot.dy = if prev then min(100,(dot.y - prev.y)/(dot.t - prev.t)) else 0

	update_dot: (dot, t, y)->
		dot.t = t
		dot.y = y
		@update_dots()

service = new Service

module.exports = service