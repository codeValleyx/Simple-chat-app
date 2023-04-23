const socket= io();

socket.on("connect", ()=>{
    console.log(socket.id);
});

let thisUser;

$(()=>{
    $('#signUpDetails').hide();
    $('#signInDetails').hide();
    $('#display').hide();
    
    $('#chooseSignUp').click(()=>{
        $('.connect').hide();
        $('#signUpDetails').show();
    });
    $('#chooseSignIn').click(()=>{
        $('.connect').hide();
        $('#signInDetails').show();
    });

    socket.on("newUser", (data)=>{
        $("#users").append("<option>").text(`${data.name}`);
    })

    $("#set").click(()=>{
        const username= $("#setUsername").val();
        const password= $("#setPassword").val();

        socket.emit("userSet", {username, password});
    });
    socket.on("setFailed", (data)=>{
        $("#setPassword").val("");
        $("#setUsername").val("");
        alert(`${data.username} already exists. Please use other name.`);
    });
    socket.on("setSucceed", (data)=>{
        $('#signUpDetails').hide();
        $('#display').show();
        $("#currentUser").text(`I am ${data.username}`);
        thisUser= data.username;
        document.getElementById("username").innerText= data.username;
    });
    socket.on("listUsers", (data)=>{
        if(data.added)
            if(data.added==thisUser)
                $("#msgBox").append($("<h5>").text(`---- You joined the chat ----`));
            else
                $("#msgBox").append($("<h5>").text(`---- ${data.added} joined the chat ----`));


        let selectUsers= document.getElementById("users");
        selectUsers.innerHTML="";
        let all= document.createElement("option");
        all.innerText= "All";
        all.setAttribute("value", "All");
        selectUsers.append(all);

        for(let user of data.names){
            if(user==thisUser)  continue;
            
            let new_= document.createElement("option");
            new_.innerText= user;
            new_.setAttribute("value", user);
            selectUsers.append(new_);
        }
    });
    $("#check").click(()=>{
        const username= $("#username").val();
        const password= $("#password").val();

        socket.emit("userCheck", {username, password});
    });
    socket.on("checkFailed", (data)=>{
        alert("Username or Password invalid.");
    });
    socket.on("checkSucceed", (data)=>{
        $('#signInDetails').hide();
        $('#display').show();
        $("#currentUser").text(`I am ${data.username}`);
    });

    $("#sendMsg").click(()=>{
        let to= $("#users").val();
        let msg= $("#msg").val();

        socket.emit("msg_send", {to, msg});
    });

    socket.on("msg_rcvd", (data)=>{
        let msgBox= $("#msgBox");
        let new_chat= $("<li>");
        if(data.to=='All'){
            if(data.from == thisUser){
                new_chat.html("<b>[You to all]</b> "+data.msg);
            }
            else{
                new_chat.html(`<b>[${data.from} to all]</b> `+data.msg);
            }
        }
        else{
            if(data.from == thisUser){
                new_chat.html(`<b>[You to ${data.to}]</b> `+data.msg);
            }
            else{
                new_chat.html(`<b>[${data.from} to You]</b> `+data.msg);
            }
        }

        msgBox.append(new_chat);
    })

});