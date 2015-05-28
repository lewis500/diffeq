'use strict'
angular = require 'angular'
d3 = require 'd3'
app = angular.module 'mainApp', [require 'angular-material']
	.directive 'horAxisDer', require './directives/xAxis'
	.directive 'verAxisDer', require './directives/yAxis'
	.directive 'cartSimDer', require './components/cart/cartSim'
	.directive 'cartButtonsDer', require './components/cart/cartButtons'
	.directive 'shifter' , require './directives/shifter'
	.directive 'designADer', require './components/design/designA'
	.directive 'behavior', require './directives/behavior'
	.directive 'dotDer', require './directives/dot'
	.directive 'datum', require './directives/datum'
	.directive 'd3Der', require './directives/d3Der'
	.directive 'designBDer' , require './components/design/designB'
	.directive 'regularDer', require './components/regular/regular'
	.directive 'derivativeDer', require './components/derivative/derivative'
	.directive 'dotBDer', require './directives/dotB'
	.directive 'cartPlot', require './components/cart/cartPlot'
	.directive 'designCartDer', require './components/design/designCartA'

looper = ->
    setTimeout( ()->
    			d3.selectAll 'circle.dot.large'
    				.transition 'grow'
    				.duration 500
    				.ease 'cubic-out'
    				.attr 'transform', 'scale( 1.34)'
    				.transition 'shrink'
    				.duration 500
    				.ease 'cubic-out'
    				.attr 'transform', 'scale( 1.0)'
    			looper()
    		, 1000)

looper()
