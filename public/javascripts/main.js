let socket = io.connect();

socket.on('data', data => {
    console.log(data)
});

