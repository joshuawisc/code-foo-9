var socket = io.connect();

$(function() {


    $('#div-username').hide();
    $('#div-chat').hide();
    console.log("js file");

    $('.btn-user').click(function() {
        console.log($(this).attr('id') == "user1");
        if ($(this).attr('id') == "user1")
            socket.emit('user connected', {user: 1});
        else
            socket.emit('user connected', {user: 2});
        $('#div-signin').hide();
        $('#div-username').show();
    });

    $('#btn-start').click(function() {
        $('#div-username').hide();
        $('#div-chat').show();
    });

    socket.on('check', function(data) {
        console.log(data);
        socket.emit('get event', {my: 'data'});
    });

});
