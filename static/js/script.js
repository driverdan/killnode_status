$(function() {
  Faye.Logging.logLevel = 'debug';
  var client = new Faye.Client('/faye', {timeout: 120});
  
  client.subscribe('/game/updates', function(msg) {
    if (!$("#updates ul").length) {
      $("#updates").html("<ul>");
    }
    
    var $li = $('<li style="display:none"><strong>' + msg.date + ":</strong> " + msg.update + "</li>");
    
    $("#updates ul").prepend($li);
    $li.slideDown();
    
    console.log("game update", msg);
  });
});