_ = require 'lodash'
require '../../helpers'
# Cart = require '../cart/cartData'
d3 = require 'd3'
delT = .025

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot'
		@dv = 0

	update: (t,v)->
		@t = t
		@v = v

class Dots
	constructor: ->
		@correct = false
		firstDot = new Dot 0 , 0
		firstDot.id = 'first'
		@dots = [firstDot]
		@trajectory = _.range 0, 4.5 , delT
			.map (t)->
				res = 
					t: t
					v: 0
					x: 0
		_.range .5, 2.5, .5
			.forEach (t)->
				@dots.push new Dot t, 2*Math.exp(-.8*t)

		lastDot = new Dot 6 , @dots[@dots.length - 1].v

		lastDot.id = 'last'
		@dots.push lastDot
		@update()
		@select_dot @dots[1]

	select_dot: (dot)->
		@selected = dot

	add_dot: (t, v)->
		newDot = new Dot t,v
		@dots.push newDot
		@update_dot newDot, t, v

	remove_dot: (dot)->
		@dots.splice @dots.indexOf(dot), 1
		@update()

	loc: (t)->
		@trajectory[Math.floor(t/delT)]

	update: -> 
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

		@dots.slice(1)
			.forEach (dot,i,k)=>
				a = k[i-1]
				dv = dot.dv
				@trajectory
					.slice(Math.floor(a.t/delT), Math.floor(a.t/delT))
					.forEach (d)->
						dt = d.t - a.t
						d.x = a.x + a.v * dt + 0.5*dv * dt**2
						d.v = a.v + dv * dt

	update_dot: (dot, t, v)->
		if dot.id == 'first' then return
		@select_dot dot
		dot.update t,v
		@update()
		@correct = Math.abs( -.8 * dot.v + dot.dv) < 0.05

module.exports = new Dots