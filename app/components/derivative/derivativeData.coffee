_ = require 'lodash'
vFun = Math.sin
dvFun = Math.cos

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