$(function () {
    'use strict';
    var storage = {
        object: $("#storage"),
        originalhtml: $("#storage").html(),
        html: $("#storage").html(),
        objects: [],
        updatehtml: function () {
            this.object.html(this.html);
        },
        addpoint: function (point) {
            this.html = this.html + point;
            this.updatehtml();
            this.objects.push(point);
        },
        reset: function () {
            this.html = this.originalhtml;
        }
    };

    function createPoint(itemclass, position, width, height, bg, r, x, y) {
        var style = "position:" + position + ";left:" + x + "px;top:" + y + "px;width:" + width + ";height:" + height + ";background-color:" + bg + ";border-radius:" + r,
            html = "<div class=" + itemclass + " style=" + style + "></div>";
        return html;
    }

    function generatePoints() {
        storage.reset();
        for (var i = 0; i < 100; i++) {
            storage.addpoint(createPoint("point", 'absolute', "5px", "5px", "#000", "50%", Math.floor(Math.random() * ($(window).width() - 100)).toString(), Math.floor(Math.random() * ($(window).height() - 100)).toString()));
        }
    }
    setInterval(generatePoints, 100);
});
