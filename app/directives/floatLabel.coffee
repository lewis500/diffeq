template = '''
<foreignObject width='30' height='30'>
		<text class='label'>$v$</text>
</foreignObject>
'''

<foreignObject width='30' height='30' style='font-size: 13px; font-weight: 100;'>
		<text class='label' font-size='13px'>$y$</text>
</foreignObject>

der = ()->
	directive = 
		controllerAs: 'vm'
		scope: {}
		bindToController: true
		template: template
		templateNamespace: 'svg'
		controller: ->

module.exports = der