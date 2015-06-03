d3 = require 'd3'

class Ctrl
	constructor: (@scope, @el, @window)->
		@mar = 
			left: 30
			top: 20
			right: 20
			bottom: 30

		@Ver =d3.scale.linear()
		
		@Hor = d3.scale.linear()

		@horAxFun = d3.svg.axis()
			.scale @Hor
			.ticks 5
			.orient 'bottom'

		@verAxFun = d3.svg.axis()
			.scale @Ver
			# .tickFormat (d)->
			# 	if Math.floor( d ) != d then return
			# 	d
			.ticks 5
			.orient 'left'

		@lineFun = d3.svg.line()

		angular.element @window
			.on 'resize', @resize

	@property 'svg_height', get: -> @height + @mar.top + @mar.bottom

	resize: =>
		@width = @el[0].clientWidth - @mar.left - @mar.right
		@height = @el[0].clientHeight - @mar.top - @mar.bottom
		@Ver.range [@height, 0]
		@Hor.range [0, @width]
		@scope.$evalAsync()


module.exports = Ctrl