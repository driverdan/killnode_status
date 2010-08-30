/**
 * Remote NPC server for killnode.
 * Creates and manages NPCs using foursquare's API.
 */

require.paths.unshift(__dirname + "/lib");
require.paths.unshift(__dirname + "/lib/express/support");

var sys   = require('sys')
    ,connect = require('connect')
    ,express = require('express')
    ,Faye = require('./lib/faye-node')
    ,actions = require('./actions').actions;


// Set log level to see debug messages
//Faye.Logging.logLevel = 'debug';

// killnode URL for incoming messages
var serverUrl = 'http://killnode.com/faye';

/**
 * Web Server
 */

// Setup Express
var app = module.exports = express.createServer(
  express.logger(),
  express.cookieDecoder(),
  express.session()
);

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(connect.bodyDecoder());
	app.use(connect.gzip());
  app.use(connect.staticProvider(__dirname + '/static'));
  app.use(app.router);
});

app.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('404.ejs', {
      locals: { title : '404 - Not Found' }
    });
  } else {
    res.render('500.ejs', {
      locals: { 
        title : 'The Server Encountered an Error'
      }
    });
  }
});

var port = parseInt(process.env['PORT'] || 80);
app.listen(port);


/**
 * Rebroadcast game status
 */

var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(app);

var client = bayeux.getClient();


/**
 * Kill.Node client
 */
var knClient = new Faye.Client(serverUrl);

// Subscribe to all channels
knClient.subscribe('/client/**', function(msg) {
  var channel = msg.channel.split('/');
  
  if (channel.length > 2 && actions[channel[3]]) {
    var output = actions[channel[3]](msg);
    
    if (output) {
      var datetime = (new Date()).toString();
      console.log(datetime + ": " + output);
      client.publish("/game/updates", {date: datetime, update: output});
    }
  }
});

// Server routes
app.get('/', function(req, res) {
  res.render('index.ejs', {
    locals : {
      title: 'Rochester.js',
      params: {}
    }
  });
});


// Server errors / missing files

app.get('/500', function(req, res){
  throw new Error('This is a 500 Error');
});

app.get('/*', function(req, res) {
  throw new NotFound;
});

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port);
