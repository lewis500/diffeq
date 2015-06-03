require '../../helpers'
_ = require 'lodash'
d3 = require 'd3'
delT = .1

class Dot
	constructor: (@t, @v)->
		@id = _.uniqueId 'dot'
		@dv = 0

	update: (t,v)->
		@t = t
		@v = v

class Service
	constructor:(@Data) ->
		@correct = false
		firstDot = new Dot 0 , 2
		firstDot.id = 'first'
		@dots = [firstDot]
		@trajectory = _.range 0, 5 , delT
			.map (t)->
				res = 
					t: t
					v: 0
					x: 0
		_.range .5, 2.5, .5
			.forEach (t)=>
				@dots.push new Dot t, 2*Math.exp(-.8*t)

		lastDot = new Dot 6 , @dots[@dots.length - 1].v
		lastDot.id = 'last'
		@dots.push lastDot
		@select_dot @dots[1]
		@update()

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
		a = Math.floor t/delT
		h = (t - @trajectory[a].t)/delT
		@trajectory[a].x* (1-h) + h* @trajectory[a+1]?.x

	@property 'x', get: -> @loc @Data.t

	@property 'v', get: -> 
		t = @Data.t
		a = Math.floor t/delT
		h = (t - @trajectory[a].t)/delT
		@trajectory[a].v* (1-h) + h* @trajectory[a+1]?.v

	@property 'dv', get: -> @trajectory[Math.floor(@Data.t/delT)].dv

	update: -> 
		@dots.sort (a,b)-> a.t - b.t
		domain = []
		range = []
		@dots.forEach (dot, i, k)->
			prev = k[i-1]
			if dot.id == 'last'
				dot.v = prev.v
				domain.push dot.v
				range.push dot.v
				return
			if prev
				dt = dot.t - prev.t
				dot.x = prev.x + dt * (dot.v + prev.v)/2
				dot.dv = (dot.v - prev.v)/Math.max(dt, .001)
			else
				dot.x = 0
				dot.dv = 0

		@dots.forEach (dot,i,k)=>
				a = @dots[i-1]
				if !a then return
				dv = dot.dv
				@trajectory
					.slice(Math.floor(a.t/delT), Math.floor(dot.t/delT))
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


module.exports = ['designData' , Service]