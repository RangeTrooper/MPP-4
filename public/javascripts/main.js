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

function DeleteGuitar(id) {
    socket.emit('delete_guitar', id);
    /*$.ajax({
        url: "api/guitars/" + id,
        contentType: "application/json",
        method: "DELETE",
        xhrFields: {
            withCredentials: true
        },
        success: function (guitar_id) {
            if (guitar_id === undefined) {
                alert("Ошибка 401. Отказано в доступе. Авторизуйтесь, чтобы продолжить");
                showAuthButtons();
            }
            else{
                console.log(guitar_id);
                $("tr[data-rowid='" + guitar_id + "']").remove();
            }
        },
        error: function () {
            alert("Ошибка 401. Отказано в доступе. Авторизуйтесь, чтобы продолжить");
            showAuthButtons();
        }
    })*/
}

function logIn(login, password){
    socket.emit('login',login, password);
    //socket.emit('authentication', {username: login, password: password});
    /*$.ajax({
        url: "/api/login",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            login: login,
            password: password
        }),
        success: function () {
            hideAuthButtons(login);
            window.location.hash = "#main";
        }
    })*/
}
function addGuitar(model, amount, id, imageSrc) {
    if (imageSrc.length ===0)
        imageSrc = null;
    let data =[model, amount, id, imageSrc];
    socket.emit('add_guitar',data);
    /*$.ajax({
        url: "/api/guitars",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            model: model,
            amount: amount,
            id: id,
            imageSrc: imageSrc
        }),
        success: function (guitar) {
            $("#adding_form").find("input").val('');
            $("table tbody").append(row(guitar));
        }
    })*/
}

$("#adding_form").submit(function (e) {
    e.preventDefault();
    let model = this.elements["model"].value;
    let amountInStock = this.elements["amount"].value;
    let id = this.elements["guitar_id"].value;
    let imageSrc = this.elements["image"].value;;
    addGuitar(model, amountInStock,id,imageSrc)
});
/*
window.onload = function () {
    $.ajax({
        url: '/api/verify',
        type: "GET",
        success: function (res) {
            if (res)
                hideAuthButtons();
            else
                showAuthButtons();
        }
    });
};
*/

//GetGuitars();


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

function GetGuitars() {
    //socket.emit('get_guitars', )
    $.ajax({
        url: "/api/guitars",
        type: "GET",
        contentType: "application/json",
        success: function (guitars) {

            var rows = "";
            $.each(guitars, function (index, guitar) {
                rows += row(guitar);
            })
            $("table tbody").append(rows);
            $('#guitarTable').DataTable();
            $('.dataTables_length').addClass('bs-select');
            render(window.location.hash);
        }
    });
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
}