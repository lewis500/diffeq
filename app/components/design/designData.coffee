_ = require 'lodash'
require '../../helpers'
Cart = require '../cart/cartData'
d3 = require 'd3'
{exp, min, max} = Math

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot'
		@hilited = false

class Data
	constructor: ->
		@t = @x = 0
		firstDot = new Dot 0 , Cart.v0
		firstDot.id = 'first'
		# lastDot = new Dot 0 , Cart.
		@dots = [ firstDot, 
			new Dot Cart.trajectory[10].t , Cart.trajectory[10].v
		]
		@correct = @show = false
		@first = @selected = firstDot
		@target_data = Cart.trajectory
				
		@update_dots()

	add_dot: (t, v)->
		@selected = new Dot t,v
		@dots.push @selected
		@update_dot @selected, t, v

	remove_dot: (dot)->
		@dots.splice @dots.indexOf(dot), 1
		@update_dots()

	update_dots: -> 
		@dots.sort (a,b)-> a.t - b.t
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			if prev
				dt = dot.t - prev.t
				dot.x = prev.x + dt * (dot.v + prev.v)/2
				dot.dv = (dot.v - prev.v)/max(dt, .0001)
			else
				dot.x = 0
				dot.dv = 0
		# @design_data.forEach (d)->
		# 	d.v = 

	update_dot: (dot, t, v)->
		if dot.id == 'first' then return
		@selected = dot
		dot.t = t
		dot.v = v
		@update_dots()
		@correct = Math.abs(Cart.k * @selected.v + @selected.dv) < 0.05

module.exports = new Data