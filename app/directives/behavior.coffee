drag = ($parse)->
	directive = 
		link: (scope,el,attr)->
			sel = d3.select(el[0])
			sel.call($parse(attr.behavior)(scope))

module.exports = drag