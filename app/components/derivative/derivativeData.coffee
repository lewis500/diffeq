_ = require 'lodash'
vFun = Math.sin
dvFun = Math.cos
require '../../helpers'

d3 = require 'd3'

# class Ctrl
# 	constructor: (@scope)->

# 	click: ->
# 		if @paused then @play() else @pause()

# 	play: ->
# 		@paused = true
# 		d3.timer.flush()
# 		@paused = false
# 		last = 0
# 		d3.timer (elapsed)=>
# 				dt = elapsed - last
# 				Data.increment dt/1000
# 				last = elapsed
# 				if Data.t > 4.5
# 					Data.set_t 0
# 				@scope.$evalAsync()
# 				@paused
# 			, 1

# 	pause: -> @paused = true

class Data
	constructor: ->
		@data = _.range 0 , 8 , 1/50
			.map (t)->
				res = 
					dv: dvFun t
					v: vFun t
					t: t

		@point = _.sample @data

	move: (t)->
		@point = 
			dv: dvFun t
			v: vFun t
			t: t

module.exports = new Data