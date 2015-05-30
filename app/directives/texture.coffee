angular = require 'angular'
d3 = require 'd3'
textures = require 'textures'

class Ctrl
	constructor: (@scope, @el, @window)->
		t = textures.lines()
			.orientation "3/8", "7/8"
			.size 5
			.stroke('#E6E6E6')
		    .strokeWidth .8

		t.id 'myTexture'

		d3.select @el[0]
			.select 'svg'
			.call t

der = ->
	directive = 
		controllerAs: 'vm'
		scope: {}
		template: '<svg height="0px" style="position: absolute;" width="0px"></svg>'
		templateNamespace: 'svg'
		controller: ['$scope','$element', '$window', Ctrl]

module.exports = der
