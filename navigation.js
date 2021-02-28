const sb = $(".sidebar");

$(document).ready(function () {
    loadFunc($(".func img").attr("func"));
});

$("*[func]").click(function () {
    loadFunc($(this).attr('func'));
});

function sbClickEv() {
    loadSect($(this).attr('sect'));
}

function loadFunc(f) {
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