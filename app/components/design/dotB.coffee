Data = require './designData'

template = '''
	<circle class='dot small' r='4'></circle>
'''

class Ctrl
	constructor: (@scope, @el, @fakeCart, @Data)->
		circ = d3.select @el[0]

		circ.on 'mouseover',@mouseover
			.on 'mouseout' , @mouseout
			# .on 'contextmenu', -> 
			# 	event.preventDefault()
			# 	event.stopPropagation()

		@scope.$watch =>
				(Data.selected == @dot) and (Data.show)
			, (v, old)->
				if v == old then return
				if v
					circ.transition()
						.duration 150
						.ease 'cubic-out'
						.style
							'stroke-width': 2.5
				else 
					circ.transition()
						.duration 100
						.ease 'cubic'
						.style
							'stroke-width': 1.6
							stroke: 'white'
			 
	mouseout: =>
		@Data.set_show false
		@scope.$evalAsync()

	mouseover: =>
		@fakeCart.select_dot @dot
		@Data.set_show true
		@scope.$evalAsync()

der = ()->
	directive = 
		template: template
		controllerAs: 'vm'
		scope: 
			dot: '=dotBDer'
		bindToController: true
		controller: ['$scope','$element', 'fakeCart', 'designData', Ctrl]
		restrict: 'A'


module.exports = der
