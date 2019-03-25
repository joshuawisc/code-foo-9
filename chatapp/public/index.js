let socket = io.connect();
let username;
let user;
let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let $oldMessage; // Store id of message that was previously on top to jump to it after loading older messages
let timeout; // Store timeout of typing indicator
let animTimeout; // Store timeout for dots animation

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

    // Typing indicator
    $('#input-message').keydown(() => {
        socket.emit('typing', {username: user.username});
    });

    // Check if scrolled to the top and load new messages
    $('#board').scroll((e) => {
        let $board = $('#board');
        if ($board.scrollTop() == 0) {
            let time = $board.find('.time').first().attr('id').split(" ")[0];
            $board.children().first().remove(); // Remove username to prevent duplicates from showing
            $oldMessage = $board.children().first();
            socket.emit('get old messages', {time: time});
        }
    });

    socket.on('ret user', (data) => {
        user = data.user;
        socket.emit('get messages');
    });

    // Receive message from server and display
    socket.on('ret message', (data) => {
        let fDate = getFormattedDate(new Date(data.time));
        // Check if sender of last message is different from current and display username if true
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

        // Scroll down to new message
        $('#board').scrollTop($('#board')[0].scrollHeight);

    });


    // Receive old message form server and display
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

    // Receive typing indicator from server
    socket.on('user typing', data => {
        // If there is currently an indicator, change the username and extend the time
        if ($('#div-typing').is(":visible")) {
            clearTimeout(timeout);
            $("#typing-username").text(data.username);
            timeout = setTimeout(function() {$('#div-typing').hide(200)} , 5000);
            return;
        }
        $('#div-typing').empty();
        $('#div-typing').append(`<p><span id="typing-username">${data.username}</span> is typing <span class="dot">.</span> <span class="dot">.</span> <span class="dot">.</span></p>`);
        $('#div-typing').show(200);

        // Animate the dots in the typing indicator
        animTimeout = setTimeout(animDots, 500, 0);
        timeout = setTimeout(function() {$('#div-typing').hide(200)} , 5000);
    });

});

// Toggles time, called when message is clicked
function showTime(event) {
    if ($(event.target).attr('class') == 'text')
        $(event.target.parentNode).find(".time").toggle(200);
    else
        $(event.target).find(".time").toggle(200);
}

// Function to animate dots
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

// Returns date in desired format
function getFormattedDate(date) {
    let minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getHours() + ":" + minutes;
}
