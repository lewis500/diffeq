
class Ctrl
	constructor:(@scope)->

	trans: (tran)->
		tran
			.duration 30
			.ease 'linear'

der = ()->
	directive = 
		scope: 
			size: '='
			left: '='
			top: '='
		controllerAs: 'vm'
		templateNamespace: 'svg'
		controller: ['$scope',Ctrl]
		templateUrl: './app/components/cart/cart.svg'
		bindToController: true
		restrict: 'A'

module.exports = der