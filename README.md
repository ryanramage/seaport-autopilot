# seaport-autopilot

[![NPM](https://nodei.co/npm/seaport-autopilot.png)](https://nodei.co/npm/seaport-autopilot/)

seaport-autopilot takes care of most of the work getting you an available port,
finding a seaport and staying connected to that seaport.

it makes your app more plug-n-play.


```
npm install seaport-autopilot
```

## Usage


    var seaportautopilot = require('seaport-autopilot')

    seaportautopilot('myservicename', function (err, port, path) {
      if (err) return console.log('something serious happened, die with', err)

      // here you have a shiny new port, and will be available on an auto-connected seaport      
      // if it looses the seaport, it will auto-reconnect as well when it comes back

    })


## License

MIT
