template = '''
	<circle class='dot large'></circle>
	<circle class='dot small' r='4'></circle>
'''

class Ctrl
	constructor: (@scope, @el, @fakeCart, @Data)->
		rad = 7 #the radius of the large circle naturally
		sel = d3.select @el[0]
		big = sel.select 'circle.dot.large'
			.attr 'r', rad
		circ = sel.select 'circle.dot.small'

		big.on 'mouseover', @mouseover
			.on 'contextmenu', -> 
				d3.event.preventDefault()
				d3.event.stopPropagation()
			.on 'mousedown', ->
				big.transition 'grow'
					.duration 150
					.ease 'cubic'
					.attr 'r', rad*1.7
			.on 'mouseup', ->
				big.transition 'grow'
					.duration 150
					.ease 'cubic-in'
					.attr 'r', rad*1.3
			.on 'mouseout' , @mouseout

		@scope.$watch =>
				(@fakeCart.selected == @dot) and (@Data.show)
			, (v, old)->
				if v
					big.transition 'grow'
						.duration 150
						.ease 'cubic-out'
						.attr 'r' , rad * 1.5
						.transition()
						.duration 150
						.ease 'cubic-in'
						.attr 'r' , rad * 1.3

					circ.transition()
						.duration 150
						.ease 'cubic-out'
						.style
							'stroke-width': 2.5
				else 
					big.transition 'shrink'
						.duration 350
						.ease 'bounce-out'
						.attr 'r' , rad

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
			dot: '=dotADer'
		bindToController: true
		controller: ['$scope','$element', 'fakeCart', 'designData', Ctrl]
		restrict: 'A'


module.exports = der
