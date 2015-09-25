var seaportautopilot = require('../lib/index')
var test = require('tape')

test('fill in this', function (t) {
  seaportautopilot('testtesttest', function (err, port) {
    t.error(err)
    t.ok(port)
    t.end()
    process.exit()
  })
})
