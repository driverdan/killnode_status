$(function() {
  Faye.Logging.logLevel = 'debug';
  var client = new Faye.Client('/faye', {timeout: 120});
  
  client.subscribe('/game/updates', function(msg) {
    console.log("game update", msg);
  });
});