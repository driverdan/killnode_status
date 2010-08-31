var actions = {
  // Save pending kills
  kills: {
    pending: {}
    ,attempts: 0
    ,success: 0
  }
  
  
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
    this.kills.pending[data.target_username] = player;
    this.kills.attempts++;
    
    return (player + ' is attempting to kill ' + data.target_username + '.');
  }
  
  ,kill: function(data) {
    var target = data.channel.split('/')[2];
    
    if (this.kills.pending[target]) {
      var player = this.kills.pending[target];
      delete this.kills.pending[target];
      
      data.success && this.kills.success++;
      
      return (player + (data.success ? " killed " : " failed to kill ") + target + ".");
    }
  }
};

exports.actions = actions;