jQuery.imageMapper = function (a) {
    function b(b, d) {
        if (M.mouse_down) {
            c(b, d);
            M.update_map()
        }
        if (!f() || !g())return;
        var e = M.ctx, h = d.x, i = d.y;
        e.clearRect(0, 0, b.width, b.height);
        a.each(M.shapes, function (a, b) {
            if (a < M.shapes.length - 1 || !f())o(e, b, M.curColor, M.lineWidth, b.fillColor, 0); else o(e, b, M.curColor, M.lineWidth, b.fillColor, d)
        })
    }

    function c(b, c) {
        var d = M.current - 1;
        var e = M.shapes[d]["mousePos"];
        var f = M.shapes[d];
        var g = c.x - e.x;
        var h = c.y - e.y;
        if (M.points.length) {
            a.each(M.points, function (a, b) {
                M.points[a]["x"] = b.x + g;
                M.points[a]["y"] = b.y + h
            })
        }
        M.shapes[d]["mousePos"] = c;
        switch (f.type) {
            case"poly":
                var i = true;
                a.each(f, function (a, b) {
                    if (b.x + g < 0 || b.x + g > M.theCanvas[0].width || b.y + h < 0 || b.y + h > M.theCanvas[0].height)i = false
                });
                a.each(f, function (a, b) {
                    if (i) {
                        M.shapes[d][a].x += g;
                        M.shapes[d][a].y += h
                    }
                });
                break;
            case"rect":
                if (M.shapes[d]["x_min"] + g >= 0 && M.shapes[d]["y_min"] + h >= 0 && M.shapes[d]["x_max"] + g <= M.theCanvas[0].width && M.shapes[d]["y_max"] + h <= M.theCanvas[0].height) {
                    M.shapes[d]["point1"]["x"] += g;
                    M.shapes[d]["point1"]["y"] += h;
                    M.shapes[d]["point2"]["x"] += g;
                    M.shapes[d]["point2"]["y"] += h;
                    M.shapes[d]["x_min"] += g;
                    M.shapes[d]["x_max"] += g;
                    M.shapes[d]["y_min"] += h;
                    M.shapes[d]["y_max"] += h
                }
                break;
            case"circle":
                if (M.shapes[d]["center"]["x"] + g >= 0 && M.shapes[d]["center"]["y"] + h >= 0 && M.shapes[d]["center"]["x"] + g < M.theCanvas[0].width && M.shapes[d]["center"]["y"] + h < M.theCanvas[0].height) {
                    M.shapes[d]["center"]["x"] += g;
                    M.shapes[d]["center"]["y"] += h
                }
                break;
            default:
                break
        }
        u();
        v()
    }

    function d(a, b) {
        var c = a.getBoundingClientRect(), d = document.documentElement;
        var e = b.clientY - c.top - d.scrollTop;
        var f = b.clientX - c.left - d.scrollLeft;
        var e = b.pageY - c.top - d.scrollTop;
        var f = b.pageX - c.left - d.scrollLeft;
        return {x: f, y: e}
    }

    function e() {
        return M.status == "idle"
    }

    function f() {
        return M.status == "drawing"
    }

    function g() {
        return M.mouse_clicked
    }

    function h() {
        return M.status == "edit"
    }

    function j(a, b, c, d, e, f, g, h) {
        if (!b)return;
        var i = b.x, j = b.y;
        a.strokeStyle = d || a.strokeStyle;
        a.lineWidth = e || a.lineWidth;
        a.fillStyle = f || a.fillStyle;
        if (!c) {
            c = Math.sqrt((g["x"] - i) * (g["x"] - i) + (g["y"] - j) * (g["y"] - j));
            k(a, b, g, d, e)
        }
        a.beginPath();
        a.arc(i, j, c, 0, 2 * Math.PI, false);
        a.fill();
        a.closePath();
        a.stroke();
        if (h) {
            l(a, b, M.radius, M.curColor, M.lineWidth, M.curColor);
            k(a, b, {x: b.x + c, y: b.y}, d, e);
            l(a, {x: b.x + c, y: b.y}, 4, M.curColor, M.lineWidth, M.curColor);
            k(a, b, {x: b.x - c, y: b.y}, d, e);
            l(a, {x: b.x - c, y: b.y}, 4, M.curColor, M.lineWidth, M.curColor);
            k(a, b, {x: b.x, y: b.y + c}, d, e);
            l(a, {x: b.x, y: b.y + c}, 4, M.curColor, M.lineWidth, M.curColor);
            k(a, b, {x: b.x, y: b.y - c}, d, e);
            l(a, {x: b.x, y: b.y - c}, 4, M.curColor, M.lineWidth, M.curColor)
        }
    }

    function k(a, b, c, d, e) {
        a.strokeStyle = d;
        a.lineWidth = e;
        a.beginPath();
        a.moveTo(b["x"], b["y"]);
        a.lineTo(c["x"], c["y"]);
        a.closePath();
        a.stroke()
    }

    function l(a, b, c, d, e, f) {
        j(a, b, c, d, 1, f, 0)
    }

    function m(b, c, d, e, f, g, h) {
        if (c.length == 0)return;
        var j = c[0];
        b.beginPath();
        b.moveTo(j["x"], j["y"]);
        b.strokeStyle = d || b.strokeStyle;
        b.fillStyle = f || b.fillStyle;
        b.lineWidth = e;
        for (i = 1; i < c.length; i++) {
            b.lineTo(c[i]["x"], c[i]["y"])
        }
        if (g)b.lineTo(g["x"], g["y"]);
        b.lineTo(j["x"], j["y"]);
        b.closePath();
        b.fill();
        b.stroke();
        if (c.status == "drawing" || h) {
            a.each(c, function (a, c) {
                var d = h ? 4 : M.radius;
                l(b, c, d, M.curColor, M.lineWidth, M.curColor)
            })
        }
    }

    function n(a, b, c, d, e, f, g, h) {
        a.strokeStyle = d || a.strokeStyle;
        a.lineWidth = e || a.lineWidth;
        a.fillStyle = f || a.fillStyle;
        if (!c && b && g) {
            var i = g.x - b.x, j = g.y - b.y, k = i / Math.abs(i), m = j / Math.abs(j);
            a.strokeRect(b.x, b.y, i, j);
            a.fillRect(b.x + e * k / 2, b.y + e * m / 2, i - e * k, j - e * m)
        } else if (b && c) {
            var i = c.x - b.x, j = c.y - b.y, k = i / Math.abs(i), m = j / Math.abs(j);
            a.strokeRect(b.x, b.y, i, j);
            a.fillRect(b.x + e * k / 2, b.y + e * m / 2, i - e * k, j - e * m)
        } else return;
        if (h) {
            l(a, b, 4, M.curColor, M.lineWidth, M.curColor);
            l(a, c, 4, M.curColor, M.lineWidth, M.curColor);
            l(a, {x: b.x, y: c.y}, 4, M.curColor, M.lineWidth, M.curColor);
            l(a, {x: c.x, y: b.y}, 4, M.curColor, M.lineWidth, M.curColor)
        }
        a.beginPath();
        a.arc(0, 0, 0, 0, 2 * Math.PI, false);
        a.stroke()
    }

    function o(a, b, c, d, e, f, g) {
        var g = g || false;
        switch (b.type) {
            case"poly":
                m(a, b, c, d, e, f, g);
                break;
            case"rect":
                n(a, b.point1, b.point2, c, d, e, f, g);
                break;
            case"circle":
                j(a, b["center"], b["radius"], c, d, e, f, g);
                break;
            default:
                break
        }
    }

    function p(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
    }

    function q(a, b) {
        for (var c = false, d = -1, e = a.length, f = e - 1; ++d < e; f = d)(a[d].y <= b.y && b.y < a[f].y || a[f].y <= b.y && b.y < a[d].y) && b.x < (a[f].x - a[d].x) * (b.y - a[d].y) / (a[f].y - a[d].y) + a[d].x && (c = !c);
        return c
    }

    function r(a, b) {
        return b.x >= a.x_min && b.x <= a.x_max && b.y >= a.y_min && b.y <= a.y_max
    }

    function s(a, b) {
        return p(a.center, b) <= a.radius
    }

    function t(a, b) {
        a.type = a.type || "";
        switch (a.type) {
            case"poly":
                return q(a, b);
            case"rect":
                return r(a, b);
            case"circle":
                return s(a, b)
        }
        return false
    }

    function u(a, b) {
        var a = a || M.theCanvas[0];
        var b = b || M.ctx;
        b.clearRect(0, 0, a.width, a.height)
    }

    function v(b) {
        a.each(M.shapes, function (a, c) {
            if (b) {
                c.fillColor = b == "edit" ? M.fillSelect : M.fillColor;
                c.status = b
            }
            o(M.ctx, c, M.curColor, M.lineWidth, c.fillColor, 0, M.current == a + 1)
        })
    }

    function w() {
        if (M.shapes.length) {
            var a = M.shapes.pop();
            if (a.length > 2 || a.modify)M.shapes.push(a);
            return M.shapes.length
        }
    }

    function x() {
        var b = M.targetw / M.theCanvas[0].width;
        var c = M.targeth / M.theCanvas[0].height;
        var d = (b + c) / 2;
        if (!f())w();
        M.windowResizeHandler();
        var e = M.result.find("textarea");
        var g = M["mapname"] ? M["mapname"] : "";
        var h = "<map name='" + g + "'>\n";
        a.each(M.shapes, function (e, f) {
            if (f.length) {
                var g = "";
                var i = f["areaurl"];
                if (!i)i = "#";
                var j = "'" + i + "'";
                if (f["idname"])j += " id = '" + f["idname"] + "'";
                if (f["classname"])j += " class = '" + f["classname"] + "'";
                if (f["alttext"])j += " alt = '" + f["alttext"] + "' title = '" + f["alttext"] + "'";
                if (f["areatarget"] && f["areatarget"] != "none")j += " target = '" + f["areatarget"] + "'";
                switch (f.type) {
                    case"poly":
                        a.each(f, function (a, d) {
                            if (a == 0)g = "'" + Math.floor(b * d["x"]) + ", " + Math.floor(c * d["y"]); else g = g + ", " + Math.floor(b * d["x"]) + ", " + Math.floor(c * d["y"])
                        });
                        h = h + "<area shape='poly' coords=" + g + "' href=" + j + " />\n";
                        break;
                    case"rect":
                        g = "'" + Math.floor(b * f.point1["x"]) + ", " + Math.floor(c * f.point1["y"]) + ", " + Math.floor(b * f.point2["x"]) + ", " + Math.floor(c * f.point2["y"]);
                        h = h + "<area shape='rect' coords=" + g + "' href=" + j + " />\n";
                        break;
                    case"circle":
                        g = "'" + Math.floor(b * f.center["x"]) + ", " + Math.floor(c * f.center["y"]) + ", " + Math.floor(d * f.radius);
                        h = h + "<area shape='circle' coords=" + g + "' href=" + j + " />\n";
                        break;
                    default:
                        break
                }
            }
        });
        if (M["defaulturl"]) {
            h += "<area shape='default' href='" + M["defaulturl"] + "'";
            if (M["defaulttarget"] && M["defaulttarget"] != "none")h += " target='" + M["defaulttarget"] + "'";
            h += " />\n"
        }
        h += "</map>";
        e.val(h)
    }

    function y(a, c) {
        var e = d(a, c);
        var f = M.shapes.pop();
        f.fillColor = M.fillColor;
        switch (f.type) {
            case"poly":
                f.push({x: e.x, y: e.y});
                l(M.ctx, e, M.radius, M.curColor, M.lineWidth, M.curColor);
                M.shapes.push(f);
                break;
            case"circle":
                if (!f["center"]) {
                    f["center"] = {x: e.x, y: e.y};
                    l(M.ctx, e, M.radius, M.curColor, M.lineWidth, M.curColor);
                    M.shapes.push(f);
                    if (c.fdi) {
                        var g = M.shapes.length - 1;
                        M.shapes[g]["areaurl"] = M.shapes[c.current - 1]["areaurl"];
                        M.shapes[g]["alttext"] = M.shapes[c.current - 1]["alttext"];
                        M.shapes[g]["idname"] = M.shapes[c.current - 1]["idname"];
                        M.shapes[g]["classname"] = M.shapes[c.current - 1]["classname"];
                        M.shapes[g]["areatarget"] = M.shapes[c.current - 1]["areatarget"];
                        M.shapes.splice(c.current - 1, 1);
                        b(M.theCanvas[0], {x: c.pageX2, y: c.pageY2});
                        M.shapes[M.shapes.length - 1]["modify"] = true
                    }
                    break
                }
                var h = Math.round(p(e, f["center"]));
                f["radius"] = h;
                f.length = 3;
                f.status = "edit";
                M.mouse_clicked = false;
                M.shapes.push(f);
                if (!f.modify) {
                    var i = new Array;
                    i.type = "circle";
                    i.status = "drawing";
                    M.shapes.push(i)
                } else M.stop.click();
                M.update_map();
                break;
            case"rect":
                if (!f["point1"]) {
                    f["point1"] = {x: e.x, y: e.y};
                    l(M.ctx, e, M.radius, M.curColor, M.lineWidth, M.curColor);
                    M.shapes.push(f);
                    if (c.fdi) {
                        var g = M.shapes.length - 1;
                        M.shapes[g]["areaurl"] = M.shapes[c.current - 1]["areaurl"];
                        M.shapes[g]["alttext"] = M.shapes[c.current - 1]["alttext"];
                        M.shapes[g]["idname"] = M.shapes[c.current - 1]["idname"];
                        M.shapes[g]["classname"] = M.shapes[c.current - 1]["classname"];
                        M.shapes[g]["areatarget"] = M.shapes[c.current - 1]["areatarget"];
                        M.shapes.splice(c.current - 1, 1);
                        b(M.theCanvas[0], {x: c.pageX2, y: c.pageY2});
                        M.shapes[M.shapes.length - 1]["modify"] = true
                    }
                    break
                }
                f["point2"] = {x: e.x, y: e.y};
                f.x_min = Math.min(f.point1.x, f.point2.x);
                f.x_max = f.point1.x == f.x_min ? f.point2.x : f.point1.x;
                f.y_min = Math.min(f.point1.y, f.point2.y);
                f.y_max = f.point1.y == f.y_min ? f.point2.y : f.point1.y;
                M.shapes.push(f);
                f.length = 3;
                f.status = "edit";
                M.mouse_clicked = false;
                if (!f.modify) {
                    var j = new Array;
                    j.type = "rect";
                    j.status = "drawing";
                    M.shapes.push(j)
                } else M.stop.click();
                M.update_map();
                break;
            default:
                break
        }
        c.stopPropagation();
        c.preventDefault()
    }

    function z(c, e) {
        var f = d(c, e), g;
        a.each(M.points, function (c, d) {
            if (s({center: d, radius: 4}, f)) {
                g = M.points.current;
                var h = M.shapes[g - 1];
                var j = M.points.type;
                M.status = "drawing";
                M.current = 0;
                M.area.addClass("hidden");
                var k = M.theCanvas[0].getBoundingClientRect(), l = document.documentElement;
                e.type = "mousedown";
                var m = new jQuery.Event(e.type);
                switch (j) {
                    case"poly":
                        var n = false;
                        a.each(h, function (a, c) {
                            if (c.x == d.x && c.y == d.y && !n) {
                                n = true;
                                var e;
                                for (i = h.length - 1; i > a; i--) {
                                    e = h.pop();
                                    h.unshift(e)
                                }
                                h.pop();
                                M.shapes[g - 1]["modify"] = true;
                                M.shapes.splice(g - 1, 1);
                                h.fillColor = M.fillColor;
                                M.shapes.push(h);
                                M.poly.click();
                                w();
                                b(M.theCanvas[0], {x: c.x, y: c.y})
                            }
                        });
                        break;
                    case"rect":
                        var o = h.point1.x, p = h.point2.x, q = h.point1.y, r = h.point2.y, t, u, v, x;
                        if (d.x == o) {
                            t = p;
                            u = d.y == q ? r : q;
                            v = o;
                            x = d.y == q ? q : r
                        } else {
                            t = o;
                            u = d.y == r ? q : r;
                            v = p;
                            x = d.y == r ? r : q
                        }
                        m.pageX = t + k.left + l.scrollLeft;
                        m.pageY = u + k.top + l.scrollTop;
                        m.pageX2 = v;
                        m.pageY2 = x;
                        m.fdi = true;
                        m.current = g;
                        M.rect.click();
                        M.theCanvas.trigger(m);
                        break;
                    case"circle":
                        var t = h.center.x, u = h.center.y;
                        m.pageX = t + k.left + l.scrollLeft;
                        m.pageY = u + k.top + l.scrollTop;
                        m.pageX2 = d.x;
                        m.pageY2 = d.y;
                        m.fdi = true;
                        m.current = g;
                        M.circle.click();
                        M.theCanvas.trigger(m);
                        break;
                    default:
                        break
                }
            }
        });
        if (g)return;
        a.each(M.shapes, function (b, c) {
            if (t(c, f)) {
                g = b + 1;
                M.area.removeClass("hidden");
                M.remove.removeClass("hidden");
                M.pencil.addClass("hidden");
                a("#shape").val(c.type);
                a("#areaurl").val(c.areaurl);
                a("#alttext").val(c.alttext);
                a("#idname").val(c.idname);
                a("#classname").val(c.classname);
                a("#areatarget").val(c.areatarget);
                a("#shape").val(c.type)
            } else {
                M.shapes[b]["fillColor"] = M.fillColor;
                M.shapes[b]["status"] = "idle"
            }
        });
        if (g && g == M.current) {
            M.mouse_down = true;
            M.shapes[g - 1]["mousePos"] = f;
            return
        }
        M.current = 0;
        M.area.addClass("hidden");
        M.pencil.removeClass("hidden");
        M.remove.addClass("hidden");
        if (g) {
            var h = M.shapes[g - 1]["status"];
            if (h == "selected") {
                M.shapes[g - 1]["fillColor"] = M.fillColor;
                M.shapes[g - 1]["status"] = "idle";
                M.current = 0
            } else {
                M.shapes[g - 1]["fillColor"] = M.fillSelect;
                M.shapes[g - 1]["status"] = "selected";
                M.current = g;
                M.area.removeClass("hidden");
                M.remove.removeClass("hidden");
                M.pencil.addClass("hidden");
                var j = M.shapes[g - 1];
                switch (j.type) {
                    case"poly":
                        a.each(j, function (a, b) {
                            M.points[a] = {x: b.x, y: b.y}
                        });
                        break;
                    case"rect":
                        M.points[0] = {x: j["point1"]["x"], y: j["point1"]["y"]};
                        M.points[1] = {x: j["point2"]["x"], y: j["point1"]["y"]};
                        M.points[2] = {x: j["point1"]["x"], y: j["point2"]["y"]};
                        M.points[3] = {x: j["point2"]["x"], y: j["point2"]["y"]};
                        break;
                    case"circle":
                        M.points[0] = {x: j["center"]["x"] + j["radius"], y: j["center"]["y"]};
                        M.points[1] = {x: j["center"]["x"] - j["radius"], y: j["center"]["y"]};
                        M.points[2] = {x: j["center"]["x"], y: j["center"]["y"] - j["radius"]};
                        M.points[3] = {x: j["center"]["x"], y: j["center"]["y"] + j["radius"]};
                        break;
                    default:
                        break
                }
                M.points.current = g;
                M.points.type = j.type
            }
        }
        u();
        v()
    }

    M = {
        initialized: false,
        theCanvas: null,
        width: null,
        height: null,
        shapes: [],
        points: [],
        status: "edit",
        start: null,
        stop: null,
        rect: null,
        poly: null,
        circle: null,
        map: null,
        remove: null,
        pencil: null,
        edit: null,
        dashboard: null,
        area: null,
        targetw: null,
        targeth: null,
        result: null,
        xyInfo: null,
        ratio: 1,
        zoom: 1,
        radius: 2,
        lineWidth: 1,
        fillColor: "rgba(128, 128, 128, .5)",
        fillSelect: "rgba(128, 128, 128, .9)",
        border: 8,
        colors: ["rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(0, 0, 255, 1)"],
        curColor: "rgba(255, 0, 0, 1)",
        ctx: null
    };
    M.init = function (a) {
        for (prop in a) {
            M[prop] = a[prop]
        }
        M.width = M.theCanvas[0].width;
        M.height = M.theCanvas[0].height;
        M.ctx = M.theCanvas[0].getContext("2d");
        M.shapes = [];
        M.points = [];
        if (!M.initialized) {
            M.drawRect = n;
            M.drawCircle = j;
            M.drawPoly = m;
            M.drawLine = k;
            M.clearCanvas = u;
            M.update_map = x;
            M.setEvents();
            M.initialized = true
        }
    };
    M.setParam = function (a, b) {
        if (a == "mapname" || a == "defaulturl" || a == "defaulttarget") {
            M[a] = b;
            return
        }
        if (!M.current || !a || !b)return;
        if (a != "areaurl" && a != "alttext" && a != "idname" && a != "classname" && a != "areatarget")return;
        M.shapes[M.current - 1][a] = b
    };
    M.scaleShapes = function () {
        var b = M.ratio;
        a.each(M.shapes, function (c, d) {
            if (d.length) {
                switch (d.type) {
                    case"poly":
                        a.each(d, function (a, c) {
                            d[a]["x"] *= b;
                            d[a]["y"] *= b
                        });
                        break;
                    case"rect":
                        d["point1"]["x"] *= b;
                        d["point1"]["y"] *= b;
                        d["point2"]["x"] *= b;
                        d["point2"]["y"] *= b;
                        d["x_min"] *= b;
                        d["x_max"] *= b;
                        d["y_min"] *= b;
                        d["y_max"] *= b;
                        break;
                    case"circle":
                        d["center"]["x"] *= b;
                        d["center"]["y"] *= b;
                        d["radius"] *= b;
                        break;
                    default:
                        brteak
                }
            }
        });
        u();
        v()
    };
    M.selectColor = function (b, c) {
        var e = d(b, c);
        var f = b.width, g = b.height;
        var h = [{x: f / 6, y: g / 6}, {x: 5 * f / 6, y: g / 6}, {x: f / 6, y: 5 * g / 6}, {
            x: 5 * f / 6,
            y: 5 * g / 6
        }];
        a.each(h, function (a, b) {
            if (s({center: b, radius: f / 4}, e)) {
                M.curColor = M.colors[a + 1];
                var c = M.colors[0];
                M.colors[0] = M.colors[a + 1];
                M.colors[a + 1] = c;
                u();
                v()
            }
        })
    };
    M.hideShowMap = function (a) {
        if (a == "hide") {
            M.load.addClass("hidden");
            M.hide.addClass("hidden");
            M.result.addClass("hidden");
            M.map.addClass("hidden")
        } else {
            M.map.removeClass("hidden");
            M.load.addClass("hidden");
            M.hide.addClass("hidden");
            M.result.addClass("hidden")
        }
    };
    M.windowResizeHandler = function () {
        try {
            M.result.css("width", "-moz-available")
        } catch (b) {
        }
        var c = M.result[0];
        var d = c.style.width.indexOf("-moz-available") > -1;
        if (!d) {
            var e = a("#body").width();
            M.result.css({width: e - 217 + "px"}).find("textarea").css({width: e - 231 + "px"})
        }
    };
    M.setEvents = function () {
        if (M.start) {
            M.start.on("click", function () {
                M.status = "drawing";
                w();
                var b = new Array;
                b.type = a(this).attr("id");
                b.status = "drawing";
                M.shapes.push(b);
                a.each(M.shapes, function (a, b) {
                    b["fillColor"] = M.fillColor;
                    b["status"] = "idle"
                });
                M.current = 0;
                M.area.addClass("hidden");
                M.pencil.removeClass("hidden");
                M.remove.addClass("hidden");
                u();
                v();
                var c = 0
            })
        }
        if (M.stop) {
            M.stop.on("click", function () {
                M.status = "edit";
                var a = w();
                M.current = 0;
                M.area.addClass("hidden");
                M.pencil.removeClass("hidden");
                M.remove.addClass("hidden");
                u();
                v("idle");
                M.mouse_clicked = false
            })
        }
        if (M.edit) {
            M.edit.on("click", function () {
                M.stop.trigger("click");
                M.status = "edit"
            })
        }
        if (M.remove) {
            M.remove.on("click", function () {
                var a = M.current - 1;
                M.shapes.splice(a, 1);
                M.current = 0;
                M.area.addClass("hidden");
                M.pencil.removeClass("hidden");
                M.remove.addClass("hidden");
                M.update_map();
                u();
                v()
            })
        }
        if (M.map) {
            M.map.on("click", function () {
                M.update_map();
                M.result.removeClass("hidden").find("textarea").removeClass("hidden")
            })
        }
        if (M.load) {
            M.load.on("click", function () {
                var b = M.result.find("textarea").val();
                var c = b.split("\n");
                M.shapes = [];
                var d = M.theCanvas[0].width / M.targetw;
                var e = M.theCanvas[0].height / M.targeth;
                var f = (d + e) / 2;
                a.each(c, function (b, c) {
                    if (/area/ig.test(c) && b < Math.floor(Math.sqrt(50))) {
                        var g = /shape\s*=\s*\'([^\']+)\'\s*coords\s*=\s*\'([^\']+)\'\s*href\s*=\s*\'([^\']+)/ig;
                        result = g.exec(c);
                        if (result) {
                            var h = result[1];
                            var j = result[2];
                            var k = result[3] == "#" ? "" : result[3]
                        } else {
                            g = /shape\s*=\s*\'([^\']+)\'\s*href\s*=\s*\'([^\']+)/ig;
                            result = g.exec(c);
                            var h = result[1];
                            var k = result[2] == "#" ? "" : result[2]
                        }
                        if (/id\s*=\s*/ig.test(c)) {
                            var l = /id\s*=\s*\'([^\']+)/ig.exec(c);
                            l = l[1]
                        }
                        if (/class\s*=\s*/ig.test(c)) {
                            var m = /class\s*=\s*\'([^\']+)/ig.exec(c);
                            m = m[1]
                        }
                        if (/alt\s*=\s*/ig.test(c)) {
                            var n = /alt\s*=\s*\'([^\']+)/ig.exec(c);
                            n = n[1]
                        }
                        if (/target\s*=\s*/ig.test(c)) {
                            var o = /target\s*=\s*\'([^\']+)/ig.exec(c);
                            o = o[1]
                        }
                        if (j)var p = j.split(", ");
                        switch (h) {
                            case"poly":
                                var q = [];
                                q.type = "poly";
                                for (i = 0; i < p.length - 1; i += 2) {
                                    var r = d * p[i];
                                    var s = e * p[i + 1];
                                    if (r < 0)r = 0;
                                    if (s < 0)s = 0;
                                    if (r > M.theCanvas[0].width)r = M.theCanvas[0].width;
                                    if (s > M.theCanvas[0].height)s = M.theCanvas[0].height;
                                    q.push({x: r, y: s})
                                }
                                q.areaurl = k;
                                if (l)q.idname = l;
                                if (m)q.classname = m;
                                if (n)q.alttext = n;
                                if (o)q.areatarget = o;
                                q.fillColor = M.fillColor;
                                M.shapes.push(q);
                                break;
                            case"rect":
                                var t = new Array;
                                t.type = "rect";
                                t.point1 = {x: d * p[0], y: e * p[1]};
                                t.point2 = {x: d * p[2], y: e * p[3]};
                                if (t.point1.x > M.theCanvas[0].width)t.point1.x = M.theCanvas[0].width;
                                if (t.point1.y > M.theCanvas[0].height)t.point1.y = M.theCanvas[0].height;
                                if (t.point2.x > M.theCanvas[0].width)t.point2.x = M.theCanvas[0].width;
                                if (t.point2.y > M.theCanvas[0].height)t.point2.y = M.theCanvas[0].height;
                                if (t.point1.x < 0)t.point1.x = 0;
                                if (t.point1.y < 0)t.point1.y = 0;
                                if (t.point2.x < 0)t.point2.x = 0;
                                if (t.point2.y < 0)t.point2.y = 0;
                                t.x_min = Math.min(t.point1.x, t.point2.x);
                                t.x_max = t.point1.x == t.x_min ? t.point2.x : t.point1.x;
                                t.y_min = Math.min(t.point1.y, t.point2.y);
                                t.y_max = t.point1.y == t.y_min ? t.point2.y : t.point1.y;
                                t.areaurl = k;
                                if (l)t.idname = l;
                                if (m)t.classname = m;
                                if (n)t.alttext = n;
                                if (o)t.areatarget = o;
                                t.length = 3;
                                t.fillColor = M.fillColor;
                                M.shapes.push(t);
                                break;
                            case"circle":
                                var u = [];
                                u.type = "circle";
                                var r = d * p[0];
                                var s = e * p[1];
                                if (r < 0)r = 0;
                                if (s < 0)s = 0;
                                if (r > M.theCanvas[0].width)r = M.theCanvas[0].width;
                                if (s > M.theCanvas[0].height)s = M.theCanvas[0].height;
                                u.center = {x: r, y: s};
                                u.radius = f * p[2];
                                u.areaurl = k;
                                if (l)u.idname = l;
                                if (m)u.classname = m;
                                if (n)u.alttext = n;
                                if (o)u.areatarget = o;
                                u.length = 3;
                                u.fillColor = M.fillColor;
                                M.shapes.push(u);
                                break;
                            default:
                                a("#defaulturl").val(k);
                                a("#defaulttarget").val(o);
                                M.setParam("defaulturl", k);
                                M.setParam("defaulttarget", o);
                                break
                        }
                    }
                });
                M.stop.click();
                u();
                v()
            })
        }
        if (M.theCanvas) {
            M.theCanvas.parent().on("click dblclick mousedown mousemove", function (a) {
                var b = d(this, a);
                var c = b.x, e = b.y, f = M.border, g = M.theCanvas[0].width, h = M.theCanvas[0].height;
                while (true) {
                    if (r({x_min: f, x_max: g + f, y_min: f, y_max: h + f}, b))return false;
                    if (c < f && e < f) {
                        c = 0;
                        e = 0;
                        break
                    }
                    if (c > g + f && e < f) {
                        c = g;
                        e = 0;
                        break
                    }
                    if (c > g + f && e > h + f) {
                        c = g;
                        e = h;
                        break
                    }
                    if (c < f && e > h + f) {
                        c = 0;
                        e = h;
                        break
                    }
                    if (c < f) {
                        c = 0;
                        e -= f;
                        break
                    }
                    if (e < f) {
                        c -= f;
                        e = 0;
                        break
                    }
                    if (c > g + f) {
                        c = g;
                        e -= f;
                        break
                    }
                    if (e > h + f) {
                        c -= f;
                        e = h;
                        break
                    }
                }
                if (a.type == "mousedown") {
                    var i = 0
                }
                var j = M.theCanvas[0].getBoundingClientRect(), k = document.documentElement;
                if (a.type == "mousemove")a.type = "mouseenter";
                var l = new jQuery.Event(a.type);
                l.pageX = c + j.left + k.scrollLeft;
                l.pageY = e + j.top + k.scrollTop;
                M.theCanvas.trigger(l);
                return false
            });
            M.theCanvas.parent().on("mouseleave", function (a) {
                var b = d(this, a);
                var c = b.x, e = b.y, f = M.border, g = M.theCanvas[0].width, h = M.theCanvas[0].height;
                if (c <= 0 || e <= 0 || c >= g + 2 * f || e >= h + 2 * f) {
                    M.theCanvas.trigger("canvas_leave")
                }
            });
            M.theCanvas.on("mousemove mouseenter", function (c) {
                M.xyInfo.removeClass("hidden");
                var e = d(this, c);
                M.xyInfo.html("Mouse position: " + e.x + "," + e.y);
                b(this, e);
                M.theCanvas.removeClass("cursor_move").removeClass("cursor_pointer");
                if (M.current) {
                    var f = M.shapes[M.current - 1];
                    if (t(f, e))M.theCanvas.addClass("cursor_move");
                    a.each(M.points, function (a, b) {
                        if (s({
                                center: b,
                                radius: 4
                            }, e))M.theCanvas.removeClass("cursor_move").addClass("cursor_pointer")
                    })
                }
            });
            M.theCanvas.on("canvas_leave", function (a) {
                M.xyInfo.addClass("hidden");
                var b = M.ctx;
                b.clearRect(0, 0, this.width, this.height);
                v()
            });
            M.theCanvas.on("mousedown", function (a) {
                M.mouse_clicked = true;
                if (f())return y(this, a);
                if (h())return z(this, a)
            });
            M.theCanvas.on("dblclick", function (a) {
                if (!f())return false;
                var b = M.shapes.pop();
                if (b.type != "poly")return false;
                if (b.length < 4) {
                    var c = new Array;
                    c.type = "poly";
                    c.status = "drawing";
                    M.shapes.push(c);
                    M.mouse_clicked = false;
                    return false
                }
                b.pop();
                b.pop();
                var e = d(this, a);
                b.push({x: e.x, y: e.y});
                l(M.ctx, e, M.radius, M.curColor, M.lineWidth, M.curColor);
                b.status = "edit";
                M.mouse_clicked = false;
                M.shapes.push(b);
                if (!b["modify"]) {
                    var c = new Array;
                    c.type = "poly";
                    c.status = "drawing";
                    M.shapes.push(c)
                } else M.stop.click();
                M.update_map();
                return false
            });
            M.theCanvas.on("mouseup", function (a) {
                M.mouse_down = false
            })
        }
    };
    return M
}(jQuery);
$(document).ready(function () {
    function m() {
        if ($("#droparea canvas").length) {
            $(".canvas_info, #dashboard, #image-params").addClass("hidden");
            $.each($("#droparea canvas"), function (a, b) {
                var c = b.getContext("2d");
                c.clearRect(0, 0, b.width, b.height)
            });
            $("#drop_wrap").css({width: "216px", height: "244px"});
            c.css({width: "200px", height: "200px", left: "0px"})
        }
    }

    function n(a) {
        var a = a || false;
        var b = $("#rect_shape"), c = $("#circle_shape"), d = $("#poly_shape"), e = $("#empty_shape");
        var f = e[0].getContext("2d");
        var g = b[0].getContext("2d");
        var h = c[0].getContext("2d");
        var i = d[0].getContext("2d");
        $.imageMapper.clearCanvas(b[0], g);
        $.imageMapper.clearCanvas(c[0], h);
        $.imageMapper.clearCanvas(d[0], i);
        var j = $(".start").width();
        var k = $(".start").height();
        var l = $.imageMapper.colors[0].replace(/1/ig, "0.8");
        var m = "#909090";
        var n = "rgba(90, 90, 90, .4)";
        $(".shapes").attr({width: j + "px", height: k + "px"});
        var o = b.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawRect(g, {x: 4, y: 4}, {x: j - 4, y: k - 4}, l, 2, o);
        o = c.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawCircle(h, {x: j / 2, y: k / 2}, j / 2 - 4, l, 2, o);
        var p = [{x: 4, y: 4}, {x: j / 2, y: k / 2 - 4}, {x: j - 4, y: 4}, {x: j - 4, y: k - 4}, {
            x: j / 2,
            y: k / 2 + 4
        }, {x: 4, y: k - 4}];
        o = d.parent().hasClass("selected") ? n : m;
        $.imageMapper.drawPoly(i, p, l, 2, o);
        p = [{x: 8, y: 8}, {x: 8, y: 24}, {x: 12, y: 18}, {x: 36, y: 42}, {x: 42, y: 36}, {x: 18, y: 12}, {
            x: 22,
            y: 8
        }];
        o = e.parent().hasClass("selected") ? n : m;
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
            $(".control").attr({width: j + "px", height: k + "px"});
            l = $.imageMapper.colors[0].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 2, y: k / 2}, j / 4, l, 1, o);
            l = $.imageMapper.colors[1].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 6, y: k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[2].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: 5 * j / 6, y: k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[3].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: j / 6, y: 5 * k / 6}, j / 8, l, 1, o);
            l = $.imageMapper.colors[4].replace(/1/ig, "0.8");
            o = l;
            $.imageMapper.drawCircle(u, {x: 5 * j / 6, y: 5 * k / 6}, j / 8, l, 1, o);
            l = s.parent().hasClass("selected") ? "#111" : "#444";
            o = s.parent().hasClass("selected") ? n : m;
            $.imageMapper.drawCircle(w, {x: j / 3, y: k / 3}, j / 4, l, 2, o);
            $.imageMapper.drawLine(w, {x: j / 2, y: k / 2}, {x: 6 * j / 7 + 1, y: 6 * k / 7 + 1}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 2, y: k / 2}, {x: 6 * j / 7 + 2, y: 6 * k / 7}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 2, y: k / 2}, {x: 6 * j / 7, y: 6 * k / 7 + 2}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 3 - 8, y: k / 3}, {x: j / 3 + 8, y: k / 3}, l, 3);
            $.imageMapper.drawLine(w, {x: j / 3, y: k / 3 - 8}, {x: j / 3, y: k / 3 + 8}, l, 3);
            l = t.parent().hasClass("selected") ? "#111" : "#444";
            o = t.parent().hasClass("selected") ? n : m;
            $.imageMapper.drawCircle(x, {x: j / 3, y: k / 3}, j / 4, l, 2, o);
            $.imageMapper.drawLine(x, {x: j / 2, y: k / 2}, {x: 6 * j / 7 + 1, y: 6 * k / 7 + 1}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 2, y: k / 2}, {x: 6 * j / 7 + 2, y: 6 * k / 7}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 2, y: k / 2}, {x: 6 * j / 7, y: 6 * k / 7 + 2}, l, 3);
            $.imageMapper.drawLine(x, {x: j / 3 - 8, y: k / 3}, {x: j / 3 + 8, y: k / 3}, l, 3);
            v.translate(j / 2, k / 2);
            v.rotate(30 * Math.PI / 180);
            $.imageMapper.drawRect(v, {x: 23 - j / 2, y: 15 - k / 2}, {
                x: 27 - j / 2,
                y: 37 - k / 2
            }, "#111", 1, "#DAA520");
            $.imageMapper.drawRect(v, {x: 23 - j / 2, y: 37 - k / 2}, {
                x: 27 - j / 2,
                y: 40 - k / 2
            }, "#808080", 2, "#a0a0a0");
            p = [{x: 23 - j / 2, y: 15 - k / 2}, {x: 25 - j / 2, y: 10 - k / 2}, {x: 27 - j / 2, y: 15 - k / 2}];
            $.imageMapper.drawPoly(v, p, "#F5DEB3", 2, "#F5DEB3");
            $.imageMapper.drawRect(v, {x: 23 - j / 2, y: 40 - k / 2}, {
                x: 27 - j / 2,
                y: 42 - k / 2
            }, "#FFFAFA", 2, "#FFFAFA")
        }
    }

    $.post("check.php", {}, function () {
    });
    var a = new Image, b, c = $("#droparea"), d = $("#local_button").attr("disabled", true), e = $("#remote_button").attr("disabled", true), f = $("#remote_select").val(""), g = $("<input />").attr({
        type: "file",
        id: "upload",
        multiple: true
    }).css({visibility: "hidden", opacity: 0, position: "absolute"}).insertAfter(d);
    var h = null;
    var i = 0;
    var j = null;
    j = setInterval(function () {
        val = f.val();
        e.attr("disabled", true);
        if (val.length) {
            e.attr("disabled", false)
        }
    }, 300);
    $(window).resize(function () {
        $.imageMapper.windowResizeHandler()
    });
    $("a.allowed_images").click(function () {
        var a = $(this);
        f.val(a.html());
        e.click();
        return false
    });
    a.onload = function () {
        $("#error").html("");
        l(a, "jpeg")
    };
    a.onerror = a.obabort = function (a) {
        m();
        $("#error").html("Oops! This file doesn't contain an image").css({
            color: "#DB0000",
            top: "-40px",
            "margin-left": "-200px",
            "font-size": "24px"
        })
    };
    e.click(function () {
        var b = f.val();
        var c = $("a.allowed_images");
        $.each(c, function (c, d) {
            if (d == b && /latoclient\.it\/mapper\/images/i.test(b))a.src = b
        });
        c.parent().css({"z-index": 0}).addClass("hidden")
    });
    $("#map").click(function () {
        if ($("#hide").hasClass("hidden")) {
            $(this).addClass("hidden");
            $("#load, #hide").removeClass("hidden")
        }
    });
    $("#hide").click(function () {
        $("#map").removeClass("hidden");
        $("#load, #hide, #result").addClass("hidden")
    });
    $(".tools").click(function () {
        var a = $(this);
        $(".tools").removeClass("selected");
        a.addClass("selected");
        n()
    });
    $(".read-only").on("click", function () {
        $(this).blur()
    });
    $(".area-params, .default-params").on("keyup", function () {
        var a = $(this);
        var b = a.val();
        var c = a.attr("id");
        $.imageMapper.setParam(c, b);
        if (!$("#hide").hasClass("hidden"))$.imageMapper.update_map()
    });
    $("select#areatarget, select#defaulttarget").change(function () {
        var a = $(this);
        var b = a.val();
        var c = a.attr("id");
        $.imageMapper.setParam(c, b);
        if (!$("#hide").hasClass("hidden"))$.imageMapper.update_map()
    });
    $("#target-width").on("keyup", function () {
        $.imageMapper.targetw = $(this).val();
        if (!$("#hide").hasClass("hidden"))$.imageMapper.update_map()
    });
    $("#target-height").on("keyup", function () {
        $.imageMapper.targeth = $(this).val();
        if (!$("#hide").hasClass("hidden"))$.imageMapper.update_map()
    });
    $(".zoom").hover(function () {
        $(".zoom").removeClass("selected");
        $(this).addClass("selected");
        n(true)
    }, function () {
        $(this).removeClass("selected");
        n(true)
    });
    $("#pencil, #remove").hover(function () {
        $(this).addClass("selected")
    }, function () {
        $(this).removeClass("selected")
    });
    $("#pencil_color").click(function (a) {
        $.imageMapper.selectColor(this, a);
        n(true)
    });
    $(".zoom").click(function () {
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
        f.attr({width: n * e + "px", height: o * e + "px"});
        j.scale(e, e);
        j.drawImage(h, 0, 0);
        k.clearRect(0, 0, l, m);
        g.attr({width: n * e + "px", height: o * e + "px"});
        $.imageMapper.scaleShapes();
        $("#drop_wrap").css({
            width: n * e + 20 + parseInt(c.css("marginLeft")) + parseInt(c.css("marginRight")) + parseInt(c.css("borderLeftWidth")) + parseInt(c.css("borderRightWidth")) + "px",
            height: o * e + parseInt(c.css("marginTop")) + parseInt(c.css("marginBottom")) + parseInt(c.css("borderTopWidth")) + parseInt(c.css("borderBottomWidth")) + "px"
        });
        var p = c.offset(), q = p.left;
        c.offset({top: p.top, left: Math.round(p.left)});
        $("#droparea").css({width: n * e + "px", height: o * e + "px"});
        $("#curr-width").val(Math.floor(n * e));
        $("#curr-height").val(Math.floor(o * e))
    });
    var k = function (a) {
        var c = new FileReader;
        c.onload = function (c) {
            if (/image/i.test(a.type)) {
                b = $('<img id = "map_image" />').load(function () {
                    l(this, a.type)
                }).attr("src", c.target.result);
                $("#error").html("")
            } else {
                m();
                $("#error").html("Oops! This file doesn't contain an image").css({
                    color: "#DB0000",
                    top: "-40px",
                    "margin-left": "-200px",
                    "font-size": "24px"
                })
            }
        };
        c.readAsDataURL(a)
    };
    var l = function (a, b) {
        m();
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
        if ((k - i) % 2 == 1)$("body").width(k + 1 + "px");
        $("#drop_wrap").css({
            width: i + 17 + parseInt(c.css("marginLeft")) + parseInt(c.css("marginRight")) + parseInt(c.css("borderLeftWidth")) + parseInt(c.css("borderRightWidth")) + "px",
            height: j + parseInt(c.css("marginTop")) + parseInt(c.css("marginBottom")) + parseInt(c.css("borderTopWidth")) + parseInt(c.css("borderBottomWidth")) + "px"
        });
        var l = c.offset(), o = l.left;
        c.offset({top: l.top, left: Math.round(l.left)});
        $(d).attr({width: i + "px", height: j + "px", id: "canvas0"}).css({
            position: "absolute",
            top: 0,
            left: 0,
            "z-index": 0
        });
        g.attr({width: i + "px", height: j + "px", id: "canvas1"}).css({
            position: "absolute",
            top: 0,
            left: 0,
            "z-index": 1
        });
        $(h).attr({width: i + "px", height: j + "px"});
        e.clearRect(0, 0, i, j);
        e.drawImage(a, 0, 0, i, j);
        f.drawImage(a, 0, 0, i, j);
        $("#droparea").css({width: i + "px", height: j + "px"}).append(d).append(g);
        $("#dashboard, #image-params").removeClass("hidden");
        if ($.imageMapper.initialized) {
            $.imageMapper.init({
                zoom: 1,
                ratio: 1,
                targetw: $("#target-width").val(),
                targeth: $("#target-height").val()
            });
            $.imageMapper.stop.click()
        } else {
            $.imageMapper.init({
                theCanvas: g,
                start: $(".start"),
                stop: $("#stop"),
                rect: $("#rect"),
                poly: $("#poly"),
                circle: $("#circle"),
                remove: $("#remove"),
                pencil: $("#pencil"),
                edit: $("#edit"),
                map: $("#map"),
                load: $("#load"),
                hide: $("#hide"),
                dashboard: $("div#dashboard"),
                image: $("#image-params"),
                area: $("#area-params"),
                targetw: $("#target-width").val(),
                targeth: $("#target-height").val(),
                result: $("div#result"),
                xyInfo: $(".canvas_info"),
                border: 8,
                zoom: 1
            })
        }
        n(true);
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
        $("#error").html(o).css({color: "#DB0000", top: "150px", "margin-left": "-240px", "font-size": "24px"})
    }
})