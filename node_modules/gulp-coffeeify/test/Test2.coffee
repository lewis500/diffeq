
Test0 = require 'test/subdir/Test0'
Test1 = require 'test/Test1'

class Test2 extends Test1

  constructor: ->
    super()
    console.log 'constructor Test2'


module.exports = Test2
