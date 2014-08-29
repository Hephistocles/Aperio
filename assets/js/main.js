$(document).ready(function() {

    function show(button) {
        button.text("Show Less");

        var boxToAnimate = button.next();

        boxToAnimate.html(boxToAnimate.data("full-html"));
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        var curHeight = boxToAnimate.height(),
            autoHeight = boxToAnimate.css('height', 'auto').height();
        boxToAnimate.height(curHeight).animate({
            height: autoHeight
        }, 'fast', function() {
            boxToAnimate.height("auto");
        });
        button.next().animate("height", "show");
        button.off("click").click(function() {
            hide(button);
        });
    }

    function hide(button) {
        button.text("Show More");
        var boxToAnimate = button.next();
        boxToAnimate.data("full-html", boxToAnimate.html());
        boxToAnimate.animate({
            height: "20px"
        }, 'fast', function() {
            boxToAnimate.text(boxToAnimate.text().substr(0, 50) + "...");

        });
        button.off("click").click(function() {
            show(button);
        });
    }
    $(".showhide-btn").each(function(i, btn) {
        hide($(btn));
    });
});

function vote(response_id, value) {
    $.ajax({
        type: "POST",
        url: "/api/vote",
        data: {response_id:response_id, value:value},
        success: function(result) {
            if (!result.success)
                alert("Could not add your vote");
        },
        dataType: "json"
    });
}