_ = require 'lodash'
require '../../helpers'
{exp, sqrt, atan, min, max} = Math

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot'
		@hilited = false

class Service
	constructor: ()->
		@t = 0
		@x = 0
		firstDot = new Dot 0 , 4
		firstDot.id = 'first'
		@dots = [ firstDot, 
			new Dot .3, 4*exp(-.3)
		 ]
		@correct = false

		@first = firstDot

		@selected = firstDot
		@show = false
		@target_data = _.range 0, 8, 1/50
			.map (t)-> 
				res  = 
					t: t
					v: 4* exp(-t)
					dv: -4 * exp(-t)
		@update_dots()

		@samples = []

		@getArea = (t) ->
			total = 0
			s = undefined
			i = 0
			while i < @samples.length
				s = @samples[i]
				if s.t > t
				  break
				total += s.v * (s.t - (@samples[i-1]?.t or 0))
				i++
			total

	@property 'area', get:->
		@getArea @t

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
			dot.x = if prev then (prev.x + dot.v * (dot.t - prev.t) + dot.dv /2 * (dot.t - prev.t)**2) else 0

	update_dot: (dot, t, v)->
		if dot.id == 'first' then return
		@selected = dot
		dot.t = t
		dot.v = v
		@update_dots()
		@correct = Math.abs(@selected.v + @selected.dv) < 0.1

	@property 'x', get: ->
		dot = _.findLast @dots , (d)=> d.t <= @t
		dt = @t - dot.t
		x = dot.x + dt*dot.v + 0.5*dot.dv * (dt)**2

service = new Service

module.exports = service