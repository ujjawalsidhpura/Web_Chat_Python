async function add_messages(msg, scroll) {

    if (typeof msg.name !== "undefined") {
        const date = dateNow();

        if (typeof msg.time !== "undefined") {
            const n = msg.time;
        } else {
            const n = date;
        }
        const global_name = await load_name();

        let content =
            '<div class="container">' +
            '<b style="color:#000" class="right">' +
            msg.name +
            "</b><p>" +
            msg.message +
            '</p><span class="time-right">' +
            n +
            "</span></div>";

        if (global_name == msg.name) {
            content =
                '<div class="container darker">' +
                '<b style="color:#000" class="left">' +
                msg.name +
                "</b><p>" +
                msg.message +
                '</p><span class="time-left">' +
                n +
                "</span></div>";
        }

        // Update Div
        let messageDiv = document.getElementById("messages");
        messageDiv.innerHTML += content;

    }

    if (scroll) {
        scrollSmoothToBottom("messages");
    }
}

async function load_name() {

    return await fetch("/get_name")
        .then(async function (res) {
            return await res.json();
        })
        .then(function (text) {
            return text["name"];
        });

}

async function load_messages() {

    return await fetch("/get_messages")
        .then(async function (res) {
            return await res.json();
        })
        .then(function (text) {
            console.log(text);
            return text;
        });

}

$(function () {

    $(".msgs").css({ height: $(window).height() * 0.7 + "px" });

    $(window).bind("resize", function () {
        $(".msgs").css({ height: $(window).height() * 0.7 + "px" });
    });

});

function scrollSmoothToBottom(id) {

    const div = document.getElementById(id);

    $("#" + id).animate(
        {
            scrollTop: div.scrollHeight - div.clientHeight,
        },
        500
    );

}

function dateNow() {

    const date = new Date();
    const yyyy = date.getFullYear();
    const dd = date.getDate();
    const mm = date.getMonth() + 1;

    (dd < 10) ? dd = "0" + dd : '';

    (mm < 10) ? mm = "0" + mm : '';

    const cur_day = yyyy + "-" + mm + "-" + dd;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    (hours < 10) ? hours = "0" + hours : '';

    (minutes < 10) ? minutes = "0" + minutes : '';

    (seconds < 10) ? seconds = "0" + seconds : '';

    return cur_day + " " + hours + ":" + minutes;
}

const socket = io.connect("http://" + document.domain + ":" + location.port);

socket.on("connect", async function () {

    const usr_name = await load_name();

    if (usr_name != "") {

        socket.emit("event", {
            message: usr_name + " just connected to the server!",
            connect: true,
        });

    }

    const form = $("form#msgForm").on("submit", async function (e) {
        e.preventDefault();

        // get input from message box
        let msg_input = document.getElementById("msg");
        let user_input = msg_input.value;
        let user_name = await load_name();

        // clear msg box value
        msg_input.value = "";

        // send message to other users
        socket.emit("event", {
            message: user_input,
            name: user_name,
        });
    });

});

socket.on("disconnect", async function () {
    const usr_name = await load_name();

    socket.emit("event", {
        message: usr_name + " just left the server...",
    });
});

socket.on("message response", function (msg) {
    add_messages(msg, true);
});

window.onload = async function () {
    const msgs = await load_messages();

    for (let i = 0; i < msgs.length; i++) {
        scroll = false;

        if (i == msgs.length - 1) {
            scroll = true;
        }
        add_messages(msgs[i], scroll);
    }

    let name = await load_name();

    if (name !== "") {
        $("#login").hide();
    } else {
        $("#logout").hide();
    }

};
