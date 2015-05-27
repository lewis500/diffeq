'use strict'
angular = require 'angular'
# thirdLeft = require './components/third/thirdLeft'
# thirdBig = require './components/third/thirdBig'
# yAxis = require './directives/yAxis'
datum = require './directives/datum'
dotDer = require './directives/dot'
horAxis = require './directives/xAxis'
verAxis = require './directives/yAxis'
behavior = require './directives/behavior'
cartPlotDer = require './components/cart/cartPlot'
cartButtonsDer = require './components/cart/cartButtons'
shifter = require './directives/shifter'
material = require 'angular-material'
plotADer = require './components/plot/plotA'
plotBDer = require './components/plot/plotB'
lineDer = require './directives/line'
regularDer = require './components/regular/regular'
derivativeDer  = require './components/derivative/derivative'

app = angular.module 'mainApp', [material]
	.directive 'horAxisDer', horAxis
	.directive 'verAxisDer', verAxis
	.directive 'cartPlotDer', cartPlotDer
	.directive 'cartButtonsDer', cartButtonsDer
	.directive 'shifter' , shifter
	.directive 'plotADer', plotADer
	.directive 'behavior', behavior
	.directive 'dotDer', dotDer
	.directive 'datum', datum
	.directive 'lineDer', lineDer
	.directive 'plotBDer' , plotBDer
	.directive 'regularDer', regularDer
	.directive 'derivativeDer', derivativeDer