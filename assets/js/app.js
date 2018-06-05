$(document).ready(() => {
    $('#enter_chat').on('click', (e) => {
        let username = $('#username').val().trim();
        if (! username) return alert('Please enter a username');
        else toggleViews(username);
    });
    
    /**
     * This hides the username view and shows the chat view
     */
    function toggleViews(user) {
        $('#username_div').css('display', 'none');
        $('#chat_div').css('display', 'block');
        // set the username
        let u = `
        <img src='assets/images/user.png' />
        <b>${user}</b>`;
        $('#user').append(u);
        initChat(user);
    } 
});

function initChat(user) {
    const socket = io();

    socket.on('new_message', (data) => {
        let bg = data.sender === user ? 'green' : 'purple';
        let msgItem = `
            <div style='padding:5px 10px 5px 10px;background:${bg};color:#fff;border-radius:15px;margin-bottom:10px;'>
                <p>
                    ${data.msg}<br>
                    <i style='font-size:12px;float:right;padding:0px;'>- ${data.sender}</i>
                    <u class="text-center mark_spam" style='float:left;font-size:11px;cursor:pointer;'>mark as spam</u>
                    <div style='clear:both;'></div>
                </p>
            </div>`;
        $('#msgs_div').prepend(msgItem);
    });

    $('#send_msg').on('click', (e) => {
        let msg = $('#message').val().trim();
        if (! msg) return alert('Enter a message');
        else socket.emit('send_message', { msg, sender: user });
    });

    $('.mark_spam').on('click', (e) => {
        console.log(e)
    });
}