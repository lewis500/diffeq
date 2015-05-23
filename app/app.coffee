'use strict'
d3= require 'd3'
angular = require 'angular'
odeSlider = require './directives/slider'
firstLeftDer = require './components/first/firstLeft'
firstRightDer = require './components/first/firstRight'
secondLeftDer = require './components/second/secondLeft'
secondRightDer = require './components/second/secondRight'
thirdLeft = require './components/third/thirdLeft'
thirdBig = require './components/third/thirdBig'

fourthLeftDer = require './components/fourth/fourthLeft'
fourthRightDer = require './components/fourth/fourthRight'

behavior = require './directives/behavior'
datum = require './directives/datum'
dotDer = require './directives/dot'

yAxis = require './directives/yAxis'
xAxis = require './directives/xAxis'
lineDer = require './directives/line'

shifter = require './directives/shifter'

app = angular.module('mainApp', ['mathjax'])
	.directive 'odeSlider', odeSlider
	.directive 'firstLeftDer', firstLeftDer
	.directive 'firstRightDer', firstRightDer
	.directive 'yAxisDer', yAxis
	.directive 'exAxisDer', xAxis
	.directive 'lineDer', lineDer
	.directive 'shifter', shifter
	.directive 'secondLeftDer', secondLeftDer
	.directive 'secondRightDer', secondRightDer
	.directive 'behavior', behavior
	.directive 'datum', datum
	.directive 'dotDer', dotDer
	.directive 'thirdLeftDer', thirdLeft
	.directive 'thirdBigDer', thirdBig
	.directive 'fourthLeftDer', fourthLeftDer
	.directive 'fourthRightDer', fourthRightDer

looper = ()->
	time = 1000
	d3.timer( ()->
			d3.selectAll('circle.dot.large:not(:active):not(:hover)')
				.transition('throb')
				.duration(time/2)
				.ease('cubic')
				.attr('transform', 'scale(1.15)')
				.transition('throb')
				.duration(time/2)
				.ease('cubic')
				.attr('transform','scale(1)')
			looper()
			true
	, time)
looper()

angular.module('mathjax', [])
	.directive 'mathjax', ->
	  (scope, el, attrs, ctrl) ->
	    scope.$watch attrs.mathjax, ->
	      MathJax.Hub.Queue [
	        'Typeset'
	        MathJax.Hub
	        el[0]
	      ]


