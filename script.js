$(function () {
    'use strict';
    var scrollY, jumbotronEnd, gradTransparency, gradTransparency2;
    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
        return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };
    $(window).scroll(function () {
        scrollY = $(window).scrollTop();
        jumbotronEnd = $("#jumbotron").height() + $("nav").height();
        gradTransparency = Math.floor(Math.max(jumbotronEnd - scrollY, 0).map(0, jumbotronEnd, 0, 255));
        gradTransparency2 = Math.floor(Math.max(jumbotronEnd - scrollY, 0).map(0, jumbotronEnd, 0, 127));
        $("#jumbotron").css("background", "linear-gradient(to right, #ff00ff" + gradTransparency.toString(16) + ", #0000ff" + gradTransparency2.toString(16) + ", transparent), url(Images/homebanner.png) no-repeat center center fixed");
        $("#jumbotron").css("-webkit-background-size", "cover");
        $("#jumbotron").css("-moz-background-size", "cover");
        $("#jumbotron").css("-o-background-size", "cover");
        $("#jumbotron").css("background-size", "cover");
    });

});
