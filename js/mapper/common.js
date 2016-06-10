var Request = {
    QueryString : function(val, href){
        var uri = href || window.location.search;
        uri = uri.replace(/#.*$/, '');
        var re = new RegExp("" +val+ "=([^&?]*)", "ig");
        return ((uri.match(re))?(uri.match(re)[0].substr(val.length+1)):null);
    }
};
Math.rand = function(l,u){
    return Math.floor((Math.random() * (u-l+1))+l);
};

function randColor(withSharp){
    var rdc = function(){  return Math.rand(0, 255);};
    return sprintf('%s%x%x%x', (withSharp ? '#':''), rdc(), rdc(), rdc()).toUpperCase();
}

function sprintf() {
    var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) {
            o.push(m[0]);
        }
        else if (m = /^\x25{2}/.exec(f)) {
            o.push('%');
        }
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                throw('Too few arguments.');
            }
            if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                throw('Expecting number but found ' + typeof(a));
            }
            switch (m[7]) {
                case 'b': a = a.toString(2); break;
                case 'c': a = String.fromCharCode(a); break;
                case 'd': a = parseInt(a); break;
                case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                case 'o': a = a.toString(8); break;
                case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                case 'u': a = Math.abs(a); break;
                case 'x': a = a.toString(16); break;
                case 'X': a = a.toString(16).toUpperCase(); break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        }
        else {
            throw('Huh ?!');
        }
        f = f.substring(m[0].length);
    }
    return o.join('');
}

function isFunc(a){
    return typeof window[a] == 'function';
}

// helper to return only unique values in an array

Array.prototype.unique = function () {
    var o = {}, i, l = this.length,
        r = [];
    for (i = 0; i < l; i += 1) o[this[i]] = this[i];
    for (i in o) r.push(o[i]);
    return r;
};

$(function(){
    $(function(){
        var str = Request.QueryString('param');
        var src = Request.QueryString('src');
        var areas = [];
        var list = $('#boundList');

        //var $image = $('#image_wrapper img');
        var $image = $('<img id = "map_image" />').load(function(e) {
           console.log(e.target.naturalWidth, e.target.naturalHeight);
           if(e.target.naturalWidth > 768){
               $(e.target).attr('width', 768);
           }
           render();
        }).attr("src", src).appendTo($('#image_wrapper'));

        function render(){
            if(str.length > 5) {
                var map = JSON.parse(unescape(str));
                console.log(map);
                $("body").append(map);
                var $map = $('map').last();
                var theme = $map.attr('name') || $('#map_image')[0].src.replace(/.*?\/(\w*).(?:jpg|jpeg|png)/, '$1');
                if(theme){
                    $('title').text(theme);
                    isFunc('liClick') && liClick(theme);
                }

                var states = Array.prototype.map.call($map.find('area'),
                    function (e) {
                        return e.getAttribute('name');
                    }).unique()
                    .sort()
                    .forEach(function (e) {
                        var el = $('<li />').attr('name', e).text(e);
                        list.append(el);
                    });
                $image.attr('usemap', '#' + $map[0].name);
                $map.find('area').each(function(k, o){
                    var tmp = $(o);
                    var name = tmp.attr('name');
                    if(name){
                        //o.href = '#';
                        $(o).hover(function(e){
                            console.log(name, isFunc('mouseIn'));
                            isFunc('mouseIn') && mouseIn(this, e);
                        },function(e){
                            isFunc('mouseOut') && mouseOut(this, e);
                        });
                        areas.push({
                            key: name,
                            strokeColor: randColor(),
                            toolTip: name,
                            fillColor: '85178f'//randColor()
                        });
                    }
                });
            }
            if(areas.length){
                $image.mapster({
                    fillOpacity: 0.4,
                    fillColor: "d42e16",
                    stroke: true,
                    strokeColor: "3320FF",
                    strokeOpacity: 0.8,
                    strokeWidth: 4,
                    singleSelect: false,
                    mapKey: 'name',
                    listKey: 'name',
                    boundList: list.find('li'),
                    listSelectedClass: 'selected',
                    onClick: function (e) {
                        if(isFunc('updateTooltip')) {
                            $image.mapster('set_options', {
                                areas: [{
                                    key: e.key,
                                    toolTip: updateTooltip(e.key)
                                }]
                            });
                        }
                    },
                    showToolTip: true,
                    toolTipClose: ['area-mouseout', "tooltip-click", "area-click"],
                    areas: areas,
                    toolTipContainer: '<div style="border: 2px solid black; background: #2c8b12; width:160px; padding:4px; margin: 4px; -moz-box-shadow: 3px 3px 5px #535353; ' +
                        '-webkit-box-shadow: 3px 3px 5px #535353; box-shadow: 3px 3px 5px #535353; -moz-border-radius: 6px 6px 6px 6px; -webkit-border-radius: 6px; ' +
                        'border-radius: 6px 6px 6px 6px; opacity: 0.9;"></dteniv>'
                });

                // bind click event
                $(document).on('click','#boundList li',function(e) {
                    var el = $(e.target);
                    // el.toggleClass('selected');
                    //debugger;
                    $image.mapster('set', null, el.attr('name'));
                    isFunc('liClick') && liClick(el.attr('name'));
                    // changing selections manually doesn't result in the boundList
                    // being fired, we still have to set the state on the list item
                }).on('click','#clearAll',function(e) {
                    e.preventDefault();
                    $image.mapster('set', false, $image.mapster('get'));
                });
            }
        }
    });
});