let socket = io.connect();
let username;
let user;
let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let $oldMessage; // Store id of message that was previously on top to jump to it after loading older messages

$(function() {


    //$('#div-username').hide();
    $('#div-chat').hide();
    //console.log("js file");

    // $('.btn-user').click((e) => {
    //     console.log(e.target.id);
    //     if (e.target.id == "user1") {
    //         socket.emit('user connected', {user: 1});
    //         user = 1;
    //     } else {
    //         socket.emit('user connected', {user: 2});
    //         user = 2;
    //     }
    //     $('#div-signin').hide();
    //     $('#div-username').show();
    // });

    $('#btn-start').click(() => {
        username = $('#input-username').val();
        socket.emit('sign in', {username: username});
        $('#div-username').hide();
        $('#div-chat').show();
    });

    $('#btn-send').click(function() {
        let message = $('#input-message').val();
        if (message.trim() == "")
            return;
        socket.emit('send message', {from: user, text: message});
        $('#input-message').val("");
    });

    // Send message if enter is pressed in message box
    $('#input-message').keypress((e) => {
        if (e.which == 13) {
            $('#btn-send').trigger('click');
        }
    });

    // Check if scrolled up and load new messages
    $('#board').scroll((e) => {
        let $board = $('#board');
        console.log($board.scrollTop());
        if ($board.scrollTop() == 0) {
            let time = $board.children().first().find('.time').attr('id')
            console.log(time);
            $oldMessage = $board.children().first();
            socket.emit('get messages', {time: time});
        }
    });

    // $('#btn-dark').click(() => {
    //      $("html").attr("style","--prim:#1B2631; --prim-light: #212F3C; --prim-lighter: #2E4053; --prim-lightest: #AEB6BF; --prim-dark: #2E4053");
    // });

    socket.on('ret user', (data) => {
        user = data.user;
        console.log(`user ${data.user} received`);
    });

    socket.on('ret message', (data) => {
        console.log(data);
        let fDate = getFormattedDate(new Date(data.time));
        if (data.text) {
            if (data.from.username == user.username)
                $('#board').append(`<div class="message right"><p class="text">${data.text}</p><p class="time" id="${data.time}">${fDate}</p></div>`);
            else
                $('#board').append(`<div class="message left"><p class="text">${data.text}</p><p class="time" id="${data.time}">${fDate}</p></div>`);
        }
        $('#board').children().last().click(showTime);
        let children = $('#board').children();
        $('#board').scrollTop(children.height()*children.length);

    });

    socket.on('ret old messages', (data) => {
        //console.log(data);
        data.forEach(message => {
            if (!message.text)
                return;
            let fDate = getFormattedDate(new Date(message.time));
            if (message.text) {
                if (message.from.username == user.username)
                    $('#board').prepend(`<div class="message right"><p class="text">${message.text}</p><p class="time" id="${message.time}">${fDate}</p></div>`);
                else
                    $('#board').prepend(`<div class="message left"><p class="text">${message.text}</p><p class="time" id="${message.time}">${fDate}</p></div>`);
            }
            $('#board').children().first().click(showTime);
        });
        //console.log($oldMessage);
        $('#board').scrollTop($oldMessage.offset().top - $('#board').offset().top + $('#board').scrollTop());
    });

});

function showTime(event) {
    console.log($(event.target));
    $(event.target.parentNode).find(".time").toggle(200);
    // let children = $('#board').children();
    // $('#board').scrollTop(children.height()*children.length);
}

function getFormattedDate(date) {
    let minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getHours() + ":" + minutes;
}
