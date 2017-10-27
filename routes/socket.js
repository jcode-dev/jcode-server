var Code = require('../models/code');
var mongoose = require('mongoose');
/**
 * Socket io チャット
 */

var numUsers = 0;
function onConnection(socket) {

  var addedUser = false;
  
    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });
  
    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
      if (addedUser) return;
  
      // we store the username in the socket session for this client
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    });
  
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });
  
    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });
  
    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
      if (addedUser) {
        --numUsers;
  
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
    
    function newdoc(json) {
      
      var code = new Code();
      //console.log(code._id);
      code = Object.assign(code, json);
      code.save(function(err) {
          if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
          }
          //console.log('User Registration succesful', code);    
          //console.log(code._id.valueOf());
          return;
      });
      return code._id;
    }
      
    // クライアントが　code を送信
    socket.on('send code', function (json) {
      if (json.xml) { // validate format
        var _id = newdoc(json);
        json._id = _id;
        //console.log(json._id);
        socket.emit('ack code', json);
        socket.broadcast.emit('ack code', json);
      }
      //console.log("send code");
    });

    // code の要求
    socket.on('req code', function (json) {
      var _id = json._id;
      Code.findOne({ '_id' : _id }, function(err, result) {
        //console.log("read", _id, result);
        socket.emit('recv code', result);
      });
    });
  }

module.exports.onConnection = onConnection;
