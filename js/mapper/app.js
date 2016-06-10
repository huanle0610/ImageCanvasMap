$(document).ready(function() {
    function keyMap(){
        $.vi = '';
        $("body").keydown(function(event){
            if(-1 !== $.inArray(event.target.nodeName, ['INPUT', 'TEXTAREA'])){
                return;
            }
            switch(event.keyCode){
                case 27: //esc
                    $('.stop').click();
                    $.vi='normal';
                    break;
                case 46: //delete
                    if(!$.imageMapper.current){
                        console.log('please selected these items which you want delete first.');
                        return;
                    }
                    if(confirm('Delete the selected?')){
                        $('#remove').click();
                    }
                    break;
                case 187: //+
                    if($('.stop.selected').length){
                        $('#plus').click();
                    }
                    break;
                case 189: //-
                    if($('.stop.selected').length){
                        $('#minus').click();
                    }
                    break;
                case 82: //r
                    if($('.stop.selected').length){
                        $('#rect').click();
                    }
                    break;
                case 67: //c
                    if($('.stop.selected').length){
                        $('#circle').click();
                    }
                    break;
                case 80: //p
                    if($('.stop.selected').length){
                        $('#poly').click();
                    }
                    break;
                /* case 73: //i
                 case 79: //o
                 case 65: //a
                 $.vi='insert';
                 break;*/
            }
        })
    }
    function clearCanvas() {
        if ($("#droparea canvas").length) {
            $(".canvas_info, #dashboard, #image-params").addClass("hidden");
            $.each($("#droparea canvas"), function(a, b) {
                var c = b.getContext("2d");
                c.clearRect(0, 0, b.width, b.height)
            });
            $("#drop_wrap").css({width: "216px",height: "244px"});
            c.css({width: "200px",height: "200px",left: "0px"})
        }
    }
    function nqrst(a) {
        var a = a || false;
        var rect_shape = $("#rect_shape"), circle_shape = $("#circle_shape"), poly_shape = $("#poly_shape"), empty_shape = $("#empty_shape");
        var f = empty_shape[0].getContext("2d");
        var g = rect_shape[0].getContext("2d");
        var h = circle_shape[0].getContext("2d");
        var i = poly_shape[0].getContext("2d");
        $.imageMapper.clearCanvas(rect_shape[0], g);
        $.imageMapper.clearCanvas(circle_shape[0], h);
        $.imageMapper.clearCanvas(poly_shape[0], i);
        var j = $(".start").width();
        var k = $(".start").height();
        var l = $.imageMapper.colors[0].replace(/1/ig, "0.8");
        var m = "#909090";
        var n = "rgba(90, 90, 90, .4)";
        $(".shapes").attr({width: j + "px",height: k + "px"});
        var o = rect_shape.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawRect(g, {x: 4,y: 4}, {x: j - 4,y: k - 4}, l, 2, o);
        o = circle_shape.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawCircle(h, {x: j / 2,y: k / 2}, j / 2 - 4, l, 2, o);
        var p = [{x: 4,y: 4}, {x: j / 2,y: k / 2 - 4}, {x: j - 4,y: 4}, {x: j - 4,y: k - 4}, {x: j / 2,y: k / 2 + 4}, {x: 4,y: k - 4}];
        o = poly_shape.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawPoly(i, p, l, 2, o);
        p = [{x: 8,y: 8}, {x: 8,y: 24}, {x: 12,y: 18}, {x: 36,y: 42}, {x: 42,y: 36}, {x: 18,y: 12}, {x: 22,y: 8}];
        o = empty_shape.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawPoly(f, p, "#777", 2, o);
        if (a) {
            var q = $("#pencil_color"), r = $("#rubber"), s = $("#zoom_plus"), t = $("#zoom_minus");
            var u = q[0].getContext("2d");
            var v = r[0].getContext("2d");
            var w = s[0].getContext("2d");
            var x = t[0].getContext("2d");
            $.imageMapper.clearCanvas(q[0], u);
            $.imageMapper.clearCanvas(s[0], w);
            $.imageMapper.clearCanvas(t[0], x);
            $.imageMapper.clearCanvas(r[0], v);
            $(".control").attr({width: j + "px",height: k + "px"});
            l = $.imageMapper.colors[0].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 2,y: k / 2}, j / 4, l, 1, o);
            l = $.imageMapper.colors[1].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 6,y: k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[2].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: 5 * j / 6,y: k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[3].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 6,y: 5 * k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[4].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: 5 * j / 6,y: 5 * k / 6}, j / 8, l, 1, o);
            l = s.parent().hasClass("selected") ? "#111" : "#444";
            o = s.parent().hasClass("selected") ? n : m;
            $.imageMapper.drawCircle(w, {x: j / 3,y: k / 3}, j / 4, l, 2, o);
            $.imageMapper.drawLine(w, {x: j / 2,y: k / 2}, {x: 6 * j / 7 + 1,y: 6 * k / 7 + 1}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 2,y: k / 2}, {x: 6 * j / 7 + 2,y: 6 * k / 7}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 2,y: k / 2}, {x: 6 * j / 7,y: 6 * k / 7 + 2}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 3 - 8,y: k / 3}, {x: j / 3 + 8,y: k / 3}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 3,y: k / 3 - 8}, {x: j / 3,y: k / 3 + 8}, l, 3);
            l = t.parent().hasClass("selected") ? "#111" : "#444";
            o = t.parent().hasClass("selected") ? n : m;
            $.imageMapper.drawCircle(x, {x: j / 3,y: k / 3}, j / 4, l, 2, o);
            $.imageMapper.drawLine(x, {x: j / 2,y: k / 2}, {x: 6 * j / 7 + 1,y: 6 * k / 7 + 1}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 2,y: k / 2}, {x: 6 * j / 7 + 2,y: 6 * k / 7}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 2,y: k / 2}, {x: 6 * j / 7,y: 6 * k / 7 + 2}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 3 - 8,y: k / 3}, {x: j / 3 + 8,y: k / 3}, l, 3);
            v.translate(j / 2, k / 2);
            v.rotate(30 * Math.PI / 180);
            $.imageMapper.drawRect(v, {x: 23 - j / 2,y: 15 - k / 2}, {x: 27 - j / 2,y: 37 - k / 2}, "#111", 1, "#DAA520");
            $.imageMapper.drawRect(v, {x: 23 - j / 2,y: 37 - k / 2}, {x: 27 - j / 2,y: 40 - k / 2}, "#808080", 2, "#a0a0a0");
            p = [{x: 23 - j / 2,y: 15 - k / 2}, {x: 25 - j / 2,y: 10 - k / 2}, {x: 27 - j / 2,y: 15 - k / 2}];
            $.imageMapper.drawPoly(v, p, "#F5DEB3", 2, "#F5DEB3");
            $.imageMapper.drawRect(v, {x: 23 - j / 2,y: 40 - k / 2}, {x: 27 - j / 2,y: 42 - k / 2}, "#FFFAFA", 2, "#FFFAFA")
        }
    }
    var a = new Image, b, c = $("#droparea"), d = $("#local_button").attr("disabled", true), e = $("#remote_button").attr("disabled", true), f = $("#remote_select").val(""), g = $("<input />").attr({type: "file",id: "upload",multiple: true}).css({visibility: "hidden",opacity: 0,position: "absolute"}).insertAfter(d);
    var h = null;
    var i = 0;
    var j = null;
    var deg = $('#debug');
    keyMap();
    f.val('http://ww1.sinaimg.cn/mw1024/62dabf66gw1f4q7f2doq7j21b60vfb29.jpg');
    j = setInterval(function() {
        val = f.val();
        e.attr("disabled", true);
        if (val.length) {
            e.attr("disabled", false)
        }
    }, 300);
    $(window).resize(function() {
        $.imageMapper.windowResizeHandler()
    });
    $("a.allowed_images").click(function() {
        var a = $(this);
        f.val(a.html());
        e.click();
        return false
    });
    a.onload = function() {
        $("#error").html("");
        loadImg(a, "jpeg")
    };
    a.onerror = a.obabort = function(a) {
        clearCanvas();
        $("#error").html("Oops! This file doesn't contain an image").css({color: "#DB0000",top: "-40px","margin-left": "-200px","font-size": "24px"})
    };
    e.click(function() {
        var b = f.val();
        a.src = b;
        deg.css({"z-index": 0}).addClass("hidden")
    });
    $("#map").click(function() {
        if ($("#hide").hasClass("hidden")) {
            $(this).addClass("hidden");
            $("#load, #hide").removeClass("hidden")
        }
    });
    $("#hide").click(function() {
        $("#map").removeClass("hidden");
        $("#load, #hide, #result").addClass("hidden")
    });
    $(".tools").click(function() {
        var a = $(this);
        $(".tools").removeClass("selected");
        a.addClass("selected");
        nqrst()
    });
    $(".read-only").on("click", function() {
        $(this).blur()
    });
    $(".area-params, .default-params").on("keyup", function() {
        var a = $(this);
        var b = a.val();
        var c = a.attr("id");
        $.imageMapper.setParam(c, b);
        if (!$("#hide").hasClass("hidden"))
            $.imageMapper.update_map()
    });
    $("select#areatarget, select#defaulttarget").change(function() {
        var a = $(this);
        var b = a.val();
        var c = a.attr("id");
        $.imageMapper.setParam(c, b);
        if (!$("#hide").hasClass("hidden"))
            $.imageMapper.update_map()
    });
    $("#target-width").on("keyup", function() {
        $.imageMapper.targetw = $(this).val();
        if (!$("#hide").hasClass("hidden"))
            $.imageMapper.update_map()
    });
    $("#target-height").on("keyup", function() {
        $.imageMapper.targeth = $(this).val();
        if (!$("#hide").hasClass("hidden"))
            $.imageMapper.update_map()
    });
    $(".zoom").hover(function() {
        $(".zoom").removeClass("selected");
        $(this).addClass("selected");
        nqrst(true)
    }, function() {
        $(this).removeClass("selected");
        nqrst(true)
    });
    $("#pencil, #remove").hover(function() {
        $(this).addClass("selected")
    }, function() {
        $(this).removeClass("selected")
    });
    $("#pencil_color").click(function(a) {
        $.imageMapper.selectColor(this, a);
        nqrst(true)
    });
    $(".zoom").click(function() {
        var a = $(this).attr("id");
        var b = $.imageMapper.zoom, d = 1 / b;
        if (a == "plus") {
            $.imageMapper.zoom = b < 1 ? 1 / (d - .25) : b + .25
        } else {
            $.imageMapper.zoom = b > 1 ? b - .25 : 1 / (d + .25)
        }
        $.imageMapper.ratio = $.imageMapper.zoom / b;
        var e = $.imageMapper.zoom;
        var f = $("#canvas0");
        var g = $("#canvas1");
        var i = h.getContext("2d");
        var j = f[0].getContext("2d");
        var k = $.imageMapper.ctx;
        var l = $.imageMapper.width, m = $.imageMapper.height;
        var n = h.width, o = h.height;
        $.imageMapper.width = n * e;
        $.imageMapper.height = o * e;
        j.clearRect(0, 0, l, m);
        f.attr({width: n * e + "px",height: o * e + "px"});
        j.scale(e, e);
        j.drawImage(h, 0, 0);
        k.clearRect(0, 0, l, m);
        g.attr({width: n * e + "px",height: o * e + "px"});
        $.imageMapper.scaleShapes();
        $("#drop_wrap").css({width: n * e + 20 + parseInt(c.css("marginLeft")) + parseInt(c.css("marginRight")) + parseInt(c.css("borderLeftWidth")) + parseInt(c.css("borderRightWidth")) + "px",height: o * e + parseInt(c.css("marginTop")) + parseInt(c.css("marginBottom")) + parseInt(c.css("borderTopWidth")) + parseInt(c.css("borderBottomWidth")) + "px"});
        var p = c.offset(), q = p.left;
        c.offset({top: p.top,left: Math.round(p.left)});
        $("#droparea").css({width: n * e + "px",height: o * e + "px"});
        $("#curr-width").val(Math.floor(n * e));
        $("#curr-height").val(Math.floor(o * e))
    });
    var k = function(a) {
        var c = new FileReader;
        c.onload = function(c) {
            if (/image/i.test(a.type)) {
                b = $('<img id = "map_image" />').load(function() {
                    loadImg(this, a.type)
                }).attr("src", c.target.result);
                $("#error").html("")
            } else {
                clearCanvas();
                $("#error").html("Oops! This file doesn't contain an image").css({color: "#DB0000",top: "-40px","margin-left": "-200px","font-size": "24px"})
            }
        };
        c.readAsDataURL(a)
    };
    var loadImg = function(a, b) {
        clearCanvas();
        if (!$.imageMapper.initialized) {
            h = document.createElement("canvas");
            var d = document.createElement("canvas");
            var e = h.getContext("2d");
            var f = d.getContext("2d");
            var g = $("<canvas></canvas>")
        } else {
            var d = $("#canvas0")[0];
            var g = $("#canvas1");
            var e = h.getContext("2d");
            var f = d.getContext("2d");
            e.clearRect(0, 0, h.width, h.height)
        }
        var i = a.width;
        var j = a.height;
        $("#curr-width").val(i);
        $("#curr-height").val(j);
        $("#target-width").val(i);
        $("#target-height").val(j);
        var k = $("body").width();
        if ((k - i) % 2 == 1)
            $("body").width(k + 1 + "px");
        $("#drop_wrap").css({width: i + 17 + parseInt(c.css("marginLeft")) + parseInt(c.css("marginRight")) + parseInt(c.css("borderLeftWidth")) + parseInt(c.css("borderRightWidth")) + "px",height: j + parseInt(c.css("marginTop")) + parseInt(c.css("marginBottom")) + parseInt(c.css("borderTopWidth")) + parseInt(c.css("borderBottomWidth")) + "px"});
        var l = c.offset(), o = l.left;
        c.offset({top: l.top,left: Math.round(l.left)});
        $(d).attr({width: i + "px",height: j + "px",id: "canvas0"}).css({position: "absolute",top: 0,left: 0,"z-index": 0});
        g.attr({width: i + "px",height: j + "px",id: "canvas1"}).css({position: "absolute",top: 0,left: 0,"z-index": 1});
        $(h).attr({width: i + "px",height: j + "px"});
        e.clearRect(0, 0, i, j);
        e.drawImage(a, 0, 0, i, j);
        f.drawImage(a, 0, 0, i, j);
        $("#droparea").css({width: i + "px",height: j + "px"}).append(d).append(g);
        $("#dashboard, #image-params").removeClass("hidden");
        if ($.imageMapper.initialized) {
            $.imageMapper.init({zoom: 1,ratio: 1,targetw: $("#target-width").val(),targeth: $("#target-height").val()});
            $.imageMapper.stop.click()
        } else {
            $.imageMapper.init({theCanvas: g,start: $(".start"),stop: $("#stop"),rect: $("#rect"),poly: $("#poly"),circle: $("#circle"),remove: $("#remove"),pencil: $("#pencil"),edit: $("#edit"),map: $("#map"),load: $("#load"),hide: $("#hide"),dashboard: $("div#dashboard"),image: $("#image-params"),area: $("#area-params"),targetw: $("#target-width").val(),targeth: $("#target-height").val(),result: $("div#result"),xyInfo: $(".canvas_info"),border: 8,zoom: 1})
        }
        nqrst(true);
        (typeof IMG_SRC != 'undefined') && (IMG_SRC = a.src);
        $.imageMapper.map.click()
    };
    $(".draggable").draggable({handle: "div#drag_handle"});
    var o;
    if (!Modernizr.canvas) {
        o = "Ops! Your browser does not support <strong>HTML5 canvas</strong> <br/>Try using Chrome or Firefox to have it works!"
    } else if (typeof FileReader === "undefined") {
        o = "Ops! Your browser does not support <strong>HTML5 File API</strong> <br/>Try using Chrome or Firefox to have it works!"
    }
    if (o) {
        $("#drop_wrap, #droparea, #select_wrap").addClass("hidden");
        $("#error").html(o).css({color: "#DB0000",top: "150px","margin-left": "-240px","font-size": "24px"})
    }
});