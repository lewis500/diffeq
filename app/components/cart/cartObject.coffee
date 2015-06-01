
class Ctrl
	constructor:(@scope, @el, @window)->

	trans: (tran)->
		tran
			.duration 50
			.ease 'linear'

der = ()->
	directive = 
		scope: 
			# data: '=CartObjectDer'
			left: '='
		controllerAs: 'vm'
		templateNamespace: 'svg'
		controller: ['$scope','$element','$window', Ctrl]
		templateUrl: '../app/components/cart/cart.svg'
		bindToController: true
		restrict: 'A'

module.exports = der