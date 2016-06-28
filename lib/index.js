var once = require('once')
var getPort = require('get-port')
var seaport = require('seaport')
var seaportadvert = require('seaport-advert')

module.exports = function (role, opts, cb) {
  console.log('seaporting', new Date().getTime())
  // allow two parameters
  if (!cb) {
    cb = opts
    opts = {}
  }
  cb = once(cb)
  console.log('we have a once function')
  if (!opts.timeout) opts.timeout = 5000
  if (!opts.log) opts.log = console.log

  bind(opts.port, function (err, service_port) {
    if (err) return cb(err)

    opts.log('raw service', role, 'running on port', service_port)

    if (opts.onlyBind) return cb(null, service_port, '/')

    function doSeaport () {
      opts.log('connecting to seaport...')
      findRouter(opts, function (err, router) {
        if (err) {
          opts.log('Error connecting, ', err)
          opts.log('will retry connecting to seaport in ', opts.timeout)
          return setTimeout(doSeaport, opts.timeout)
        }

        if (router.url) opts.log('service available at', router.url + '/' + role)

        var s = seaport.connect(router.host, router.port)
        s.on('connect', function () {
          opts.log('seaport connected.')
        })
        s.on('disconnect', function () {
          opts.log('seaport disconnected')
          process.nextTick(doSeaport)
          s.close()
        })
        s.on('timeout', function () {
          opts.log('seaport timeout')
        })
        var seaport_opts = {port: service_port}
        if (opts.public_service_host) {
          seaport_opts.host = opts.public_service_host
        }
        if (opts.public_service_port) {
          seaport_opts.port = opts.public_service_port
        }
        s.register(role, seaport_opts)
      })
    }
    process.nextTick(doSeaport)
    cb(null, service_port, '/' + role)
  })
}

function findRouter (opts, cb) {
  if (!!opts.findRouter && opts.host && opts.port) {
    return cb(null, {host: opts.host, port: opts.port})
  }
  seaportadvert.find(opts, cb)
}

function bind (service_port, cb) {
  if (service_port) return cb(null, service_port)
  return getPort(cb)
}
