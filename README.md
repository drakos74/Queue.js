# Queue.js
asynchronous module loading controller for javascript projects

Instructions:
As seen in the example , every module to be loaded in the routine must create a global variable with it's name. To connect modules, as in module_4.js module content must be enclosed in a closure. All modules must be contained in the Sources object (/examples/_index.js)

- _server.js is a dummy static server for testing locally (you will need node.js)
- /_examples folder holds a working example
- 'index.html' and '/examples/index.html' accomplish the same thing . 
This demonstrates the "path independence" property of the main routine in loading scripts

-- open the console to inspect exactly what is happening in the example.

-- tested on Chrome and Firefox
