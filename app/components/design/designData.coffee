_ = require 'lodash'
require '../../helpers'
Cart = require '../cart/cartData'
d3 = require 'd3'

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot'

class Data
	constructor: ->
		@t = @x = 0
		@Cart = Cart
		firstDot = new Dot 0 , Cart.v0
		firstDot.id = 'first'
		midDot = new Dot Cart.trajectory[10].t , Cart.trajectory[10].v
		lastDot = new Dot 6 , Cart.trajectory[10].v
		lastDot.id = 'last'
		@dots = [ firstDot, 
			midDot,
			lastDot
		]
		@correct = @show = false
		@first = firstDot
		@target_data = Cart.trajectory
		@update_dots()
		@select_dot @dots[1]

	set_show: (v)->
		@show = v
		
	set_t: (t)->
		@t = t

	increment: (dt)->
		@t += dt

	select_dot: (dot)->
		@selected = dot

	add_dot: (t, v)->
		newDot = new Dot t,v
		@dots.push newDot
		@update_dot newDot, t, v

	remove_dot: (dot)->
		@dots.splice @dots.indexOf(dot), 1
		@update_dots()

	update_dots: -> 
		@dots.sort (a,b)-> a.t - b.t
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			if dot.id == 'last'
				dot.v = prev.v
				return
			if prev
				dt = dot.t - prev.t
				dot.x = prev.x + dt * (dot.v + prev.v)/2
				dot.dv = (dot.v - prev.v)/Math.max(dt, .0001)
			else
				dot.x = 0
				dot.dv = 0

	update_dot: (dot, t, v)->
		if dot.id == 'first' then return
		@select_dot dot
		dot.t = t
		dot.v = v
		@update_dots()
		@correct = Math.abs(Cart.k * dot.v + dot.dv) < 0.05

module.exports = new Data