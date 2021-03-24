/*

**** DATA ****

 */

const funcContainer = $(".functions");
const sidebar = $(".sidebar");
const loadBar = $(".load-bar");
const home = $(".home");

const defaultClr = $("html").css("--theme");
let data;
let colors;

let func, sect;

/*

**** START ****

 */

history.scrollRestoration = "manual";

if(localStorage.getItem("theme") !== "")
    $("html").css("--theme", localStorage.getItem("theme"));

$.get("res/colors.json", function (d) {
    colors = d;
});

loading();

$.ajax({
    type: "GET",
    url: "func/data.json",
    success: function (d) {
        data = d;

        if(url.query["func"] !== undefined) {
            loadFuncContent(url.query["func"], url.query["sect"]);
        }

        loadFunctions();

        loaded();
    }
});

/*

**** FUNCTIONS ****

 */

function loadFunctions() {
    funcContainer.html("");

    for(let k in data) {
        let v = data[k];

        if(v.hide)
            continue;

        let desc = "";
        let count = 0;
        for(let k2 in v.pages) {
            if(desc.length < 30) {
                desc += v.pages[k2] + ", ";
                count++;
            }
        }

        if(count === Object.keys(v.pages).length)
            desc = desc.slice(0, -2);
        else
            desc += "...";

        funcContainer.append(
            $("<div class='card clickable'></div>").attr("func", k).append(
                $("<div class='img'></div>").css("--img", `url('res/img/${v.img}')`)
            ).append(
                $("<div class='data'></div>").append(
                    $("<p class='title'></p>").html(v.title)
                ).append(
                    $("<p class='desc'></p>").html(desc)
                )
            )
        );
    }
}

function loadFuncContent(f, lS) {
    func = f;

    if (f == "") {
        home.removeClass("hide");
        return;
    }

    home.addClass("hide");

    $(".sidebar .home_title .title").html(data[f].title);

    sidebar.children(".list").html("");

    for (let k in data[f].pages) {
        sidebar.children(".list").append(
            $("<p class='element clickable'></p>").attr("sect", k).html(data[f].pages[k])
        );
    }

    if(window.innerWidth > 746) {
        if (typeof (lS) === "string")
            loadSectContent(lS);
        else {
            loadSectContent(Object.keys(data[f].pages)[0]);
        }
    }
}

function loadSectContent(s) {
    sect = s;

    loading();

    $.ajax({
        url:`func/${s}.html`,
        type: "GET",
        success: function (html) {
            $(".content .title").html(data[func].pages[s]);
            $(".sect").html($(html).html());
            $(".sidebar").addClass("hide700");
            $(".sidebar .element").removeClass("sel");
            $(`.sidebar .element[sect=${s}]`).addClass("sel");

            loaded();
        },
        error: function () {
            if(func != "") {
                loadSectContent(Object.keys(data[func].pages)[0]);
            } else
                loaded();
        }
    });
}

function loading() {
    loadBar.addClass("anim");
}

function loaded() {
    loadBar.removeClass("anim");
}

function atHome() {
    home.removeClass("hide");
    $(".content .title, .sect").html("");
}

function getSup(nr) {
    let n = nr.toString();
    let r = "";

    for(let i = 0; i < n.length; i++) {
        switch (n.charAt(i)) {
            case '0':
                r += '⁰'; break;
            case '1':
                r += '¹'; break;
            case '2':
                r += '²'; break;
            case '3':
                r += '³'; break;
            case '4':
                r += '⁴'; break;
            case '5':
                r += '⁵'; break;
            case '6':
                r += '⁶'; break;
            case '7':
                r += '⁷'; break;
            case '8':
                r += '⁸'; break;
            case '9':
                r += '⁹'; break;
        }
    }

    return r;
}

function setCookie(k, v, d) {
    document.cookie = `${k}=${v};expires=${d.toUTCString()}`;
}

/*

**** EVENTS ****

 */

$(document).on("click", "*[func]", function () {
    loadFuncContent($(this).attr("func"));
});

$(document).on("click", "*[sect]", function () {
    loadSectContent($(this).attr("sect"));
});

$(document).on("keypress", "input[root]", function (e) {
    let t = $(this);

    setTimeout(function (){
        t.val(t.val().replace("/", "√"));
    }, 0);
});

$(document).on("click", ".checkbox", function (e) {
    let t = $(this);

    if(!t.hasClass("disabled"))
        t.toggleClass("checked");
    else
        e.preventDefault();
});

$(document).on("focusout", "input[type=number]", function () {
    let t = $(this);
    let min = t.attr("min");
    let max = t.attr("max");

    if(min !== undefined)
        if(parseInt(t.val()) < parseInt(min))
            t.val(min);

    if(max !== undefined)
        if(parseInt(t.val()) > parseInt(max))
            t.val(max);
});