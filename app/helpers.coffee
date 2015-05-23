'use strict'

module.exports.timeout = (fun, time)->
		d3.timer(()=>
			fun()
			true
		,time)


Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc