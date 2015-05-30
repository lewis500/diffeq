
template = '''
	<circle class='dot large'></circle>
	<circle class='dot small' r='4'></circle>
'''

der = ()->
	directive = 
		template: template
		restrict: 'A'
		link: (scope,el,attr)->
			rad = 10 #the radius of the large circle naturally
			sel = d3.select el[0]
			big = sel.select 'circle.dot.large'
				.attr 'r', rad
			circ = sel.select 'circle.dot.small'

			mouseover = ()->
				scope.dot.hilited = true
				scope.vm.Data.selected = scope.dot
				scope.vm.Data.show = true
				scope.$evalAsync()
				big.transition 'grow'
					.duration 150
					.ease 'cubic-out'
					.attr 'r' , rad * 1.5
					.transition()
					.duration 150
					.ease 'cubic-in'
					.attr 'r' , rad * 1.3
					
			big.on 'mouseover', mouseover
				.on 'contextmenu', -> event.preventDefault()
				.on 'mousedown', ->
					big.transition 'grow'
						.duration 150
						.ease 'cubic'
						.attr 'r', rad*1.7
				.on 'mouseup', ()->
					big.transition 'grow'
						.duration 150
						.ease 'cubic-in'
						.attr 'r', rad*1.3
				.on 'mouseout' , ()->
					scope.dot.hilited = false
					scope.vm.Data.show = false
					scope.$evalAsync()
					big.transition 'shrink'
						.duration 350
						.ease 'bounce-out'
						.attr 'r' , rad

			scope.$watch 'dot.hilited' , (v)->
				if v
					circ.transition()
						.duration 150
						.ease 'cubic-out'
						.style
							'stroke-width': 2.5
							# stroke: '#4CAF50'
				else 
					circ.transition()
						.duration 100
						.ease 'cubic'
						.style
							'stroke-width': 1.6
							stroke: 'white'


module.exports = der
