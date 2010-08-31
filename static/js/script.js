$(function() {
  var client = new Faye.Client('/faye', {timeout: 120})
      ,$updates = $("#updates");
  
  // Subscribe to all game updates
  client.subscribe('/game/updates', function(msg) {
    if (!$updates.find("ul").length) {
      $updates.html("<ul>");
    }
    
    var $ul = $updates.find("ul")
        ,$li = $('<li style="display:none"><strong>' + (new Date(msg.date)).toString() + ":</strong> " + msg.update + "</li>");
    
    $ul.prepend($li);
    $li.slideDown();
    
    // Prune list when it gets long
    if ($ul.find("li").length > 25) {
      $ul.find("li:last").slideUp(function() {
        $(this).remove();
      });
    }
  });
});