var actions = {
  // Save pending kills
  pendingKills: {}
  
  // Player connects
  ,initialize: function (data) {
    return (data.username + ' has connected.');
  }
  
  // Player updates their location
  ,updatesource: function(data) {
    return (data.username + ' updated their location.');
  }
  
  // Player has attempted to kill a target
  ,killattempt: function(data) {
    var player = data.channel.split('/')[2];
    
    // Save the kill
    this.pendingKills[data.target_username] = player;
    
    return (player + ' is attempting to kill ' + data.target_username + '.');
  }
  
  ,kill: function(data) {
    var target = data.channel.split('/')[2];
    
    if (this.pendingKills[target]) {
      var player = this.pendingKills[target];
      delete this.pendingKills[target];
      
      return (player + (data.success ? " killed " : " failed to kill ") + target + ".");
    }
  }
};

exports.actions = actions;