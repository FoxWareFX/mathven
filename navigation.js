const sb = $(".sidebar");

$(document).ready(function () {
    let val = getQuery();

    if(val.hasOwnProperty("func")) {
        if(val.hasOwnProperty("sect"))
            loadFunc(val["func"], val["sect"]);
        else
            loadFunc(val["func"]);
    } else
        loadFunc($(".func img").attr("func"));
});

function getQuery() {
    let query = decodeURIComponent(window.location.href).split("?");

    if(query <= 1)
        return ;

    query = query.slice(1).join("&");

    let req = query.split("&");
    let val = { };

    req.forEach(function (x) {
        let spl = x.split("=");

        if(spl.length > 1)
            val[spl[0].trim()] = spl[1].trim();
        else
            val[spl[0].trim()] = null;
    });

    return val;
}

$("*[func]").click(function () {
    loadFunc($(this).attr('func'));
});

function sbClickEv() {
    loadSect($(this).attr('sect'));
}

function loadFunc(f, lS) {
    $.get("func/data.json", function (data) {
        sb.html("");

        let actions = [];
        $.each(data[f], function (i, v) {
            $.ajax({
                async: false,
                type: "GET",
                url: "func/" + v + ".html",
                success: function(html) {
                    actions.push(sb.append($("<p></p>").html($(html).attr("title")).attr("sect", v)));
                }
            });
        });

        $.when.apply($, actions).done(function () {
            $("*[sect]").click(sbClickEv);
        });

        if(typeof lS === "string")
            loadSect(lS);
        else
            loadSect(data[f][0]);
    }, "json");
}

function loadSect(s) {
    $.ajax({
        async: false,
        type: "GET",
        url: "func/" + s + ".html",
        success: function (html) {
            $(".sidebar *").removeClass("bold");
            $(".sidebar *[sect = " + s + "]").addClass("bold");
            $(".title").html($(html).attr("title"));
            $(".sector").html($(html).html());
        }
    });
}