
/*
**author@linjunjian
*time@2016-9
*/
var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(8081);
console.log('app is listen at 8081');
var users = [];
io.on('connection',function(socket){
    var isNewperson = true;
    var username = null;
    socket.on('login',function(data){
        for(let i = 0; i<users.length;i++){
            if(data.username === users[i]){
                 isNewperson = false;
            }else{
                isNewperson = true;
            }
        }
        if(isNewperson){
             username = data.username;
            users.push(data.username);
            socket.emit('loginSuccess',data);
            io.sockets.emit('add',data);
        }else{
            socket.emit('loginFail','');
        }

    })

    socket.on('sendMessage',function(data){
        io.sockets.emit('receiveMessage',data);
    })
    socket.on('disconnect',function(){
        users.map(function(val,index){
          if(users[index] === username){
              users.map(function(val,index){
                  users.splice(index,1);
              })
          }
        })
        io.sockets.emit('leave',username);
    })
})