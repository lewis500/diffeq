_ = require 'lodash'
require '../../helpers'
Cart = require '../cart/cartData'
{exp, min, max} = Math

vScale = d3.scale.linear()
xScale = d3.scale.linear()

class Data
	constructor: ()->
		@t = 0
		@x = 0
		firstDot = new Dot 0 , Cart.v0
		firstDot.id = 'first'
		@dots = [ firstDot, 
			new Dot Cart.trajectory[10].t , Cart.trajectory[10].v
		]
		@correct = false
		@show = false
		@first = firstDot
		@selected = firstDot
		@target_data = Cart.trajectory

		@data = _.range 0, 7, 1/30
			.map (t)->
				res = 
					t: t
					v: 0
					x: 0
				
		xScale.domain _.pluck @data, 't'
		@update_dots()

		@sample = _.range 0 , 10
			.map (n)=>
				@data[n*21]
		@paused = false

	add_dot: (t, v)->
		@selected = new Dot t,v
		@dots.push @selected
		@update_dot @selected, t, v

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
		@correct = Math.abs(Cart.k * @selected.v + @selected.dv) < 0.05

	@property 'x', get: ->
		res = xScale @t

	@property 'true_x', get: ->
		4*(1-Math.exp -@t )

	@property 'maxX', get:->
		@data[@data.length - 1].x

module.exports = new Data