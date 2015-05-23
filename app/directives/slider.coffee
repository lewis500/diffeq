
d3 = require 'd3'
angular = require 'angular'

odeSlider = ()->
	directive = 
		require: '?ngModel'
		template: '''<div class="ode-slider-wrapper"> 
		  <div class="ode-track-container"> 
		    <div class="ode-track"></div> 
		    <div class="ode-track ode-track-fill"></div> 
		  </div> 
		  <div class="ode-thumb-container">
		    <div class="ode-thumb"></div>
		  </div>
		</div>''',
		link: (scope, el, attr, ngModelCtrl)->
			# define my variables
			sel = d3.select el[0]
			thumbContainer = sel.select('.ode-thumb-container')
			activeTrack = sel.select('.ode-track-fill')
			trackContainer = angular.element(el[0].querySelector('.ode-track-container'))
			min = +attr.min
			max = +attr.max
			step = +attr.step
			sliderDimensions = {}

			adjustThumbPosition = (x) ->
				exactVal = percentToValue(positionToPercent(x))
				closestVal = minMaxValidator(stepValidator(exactVal))
				setSliderPercent positionToPercent(x)

			positionToPercent = (x) ->
				Math.max 0, Math.min(1, (x - sliderDimensions.left) / sliderDimensions.width)

			percentToValue = (percent) ->
			  min + percent * (max - min)

			valueToPercent = (val) ->
			  (val - min) / (max - min)

			refreshSliderDimensions = ()->
			  sliderDimensions = trackContainer[0].getBoundingClientRect();

			setSliderPercent = (percent)->
			  activeTrack.style 'width', (percent * 100) + '%'
			  thumbContainer.style  'left',   (percent * 100) + '%'

		   ###*
		   # ngModel setters and validators
		   ###

			setModelValue = (value) ->
			  ngModelCtrl.$setViewValue minMaxValidator(stepValidator(value))

			ngModelRender = ->
			  if isNaN(ngModelCtrl.$viewValue)
			    ngModelCtrl.$viewValue = ngModelCtrl.$modelValue
			  percent = (ngModelCtrl.$viewValue - min) / (max - min)
			  setSliderPercent percent

			minMaxValidator = (value) ->
			  Math.max(min, Math.min(max, value))

			stepValidator = (value) ->
			  Math.round(value / step) * step

			ngModelCtrl.$render = ngModelRender
			ngModelCtrl.$viewChangeListeners.push ngModelRender

			drag = d3.behavior.drag()
			  .on 'drag' , () ->
			    event.stopPropagation()
			    ev = event
			    scope.$evalAsync ->
			      setModelValue percentToValue(positionToPercent(ev.clientX))

			thumbContainer.call(drag)

			thumbContainer.on 'mousedown', () ->
			      refreshSliderDimensions()
			      exactVal = percentToValue(positionToPercent(event.clientX))
			      closestVal = minMaxValidator(stepValidator(exactVal))
			      scope.$apply ->
			        setModelValue closestVal
			        setSliderPercent valueToPercent(closestVal)

			thumbContainer.on 'mouseup', ()->
				exactVal = percentToValue(positionToPercent(event.clientX))
				closestVal = minMaxValidator(stepValidator(exactVal))
				scope.$apply ->
				  setModelValue closestVal
				  ngModelRender()


module.exports = odeSlider