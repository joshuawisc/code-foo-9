let socket = io.connect();
let username;
let user;
let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let $oldMessage; // Store id of message that was previously on top to jump to it after loading older messages
let timeout;
let animTimeout;

$(function() {


    $('#div-chat').hide();

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

    $('#input-message').keydown(() => {
        socket.emit('typing', {username: user.username});
    });

    // Check if scrolled up and load new messages
    $('#board').scroll((e) => {
        let $board = $('#board');
        if ($board.scrollTop() == 0) {
            let time = $board.find('.time').first().attr('id').split(" ")[0];
            $board.children().first().remove(); // Remove username to prevent duplicates from showing
            $oldMessage = $board.children().first();
            socket.emit('get old messages', {time: time});
        }
    });

    // $('#btn-dark').click(() => {
    //      $("html").attr("style","--prim:#1B2631; --prim-light: #212F3C; --prim-lighter: #2E4053; --prim-lightest: #AEB6BF; --prim-dark: #2E4053");
    // });

    socket.on('ret user', (data) => {
        user = data.user;
        console.log(`user ${data.user.username} received`);
        socket.emit('get messages');
    });

    socket.on('ret message', (data) => {
        let fDate = getFormattedDate(new Date(data.time));
        // Check if sender of last message is different from current
        if ($('#board').children().last().find('.time').length == 0 || $('#board').children().last().find('.time').attr('id').split(" ")[1] != data.from.username) {
            if (data.from.username == user.username)
                $('#board').append(`<div class="username-display right">${data.from.username}</div>`);
            else
                $('#board').append(`<div class="username-display left">${data.from.username}</div>`);

        }
        if (data.text) {
            if (data.from.username == user.username)
                $('#board').append(`<div class="message right"><p class="text">${data.text}</p><p class="time" id="${data.time} ${data.from.username}">${fDate}</p></div>`);
            else
                $('#board').append(`<div class="message left"><p class="text">${data.text}</p><p class="time" id="${data.time} ${data.from.username}">${fDate}</p></div>`);
        }
        $('#board').children().last().click(showTime);
        let children = $('#board').children();
        console.log("scrollTop: " + $('#board').scrollTop());
        console.log("scrollHeight: " + $('#board')[0].scrollHeight);
        $('#board').scrollTop($('#board')[0].scrollHeight);

    });

    socket.on('ret old messages', (data) => {
        data.forEach(message => {
            if (!message.text)
                return;
            let fDate = getFormattedDate(new Date(message.time));
            let prevUsername = $('#board').find('.time').first().attr('id').split(" ")[1];
            if (prevUsername != message.from.username) {
                if (prevUsername == user.username)
                    $('#board').prepend(`<div class="username-display right">${prevUsername}</div>`);
                else
                    $('#board').prepend(`<div class="username-display left">${prevUsername}</div>`);

            }
            if (message.from.username == user.username)
                $('#board').prepend(`<div class="message right"><p class="text">${message.text}</p><p class="time" id="${message.time} ${message.from.username}">${fDate}</p></div>`);
            else
                $('#board').prepend(`<div class="message left"><p class="text">${message.text}</p><p class="time" id="${message.time} ${message.from.username}">${fDate}</p></div>`);

            $('#board').children().first().click(showTime);
        });

        // Display username for last message received
        let prevUsername = $('#board').find('.time').first().attr('id').split(" ")[1];
        if (prevUsername == user.username)
            $('#board').prepend(`<div class="username-display right">${prevUsername}</div>`);
        else
            $('#board').prepend(`<div class="username-display left">${prevUsername}</div>`);
        $('#board').scrollTop($oldMessage.offset().top - $('#board').offset().top + $('#board').scrollTop() - 30);
    });

    socket.on('user typing', data => {
        // TODO: show typing
        if ($('#div-typing').is(":visible")) {
            clearTimeout(timeout);
            $("#typing-username").text(data.username);
            timeout = setTimeout(function() {$('#div-typing').hide(200)} , 5000);
            return;
        }
        $('#div-typing').empty();
        $('#div-typing').append(`<p><span id="typing-username">${data.username}</span> is typing <span class="dot">.</span> <span class="dot">.</span> <span class="dot">.</span></p>`);
        $('#div-typing').show(200);
        animTimeout = setTimeout(animDots, 500, 0);
        timeout = setTimeout(function() {$('#div-typing').hide(200)} , 5000);
    });

});

function showTime(event) {
    if ($(event.target).attr('class') == 'text')
        $(event.target.parentNode).find(".time").toggle(200);
    else
        $(event.target).find(".time").toggle(200);
    // let children = $('#board').children();
    // $('#board').scrollTop(children.height()*children.length);
}

function animDots(index) {
    if (!$('#div-typing').is(":visible"))
        return;
    if (index == 3) {
        $('.dot').toggle();
        index = 0;
    }
    $('.dot').eq(index).toggle();
    animTimeout = setTimeout(animDots, 1000, index+1);
}

function getFormattedDate(date) {
    let minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getHours() + ":" + minutes;
}
