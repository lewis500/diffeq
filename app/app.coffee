'use strict'
# angular = require 'angular'
thirdLeft = require './components/third/thirdLeft'
thirdBig = require './components/third/thirdBig'
yAxis = require './directives/yAxis'
xAxis = require './directives/xAxis'
material = require 'angular-material'

app = angular.module 'mainApp', [material]
	.directive 'yAxisDer', yAxis
	.directive 'exAxisDer', xAxis
	.directive 'thirdLeftDer', thirdLeft
	.directive 'thirdBigDer', thirdBig
