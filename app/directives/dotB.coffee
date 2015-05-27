template = '''
	<circle class='dot small' r='4'></circle>
'''

der = ()->
	directive = 
		template: template
		restrict: 'A'
		link: (scope,el,attr)->
			sel = d3.select el[0]
			circ = sel.select 'circle.dot.small'

			scope.$watch 'dot.hilited' , (v)->
				if v
					circ.transition()
						.duration 150
						.ease 'cubic-out'
						.style
							'stroke-width': 2.5
							stroke: '#222'
				else 
					circ.transition()
						.duration 100
						.ease 'cubic'
						.style
							'stroke-width': 1.6
							stroke: 'white'

module.exports = der
