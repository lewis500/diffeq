_ = require 'lodash'
require '../../helpers'
{exp, sqrt, atan, min, max} = Math

vScale = d3.scale.linear()
xScale = d3.scale.linear()
# trueXScale = d3.scale.linear()
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
			new Dot( .3, 4*exp(-.3)),
			# lastDot
		 ]
		@correct = false

		@first = firstDot

		@selected = firstDot
		@show = false
		@target_data = _.range 0, 5, 1/50
			.map (t)-> 
				res  = 
					t: t
					v: 4* exp(-t)
					dv: -4 * exp(-t)
		@data = _.range 0, 5, 1/50
			.map (t)->
				res = 
					t: t
					v: 0
					x: 0
		xScale.domain _.pluck @data, 't'
		@update_dots()

	add_dot: (t, v)->
		@selected = new Dot t,v
		@dots.push @selected
		@update_dot(@selected, t, v)

	remove_dot: (dot)->
		@dots.splice @dots.indexOf(dot), 1
		@update_dots()

	update_dots: -> 
		@dots.sort (a,b)-> a.t - b.t
		domain = _.pluck( @dots, 't')
		domain.push(6.5)
		range = _.pluck( @dots , 'v')
		range.push(@dots[@dots.length - 1].v)
		vScale.domain domain
			.range range

		@data.forEach (d,i,k)->
			d.v = vScale d.t
			if i > 0
				prev = k[i-1]
				d.x = prev.x + (prev.v + d.v)/2*(d.t-prev.t)
			else
				d.x = 0

		xScale.range _.pluck @data, 'x'

		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			if prev
				dt = dot.t - prev.t
				# if 0 < dt < .0001 then dot.t += .0001
				# if -.0001 < dt <= 0 then dot.t -= .0001
				# dt = dot.t - prev.t
				dot.x = prev.x + dt * (dot.v + prev.v)/2
				dot.dv = (dot.v - prev.v)/max(dt, .0001)
			else
				dot.x = 0
				dot.dv = 0

	update_dot: (dot, t, v)->
		if dot.id == 'first' then return
		@selected = dot
		dot.t = t
		dot.v = v
		@update_dots()
		@correct = Math.abs(@selected.v + @selected.dv) < 0.1

	@property 'x', get: ->
		res = xScale @t

	@property 'true_x', get: ->
		4*(1-Math.exp -@t )

	@property 'maxX', get:->
		@data[@data.length - 1].x

service = new Service

module.exports = service