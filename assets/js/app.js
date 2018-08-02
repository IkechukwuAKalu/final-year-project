let socket = null,
    user = null;

$(document).ready(() => {
    $('#enter_chat').on('click', (e) => {
        user = $('#username').val().trim();
        if (! user) return alert('Please enter a username');
        else toggleViews();
    });
    
    /**
     * This hides the username view and shows the chat view
     */
    function toggleViews() {
        $('#username_div').css('display', 'none');
        $('#chat_div').css('display', 'block');
        // set the username
        let u = `
        <img style='width:40px;' src='assets/images/user.png' />
        <b>${user}</b>`;
        $('#user').append(u);
        // Initialize the chat session
        initChat();
    } 
});

/**
 * This initializes the chat session and all that pertains to it
 * @param {String} user - the name of the user
 */
function initChat() {
    socket = io();

    socket.on('socket_message', showSocketEvent);

    socket.on('new_message', (data) => {
        let bg = data.sender === user ? 'green' : 'purple';
        if (data.spam) bg = 'red'; // give it a red background for spams
        let floatDiv = data.sender === user ? 'right' : 'left';
        let msgItem = `<div class='col-md-12 col-xs-12'>
            <div style='padding:5px 10px 5px 10px;background:${bg};color:#fff;border-radius:15px;margin-bottom:10px;float:${floatDiv};'>
                <p>
                    ${data.spam ? '<i style="font-size: 14px;"><-- spam detected --></i><br>': ''}
                    <span>${data.message}</span><br>
                    <i style='font-size:12px;float:right;padding:0px;'>- ${data.sender === user ? 'Me' : data.sender}</i>
                    <u class='text-center mark_spam' style='float:left;font-size:11px;cursor:pointer;'>${(data.spam ? '' : 'spam')}</u>
                    <u class='text-center mark_not_spam' style='float:left;font-size:11px;cursor:pointer;'>${(! data.spam ? '' : 'not spam')}</u>
                    <div style='clear:both;'></div>
                </p>
            </div>
        </div>`;
        $('#msgs_div').prepend(msgItem);

        // This has to be in the context of the defining function
        $('.mark_spam').on('click', markAsSpam);

        // This has to be in the context of the defining function
        $('.mark_not_spam').on('click', markAsHam);
    });

    $('#send_msg').on('click', sendMessage);
}

const showSocketEvent = (data) => {
    let msgItem = `<div class='col-md-12 col-xs-12'>
        <div style='padding:5px 10px 5px 10px;background:#f0f0f0;color:#000;margin-bottom:10px;text-align:center;'>
            <i style='font-size:12px;padding:5px;'> ${data.message}</i>
        </div>
    </div>`;
    $('#msgs_div').prepend(msgItem);
};

/**
 * This marks a message as spam by emiting a broadcast event to the server
 * @param {Object} e - the click listener event object
 */
const markAsSpam = (e) => {
    let message = e.target.parentElement.children[0].textContent.toString();
    socket.emit('mark_spam', { message });
    alert('Marked as spam :-(');
};

/**
 * This marks a message as NOT spam by emiting a broadcast event to the server
 * @param {Object} e - the click listener event object
 */
const markAsHam = (e) => {
    let message = e.target.parentElement.children[2].textContent.toString();
    socket.emit('mark_not_spam', { message });
    alert('Marked as a good message :-)');
};

/**
 * This sends a message
 * @param {Object} e - the click listener event object
 */
const sendMessage = (e) => {
    let message = $('#message').val().trim();
    $('#message').val(''); // clear the message input box
    if (! message) return alert('Enter a message');
    else socket.emit('send_message', { message, sender: user });
};