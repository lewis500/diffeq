module.exports = ($parse)->
	(scope, el, attr)->
		d3.select(el[0]).datum($parse(attr.datum)(scope))