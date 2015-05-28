d3 = require 'd3'
{element}= require 'angular'

der = ()-> #goes on a path element
	directive = 
		controller: ()->
		controllerAs: 'vm'
		bindToController: true
		restrict: 'A'
		templateNamespace: 'svg'
		scope:
			data: '='
			lineFun: '='
			watch: '='
		link: (scope, el, attr, vm)->
			sel = d3.select(el[0])
			update = ()-> 
				sel.attr 'd', vm.lineFun vm.data

			scope.$watch 'vm.watch'
				, update
				, true
			element(window).on 'resize', update

module.exports = der