var express   = require('express'),
    app       = express(),
    path      = require('path'),
    router    = express.Router(),
    server    = require('http').createServer(app);
    io        = require('socket.io').listen(server);
    usercount =[];//保存所有在线用户

app.use(express.static(path.join(__dirname, 'public')));
server.listen(4001);
console.log('server started');

io.on('connection', function(socket) {
	  //接受消息事件

    socket.on('postMsg',function(msg) {
    	socket.broadcast.emit('newMsg', msg);//获取信息
  	});
    //接受图片消息
  	socket.on('sendImg',function(image){
  		socket.broadcast.emit('newImg', image);
  	});

    //接受幻灯片图片消息
    socket.on('postSlide',function(image){
      socket.broadcast.emit('slideImg', image);
      // console.log(image)
    })
    //统计用户量
    socket.on('stuCount',function(num){
      socket.userIndex = usercount.length;
      usercount.push(num);
      socket.broadcast.emit('system', usercount.length);
    })
    //断开连接的事件
    socket.on('disconnect', function() {
      //将断开连接的用户从usercount中删除
      usercount.splice(socket.userIndex, 1);
      //通知除自己以外的所有人
      socket.broadcast.emit('system', usercount.length);
    });
});
