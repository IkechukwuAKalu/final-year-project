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

    socket.on('socket_message', (data) => {
        let msgItem = `<div class='col-md-12 col-xs-12'>
            <div style='padding:5px 10px 5px 10px;background:#f0f0f0;color:#000;margin-bottom:10px;text-align:center;'>
                <i style='font-size:12px;padding:5px;'> ${data.message}</i>
            </div>
        </div>`;
        $('#msgs_div').prepend(msgItem);
    });

    socket.on('new_message', (data) => {
        let bg = data.sender === user ? 'green' : 'purple';
        let floatDiv = data.sender === user ? 'right' : 'left';
        let msgItem = `<div class='col-md-12 col-xs-12'>
            <div style='padding:5px 10px 5px 10px;background:${bg};color:#fff;border-radius:15px;margin-bottom:10px;float:${floatDiv};'>
                <p>
                    <span>${data.msg}</span><br>
                    <i style='font-size:12px;float:right;padding:0px;'>- ${data.sender}</i>
                    <u class='text-center mark_spam' style='float:left;font-size:11px;cursor:pointer;'>mark as spam</u>
                    <div style='clear:both;'></div>
                </p>
            </div>
        </div>`;
        $('#msgs_div').prepend(msgItem);

        // This has to be in the context of the defining function
        $('.mark_spam').on('click', (e) => {
            let msg = e.target.parentElement.children[0].textContent.toString();
            alert(msg)
        });
    });

    $('#send_msg').on('click', (e) => {
        let msg = $('#message').val().trim();
        if (! msg) return alert('Enter a message');
        else socket.emit('send_message', { msg, sender: user });
    });
}