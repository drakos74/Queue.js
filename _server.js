/**
 * Created by drakos on 5/17/15.
 */
//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');

//Lets define a port we want to listen to
const port = 8080;

function createHeadersFor(extension){
    var header = {
        'Content-Type': 'text/plain'
    };
    switch(extension){
        case 'html':
            header['Content-Type'] = 'text/html';
            break;
        case 'js':
            header['Content-Type'] = 'text/javascript';
            break;
    }
    return header;
}

//We need a function which handles requests and send response
function withResponse(request, response) {

    //var path = __dirname +request.url;
    //
    //console.log(path);

    var path = __dirname + ( request.url == '/' ? '/index.html' : request.url );

    console.log(path);

    var extension = path.split('.').pop();

    console.log(extension);

    if (fs.existsSync(path)) {
        fs.readFile(path, function (error, content) {
            if (error) {
                response.writeHead(500);
                response.end();
            }
            else {
                console.log(createHeadersFor(extension))
                response.writeHead(200,createHeadersFor(extension));
                response.end(content , 'utf-8');
            }
        });
    } else {
        response.writeHead(404);
        response.end();
    }
}

//Create a server
var server = http.createServer(withResponse);

//Lets start our server
server.listen(port, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
});