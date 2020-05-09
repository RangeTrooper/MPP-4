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