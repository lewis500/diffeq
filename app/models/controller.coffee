angular = require 'angular'

class Controller
	constructor: (@scope, @element)->
		@Y = d3.scale.linear().domain([0,8])
		@X = d3.scale.linear().domain([0,8])
		@mar = 
			left: 30
			top: 20
			right: 10
			bottom: 30

		angular.element(window).on('resize', @resize)

	resize: ()=>
		@width = @element[0].clientWidth - @mar.left - @mar.right
		@height = @width * .7
		@Y.range([@height, 0])
		@X.range([0, @width])
		@scope.$evalAsync()

module.exports = Controller