var socket = io.connect();
var username;
var user;

$(function() {


    $('#div-username').hide();
    //$('#div-chat').hide();
    console.log("js file");

    $('.btn-user').click((e) => {
        console.log(e.target.id);
        if (e.target.id == "user1") {
            socket.emit('user connected', {user: 1});
            user = 1;
        } else {
            socket.emit('user connected', {user: 2});
            user = 2;
        }
        $('#div-signin').hide();
        $('#div-username').show();
    });

    $('#btn-start').click(() => {

        username = $('#input-username').val();
        socket.emit('set username', {user: user, username: username});
        $('#div-username').hide();
        $('#div-chat').show();
    });

    $('#btn-send').click(function() {
        let message = $('#input-message').val();
        if (message.trim() == "")
            return;
        let to;
        if (user == 1)
            to = 2;
        else
            to = 1;
        socket.emit('send message', {from: user, to: to, text: message});
    });


    socket.on('ret username', (data) => {
        username = data.username;
        $('#input-username').val(username);
        console.log(`username ${data.username} received`);
    });

    socket.on('ret message', (data) => {
        //console.log(data);
        if (data.text)
            $('#board').append(`<p class="message">${data.text}</p><br/>`);
        let children = $('#board').children();
        $('#board').scrollTop(children.height()*children.length);
        console.log(children.height()*children.length);

    });

});
