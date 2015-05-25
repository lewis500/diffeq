
Test0 = require 'test/subdir/Test0'

csonTest = require 'test/test'

class Test1 extends Test0

  constructor: ->
    super()
    console.log 'constructor Test1'

    image = new Image
    image.src = 'dataURI(test/snow.png)'

    document.body.appendChild image


module.exports = Test1
