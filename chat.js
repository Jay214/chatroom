$(function(){
    //登录
    //判断登录信息
    var socket = io('ws://localhost:8081');
    var username = null;
    $('.login-btn').click(function(){
        username = $.trim($('#loginName').val());
        if(username){
            socket.emit('login',{username:username});
        }else{
            alert('用户名为空');
        }
    })

    socket.on('loginSuccess',function(data){
        checkin();
    })
    function checkin(){
        $('.login').hide('slow');
        $('.chat-room').show('slow');
    }
    socket.on('loginFail',function(){
        alert('用户名重复');
    })
    socket.on('add',function(data){
        let html = '<p>系统消息：'+data.username+'已加入群聊</p>';
        $('.chat-icon').append(html);
    })
    $('.send-btn').click(function(){
        let text = $('#sendtxt').val();
        $('#sendtxt').val('');
        if(text){
            socket.emit('sendMessage',{username:username,message:text})
        }else{
            alert('不能发送空白信息');
        }
    })
    socket.on('receiveMessage',function(data){
        let html = null;
       if(data.username === username){
        html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">'+data.message+'</span></div>'
        $('.chat-icon').append(html)
       }else{
        html = '<div class="chat-item item-left clearfix rela"><span class="fl ads uname">'+data.username+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>'
        $('.chat-icon').append(html);
       }
    })
    socket.on('leave',function(name){
        let html = '<p>系统消息：'+name+'已离开群聊</p>';
        $('.chat-icon').append(html);
    })
})