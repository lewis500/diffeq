'use strict'
angular = require 'angular'
d3 = require 'd3'
app = angular.module 'mainApp', [require 'angular-material']
	.directive 'horAxisDer', require './directives/xAxis'
	.directive 'verAxisDer', require './directives/yAxis'
	.directive 'cartSimDer', require './components/cart/cartSim'
	.directive 'cartObjectDer', require './components/cart/cartObject'
	# .directive 'cartButtonsDer', require './components/cart/cartButtons'
	.directive 'shifter' , require './directives/shifter'
	.directive 'behavior', require './directives/behavior'
	.directive 'dotADer', require './components/design/dotA'
	.directive 'dotBDer', require './components/design/dotB'
	.directive 'datum', require './directives/datum'
	.directive 'd3Der', require './directives/d3Der'
	.directive 'designADer', require './components/design/designA'
	.directive 'designBDer' , require './components/design/designB'
	.directive 'derivativeADer', require './components/derivative/derivativeA'
	.directive 'derivativeBDer', require './components/derivative/derivativeB'
	.directive 'cartPlotDer', require './components/cart/cartPlot'
	.directive 'designCartADer', require './components/design/designCartA'
	.directive 'designCartBDer', require './components/design/designCartB'
	.directive 'textureDer', require './directives/texture'
	# .directive 'designButtonsDer', require './components/design/designButtons'
	.directive 'boilerplateDer', require './directives/boilerplate'
	.directive 'cartDer' , require './directives/cartDer'
	.service 'derivativeData', require './components/derivative/derivativeData'
	.service 'fakeCart', require './components/design/fakeCart'
	.service 'trueCart', require './components/design/trueCart'
	.service 'designData', require './components/design/designData'
	.service 'cartData', require './components/cart/cartData'
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
