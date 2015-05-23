
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
			sel = d3.select(el[0])
			big = sel.select('circle.dot.large').attr('r', rad)
			mouseover = ()->
				big.transition 'grow'
				.duration 150
				.ease 'cubic-out'
				.attr 'r' , rad * 1.5
				.transition()
				.duration 150
				.ease 'cubic-in'
				.attr 'r' , rad * 1.3
				
			mouseover()

			big.on 'mouseover', mouseover
			.on 'contextmenu', ()-> event.preventDefault()
			.on 'mousedown', ()->
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
				big.transition 'shrink'
					.duration 350
					.ease 'bounce-out'
					.attr 'r' , rad


module.exports = der
