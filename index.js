const http = require('http');
const url = require('url');

//----HandleRoutes------

const handleRoutes = {};

//hello handler
handleRoutes.hello = (data, cb) =>{
    cb(200, {message: 'hello world'});
};

//default handler
handleRoutes.defaultHandler = (data, cb) =>{
    cb(404, {message: 'not found'});

};

//-----------------------



//----Routes------
//map trimmedPath to handlers
const routes = {
    'hello': handleRoutes.hello
};
//----------------


//-------Handle Request-----------
const handleRequest = function (req, res){
    
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    

    let currentRouteHandler;
    if (routes.hasOwnProperty(trimmedPath)){
        currentRouteHandler = routes[trimmedPath];
    }else{
        currentRouteHandler = handleRoutes.defaultHandler;
    }

    const data = {
        query,
        trimmedPath
    };

    currentRouteHandler(data, (statusCode, payload) =>{
        if (typeof(statusCode) !== 'number'){
            statusCode = 200;
        }

        if (typeof(payload) !== 'object'){
            payload = {};
        }

        res.setHeader('Content-Type', 'application-json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(payload));
    });

}

//---------------------------------



//create and start server
const server = http.createServer(handleRequest).listen(3000);
