'use strict'
angular = require 'angular'
d3 = require 'd3'
datum = require './directives/datum'
dotDer = require './directives/dot'
horAxis = require './directives/xAxis'
verAxis = require './directives/yAxis'
behavior = require './directives/behavior'
cartSimDer = require './components/cart/cartSim'
cartButtonsDer = require './components/cart/cartButtons'
shifter = require './directives/shifter'
material = require 'angular-material'
plotADer = require './components/plot/plotA'
plotBDer = require './components/plot/plotB'
d3Der = require './directives/d3Der'
regularDer = require './components/regular/regular'
derivativeDer  = require './components/derivative/derivative'
dotBDer = require './directives/dotB'
app = angular.module 'mainApp', [material]
	.directive 'horAxisDer', horAxis
	.directive 'verAxisDer', verAxis
	.directive 'cartSimDer', cartSimDer
	.directive 'cartButtonsDer', cartButtonsDer
	.directive 'shifter' , shifter
	.directive 'plotADer', plotADer
	.directive 'behavior', behavior
	.directive 'dotDer', dotDer
	.directive 'datum', datum
	.directive 'd3Der', d3Der
	.directive 'plotBDer' , plotBDer
	.directive 'regularDer', regularDer
	.directive 'derivativeDer', derivativeDer
	.directive 'dotBDer', dotBDer
	.directive 'cartPlotDer', require './components/cart/cartPlot'
	.directive 'plotCartDer', require './components/plot/plotCart'

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
