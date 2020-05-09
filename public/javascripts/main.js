let socket = io.connect();

socket.on('data', data => {
    console.log(data);
    let rows = "";
    $.each(data, function (index, guitar) {
        rows += row(guitar);
    });
    $("table tbody").append(rows);
    $('#guitarTable').DataTable();
    $('.dataTables_length').addClass('bs-select');
    render(window.location.hash);
});

socket.on('access_denied', () =>{
    alert("Ошибка 401. Отказано в доступе. Авторизуйтесь, чтобы продолжить");
    showAuthButtons();
});

socket.on('logged_in', (token, expiringTime) =>{
    document.cookie = "token" + '=' + token +"; expires=" + expiringTime;
    hideAuthButtons();
    window.location.hash = "#main";
});

socket.on('guitar_deleted', id =>{
    if (id === undefined) {
        alert("Ошибка 401. Отказано в доступе. Авторизуйтесь, чтобы продолжить");
        showAuthButtons();
    }
    else{
        console.log(id);
        $("tr[data-rowid='" + id + "']").remove();
    }
});

socket.on('login_error', () =>{
    alert("Ошибка входа. Проверьте введённые данные");
    reset();
});

socket.on('guitar_added', data =>{
    $("#adding_form").find("input").val('');
    $("table tbody").append(row(data));
});

window.onhashchange = function () {
    render(window.location.hash);
};

$("#login_form").submit(function (e) {
    e.preventDefault();
    let login = this.elements["login_input"].value;
    let password = this.elements["password_input"].value;
    logIn(login,password);
})

$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteGuitar(id);
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    return decodedCookie;
}

function DeleteGuitar(id) {
    let temp = getCookie("token");
    temp = temp.split('=')
    let token = temp[1]
    socket.emit('delete_guitar', id, token);
}

function logIn(login, password){
    socket.emit('login',login, password);
}

function logOut() {
    document.cookie = "token=; expires=" + "Thu, 01 Jan 1970 00:00:00 UTC";
}

function addGuitar(model, amount, id, imageSrc) {
    if (imageSrc.length ===0)
        imageSrc = null;
    let data =[model, amount, id, imageSrc];
    socket.emit('add_guitar',data);
}

$("#adding_form").submit(function (e) {
    e.preventDefault();
    let model = this.elements["model"].value;
    let amountInStock = this.elements["amount"].value;
    let id = this.elements["guitar_id"].value;
    let imageSrc = this.elements["image"].value;;
    addGuitar(model, amountInStock,id,imageSrc)
});

$("#li_logout").click(function () {
    logOut();
});

window.onload = function () {
    let temp = getCookie("token");
    temp = temp.split('=')
    let token = temp[1]
    socket.emit("verify", token);
};

function hideAuthButtons(){
    $("#li_login").hide();
    $("#li_register").hide();
    $("#li_logout").show();
}

function showAuthButtons() {
    $("#li_login").show();
    $("#li_register").show();
    $("#li_logout").hide();
}

function render(hashKey) {
    let pages = document.querySelectorAll(".page");
    for (let i = 0; i < pages.length; ++i) {
        pages[i].style.display = 'none';
    }

    let navLis = document.querySelectorAll(".navLis");
    for (let i = 0; i < navLis.length; ++i) {
        navLis[i].classList.remove("active");
    }

    switch (hashKey) {
        case "":
            pages[0].style.display = 'block';
            document.getElementById("li_main").classList.add("active");
            break;
        case "#main":
            pages[0].style.display = 'block';
            document.getElementById("li_main").classList.add("active");
            break;
        case "#register":
            pages[1].style.display = 'block';
            document.getElementById("li_register").classList.add("active");
            break;
        case "#login":
            pages[2].style.display = 'block';
            document.getElementById("li_login").classList.add("active");
            break;
        case "#adding":
            pages[3].style.display = 'block';
            document.getElementById("li_adding").classList.add("active");
            break;
        default:
            pages[0].style.display = 'block';
            document.getElementById("li_main").classList.add("active");
    }
}

function reset() {
    $("form").reset();
}

let row = function (guitar) {
    let img_src;
    if (guitar.img_src === 'NULL' || guitar.img_src == null)
        img_src = "no_image_found.png";
    else
        img_src = guitar.img_src;
    return "<tr data-rowid='" + guitar.guitar_id + "'><td><img style='max-width: 170px' class='img-thumbnail' src='" + img_src + "' ></td><td>" + guitar.guitar_id + "</td>" +
        "<td>" + guitar.guitar_name + "</td> <td>" + guitar.amount_in_stock + "</td>" +
        "<td><a class='editLink btn btn-info' data-id='" + guitar.guitar_id + "'>Изменить</a> | " +
        "<a class='removeLink btn btn-danger' data-id='" + guitar.guitar_id + "'>Удалить</a></td></tr>";
};

async function uploadFile(input) {
    let formData = new FormData();
    formData.append("file", input.files[0]);
    await fetch('/api/upload',{method: "POST", body: formData});
}