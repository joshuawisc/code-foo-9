var socket = io.connect();
var username;
var user;

$(function() {


    $('#div-username').hide();
    $('#div-chat').hide();
    console.log("js file");

    $('.btn-user').click(function() {
        console.log($(this).attr('id') == "user1");
        if ($(this).attr('id') == "user1") {
            socket.emit('user connected', {user: 1});
            user = 1;
        } else {
            socket.emit('user connected', {user: 2});
            user = 2;
        }
        $('#div-signin').hide();
        $('#div-username').show();
    });

    $('#btn-start').click(function() {
        $('#div-username').hide();
        $('#div-chat').show();
        username = $('#input-username').val();
        socket.emit('set username', {user: user, username: username});
    });


    socket.on('ret username', function(data) {
        username = data.username;
        $('#input-username').val(username);
        console.log(`username ${data.username} received`);
    });

});
