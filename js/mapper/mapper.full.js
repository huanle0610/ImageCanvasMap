jQuery.imageMapper = (function($){
	M = {
		initialized	:false,
		theCanvas	:null,
		width		:null,
		height		:null,
		shapes		:[],
		points		:[],
		status 		:'edit',
		start		:null,
		stop		:null,
		rect		:null,
		poly		:null,
		circle		:null,
		map			:null,
		remove		:null,
		pencil		:null,
		edit		:null,
		dashboard	:null,
		area		:null,
		targetw		:null,
		targeth		:null,
		result		:null,
		xyInfo		:null,
		ratio		:1,
		zoom		:1,
		radius		:2,
		lineWidth	:1,
		fillColor	:'rgba(128, 128, 128, .5)',
		fillSelect	:'rgba(128, 128, 128, .9)',
		border		:8,
		colors		:['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 255, 1)'],
		curColor	:'rgba(255, 0, 0, 1)',
		ctx			:null
	};

    function doUpdate_map() {
        var b = M.targetw / M.theCanvas[0].width;
        var c = M.targeth / M.theCanvas[0].height;
        var d = (b + c) / 2;
        if (!setStatus_Drawing())
            w();
        M.windowResizeHandler();
        var e = M.result.find("textarea");
        var g = M["mapname"] ? M["mapname"] : "";
        var h = "<map name='" + g + "'>\n";
        a.each(M.shapes, function(e, f) {
            if (f.length) {
                var g = "";
                var i = f["areaurl"];
                if (!i)
                    i = "#";
                var j = "'" + i + "'";
                if (f["idname"])
                    j += " name = '" + f["idname"] + "'";
                if (f["classname"])
                    j += " class = '" + f["classname"] + "'";
                if (f["alttext"])
                    j += " alt = '" + f["alttext"] + "' title = '" + f["alttext"] + "'";
                if (f["areatarget"] && f["areatarget"] != "none")
                    j += " target = '" + f["areatarget"] + "'";
                switch (f.type) {
                    case "poly":
                        a.each(f, function(a, d) {
                            if (a == 0)
                                g = "'" + Math.floor(b * d["x"]) + ", " + Math.floor(c * d["y"]);
                            else
                                g = g + ", " + Math.floor(b * d["x"]) + ", " + Math.floor(c * d["y"])
                        });
                        h = h + "<area shape='poly' coords=" + g + "' href=" + j + " />\n";
                        break;
                    case "rect":
                        g = "'" + Math.floor(b * f.point1["x"]) + ", " + Math.floor(c * f.point1["y"]) + ", " + Math.floor(b * f.point2["x"]) + ", " + Math.floor(c * f.point2["y"]);
                        h = h + "<area shape='rect' coords=" + g + "' href=" + j + " />\n";
                        break;
                    case "circle":
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
            if (M["defaulttarget"] && M["defaulttarget"] != "none")
                h += " target='" + M["defaulttarget"] + "'";
            h += " />\n"
        }
        h += "</map>";
        e.val(h)
    };

	/**
	* the mouse move event handler
	*
	* @param canvas	 : the canvas
	* @param mousePos: the mouse position 
	*/	
	function moveMouse(canvas, mousePos) {
		if(M.mouse_down) moveShape(canvas, mousePos);
		//if we are not in the drawing mode and the cursors are disabled, we have nothing to do, so we can just return
		if(!drawing() || !mouse_clicked()) return;
		
		var ctx = M.ctx, x = mousePos.x, y = mousePos.y;
		
		//we have to clear the canvas and then re-draw it, taking into account the new mouse position
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//finally, we re-draw all the shapes, taking into account the new mouse position
		$.each(M.shapes, function(idx, shape){
			if( (idx < M.shapes.length - 1) || (!drawing()))
				drawShape(ctx, shape, M.curColor, M.lineWidth, shape.fillColor, 0);
			else
				drawShape(ctx, shape, M.curColor, M.lineWidth, shape.fillColor, mousePos);
		});
	};
	/**
	* the mouse move event handler when a shape is edited
	*
	* @param canvas	 : the canvas
	* @param mousePos: the mouse position 
	*/	
	function moveShape(canvas, mousePos){
		var current = M.current - 1;
		var currentMousePos = M.shapes[current]['mousePos'];
		var shape = M.shapes[current];
		var dx = mousePos.x - currentMousePos.x;
		var dy = mousePos.y - currentMousePos.y;
		if(M.points.length){
			$.each(M.points, function(idx, point){
				M.points[idx]['x'] = point.x + dx;
				M.points[idx]['y'] = point.y + dy;
			});
		}
		M.shapes[current]['mousePos'] = mousePos;
		switch(shape.type){
			case 'poly':
				var check = true;
				$.each(shape, function(idx, point){
					if( (point.x + dx < 0) || (point.x + dx > M.theCanvas[0].width) || (point.y + dy < 0) || (point.y + dy > M.theCanvas[0].height) ) 
						check = false;
				});
				$.each(shape, function(idx, point){
					if(check ) {
						M.shapes[current][idx].x += dx;
						M.shapes[current][idx].y += dy;
					}
				});
				break;
			case 'rect':
				if( ((M.shapes[current]['x_min'] + dx) >= 0) && ((M.shapes[current]['y_min'] + dy) >= 0) && ((M.shapes[current]['x_max'] + dx) <= M.theCanvas[0].width) && ((M.shapes[current]['y_max'] + dy) <= M.theCanvas[0].height)){
					M.shapes[current]['point1']['x'] += dx;
					M.shapes[current]['point1']['y'] += dy;
					M.shapes[current]['point2']['x'] += dx;
					M.shapes[current]['point2']['y'] += dy;
					M.shapes[current]['x_min'] += dx;
					M.shapes[current]['x_max'] += dx;
					M.shapes[current]['y_min'] += dy;
					M.shapes[current]['y_max'] += dy;
				}
				break;
			case 'circle':
				if( (M.shapes[current]['center']['x'] + dx >= 0) && (M.shapes[current]['center']['y'] + dy >= 0) && (M.shapes[current]['center']['x'] + dx < M.theCanvas[0].width) && (M.shapes[current]['center']['y'] + dy < M.theCanvas[0].height)){
					M.shapes[current]['center']['x'] += dx;
					M.shapes[current]['center']['y'] += dy;
				}
				break;
			default: break;
		}
		clearCanvas();
		shapeRedraw();
	}
	
	/**
	* get the relative mouse position in the canvas, to call as a consequence of a mouse event (click, move, ...)
	*
	* @param canvas	 : the canvas
	* @param evt	 : the event object 
	*/
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect(), root = document.documentElement;

		// return relative mouse position
		var mouseY = evt.clientY - rect.top - root.scrollTop;// - $(canvas).parent().parent().scrollTop();
		var mouseX = evt.clientX - rect.left - root.scrollLeft;// - $(canvas).parent().parent().scrollLeft();
		
		var mouseY = evt.pageY - rect.top - root.scrollTop;
		var mouseX = evt.pageX - rect.left - root.scrollLeft;
		
		return {
			x: mouseX,
			y: mouseY
		};
	};

		/**
	* check if the status of the mapper is idle
	*
	* @return 	 : boolean
	*/
	function idle(){
		return M.status == 'idle';
	}
	
	/**
	* check if the status of the mapper is drawing
	*
	* @return 	 : boolean
	*/
	function drawing(){
		return M.status == 'drawing';
	}
	/**
	* check if the mouse has been pushed down
	*
	* @return 	 : boolean
	*/
	function mouse_clicked(){
		return M.mouse_clicked;
	}
	
	/**
	* check if the status of the mapper is edit
	*
	* @return 	 : boolean
	*/
	function edit(){
		return M.status == 'edit';
	}
	
	/**
	* draw a circle, optionally filled
	*
	* @param ctx	: the context
	* @param center	: the center point
	* @param r		: the radius
	* @param sc		: strokeStyle (color)	
	* @param lw		: lineWidth
	* @param fc		: fillstyle (color)
	*/
	function drawCircle(ctx, center, r, sc, lw, fc, mousePos, withPoints){
		if(!center) return;
		var x = center.x, y = center.y;
		ctx.strokeStyle = sc || ctx.strokeStyle;
		ctx.lineWidth = lw || ctx.lineWidth;
		ctx.fillStyle = fc || ctx.fillStyle;
		
		//if the r parameter is null, it means that we are constructing a circle, so we determine the radius based on the mouse position
		if(!r){
			r = Math.sqrt((mousePos['x'] - x)*(mousePos['x'] - x) + (mousePos['y'] - y)*(mousePos['y'] - y));
			
			//also, we connect the center point with the pouse position, drawing a radius
			drawLine(ctx, center, mousePos, sc, lw);
		}
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
		
		//if we are in the edit mode and this circle is selected
		if(withPoints){
			setPoint(ctx, center, M.radius, M.curColor, M.lineWidth, M.curColor);
			drawLine(ctx, center, {x:center.x + r, y:center.y}, sc, lw);
			setPoint(ctx, {x:center.x + r, y:center.y}, 4, M.curColor, M.lineWidth, M.curColor);
			drawLine(ctx, center, {x:center.x - r, y:center.y}, sc, lw);
			setPoint(ctx, {x:center.x - r, y:center.y}, 4, M.curColor, M.lineWidth, M.curColor);
			drawLine(ctx, center, {x:center.x, y:center.y + r}, sc, lw);
			setPoint(ctx, {x:center.x, y:center.y + r}, 4, M.curColor, M.lineWidth, M.curColor);
			drawLine(ctx, center, {x:center.x, y:center.y - r}, sc, lw);
			setPoint(ctx, {x:center.x, y:center.y - r}, 4, M.curColor, M.lineWidth, M.curColor);
		}
	}

	/**
	* draw a line between 2 given points
	*
	* @param ctx	: the context
	* @param point1	: firts point
	* @param point2	: second point
	* @param sc		: strokeStyle (color)	
	* @param lw		: lineWidth
	*/
	function drawLine(ctx, point1, point2, sc, lw){
		ctx.strokeStyle = sc;
		ctx.lineWidth = lw;
		ctx.beginPath();
		ctx.moveTo(point1['x'], point1['y']);
		ctx.lineTo(point2['x'], point2['y']);
		ctx.closePath();
		ctx.stroke();
	}
	
	/**
	* draw a point as a filled circle
	*
	* @param ctx	: the context
	* @param center	: the center point
	* @param r		: the radius
	* @param sc		: strokeStyle (color)	
	* @param lw		: lineWidth
	* @param fc		: fillstyle (color)
	*/	
	function setPoint(ctx, center, r, sc, lw, fc){
		drawCircle(ctx, center, r, sc, 1, fc, 0);
	};
	
	/**
	* draw a polygon: a sequence of points connected by lines
	*
	* @param ctx	 : the context
	* @param path	 : a set of points
	* @param sc		 : strokeStyle (color)	
	* @param lw		 : lineWidth
	* @param mousePos: mouse position, if in the drawing mode, 0 otherwise
	*/	
	function drawPoly(ctx, path, sc, lw, fc, mousePos, withPoints){
		if(path.length == 0) return;
		var startPoint = path[0];
		
		//then, we draw the lines that connect the points
		ctx.beginPath();
		ctx.moveTo(startPoint['x'], startPoint['y']);
		ctx.strokeStyle = sc || ctx.strokeStyle;
		ctx.fillStyle = fc || ctx.fillStyle
		ctx.lineWidth = lw;
		for(i = 1; i < path.length; i++){
			ctx.lineTo(path[i]['x'], path[i]['y']);
		}
		
		//if we are in the drawing mode (so, mousePos is not zero), we draw the line that connects the last point with the current mouse position.
		if(mousePos) 
			ctx.lineTo(mousePos['x'], mousePos['y']);
			
		//finally, we connect the last/current point to the first one, to close the polygon
		ctx.lineTo(startPoint['x'], startPoint['y']);
		
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		//if we are drawing the poly, we draw all the points, using the parameters set in the M object. We draw a point as a filled circle with a given radius: the point is the center of the filled circle.
		if( (path.status == 'drawing') || (withPoints)){
			$.each(path, function(idx, center){
				var radius = withPoints ? 4 : M.radius;
				setPoint(ctx, center, radius, M.curColor, M.lineWidth, M.curColor);
			});
		}
	};
	
	/**
	* draw a rectangle: a special type of polygon
	*
	* @param ctx	 : the context
	* @param path	 : a set of 2 points: we just need 2 points to determine a unique rectangle
	* @param sc		 : strokeStyle (color)	
	* @param lw		 : lineWidth
	* @param mousePos: mouse position, if in the drawing mode, 0 otherwise
	*/
	function drawRect(ctx, point1, point2, sc, lw, fc, mousePos, withPoints){
		ctx.strokeStyle = sc || ctx.strokeStyle;
		ctx.lineWidth = lw || ctx.lineWidth;
		ctx.fillStyle = fc || ctx.fillStyle;
		
		if( (!point2) && point1 && mousePos){
			var p2x = mousePos.x - point1.x, p2y = mousePos.y - point1.y, dx = p2x/Math.abs(p2x), dy = p2y/Math.abs(p2y);
			ctx.strokeRect(point1.x, point1.y, p2x, p2y);
			ctx.fillRect(point1.x + lw*dx/2, point1.y + lw*dy/2, p2x - lw*dx, p2y - lw*dy);
		}
		else if (point1 && point2){
			var p2x = point2.x - point1.x, p2y = point2.y - point1.y, dx = p2x/Math.abs(p2x), dy = p2y/Math.abs(p2y);
			ctx.strokeRect(point1.x, point1.y, p2x, p2y);
			ctx.fillRect(point1.x + lw*dx/2, point1.y + lw*dy/2, p2x - lw*dx, p2y - lw*dy);
		}
		else return;
		
		if(withPoints){
			setPoint(ctx, point1, 4, M.curColor, M.lineWidth, M.curColor);
			setPoint(ctx, point2, 4, M.curColor, M.lineWidth, M.curColor);
			setPoint(ctx, {x:point1.x, y:point2.y}, 4, M.curColor, M.lineWidth, M.curColor);
			setPoint(ctx, {x:point2.x, y:point1.y}, 4, M.curColor, M.lineWidth, M.curColor);
		}
		//this is a patch, to eliminate a little circle that I see around the top-left corner, in all the browsers
		ctx.beginPath();
		ctx.arc(0, 0, 0, 0, 2 * Math.PI, false);
			
		ctx.stroke();
	};

	/**
	* draw a shape: a shape can be a circle, a polygon or a rectangle. This function will call a more specific function, based on the shape type.
	*
	* @param ctx	 : the context
	* @param shape	 : a circle or a polygon or a rectangle
	* @param sc		 : strokeStyle (color)	
	* @param lw		 : lineWidth
	* @param mousePos: mouse position, if in the drawing mode, 0 otherwise
	*/
	function drawShape(ctx, shape, sc, lw, fc, mousePos, withPoints){//sc = strokeStyle color, lw = lineWidth
		var withPoints = withPoints || false;
		switch(shape.type){
			case 'poly':
				drawPoly(ctx, shape, sc, lw, fc, mousePos, withPoints);
				break;
			case 'rect':
				//setPoint(ctx, shape.point1, M.radius, M.curColor, M.lineWidth, M.curColor);
				drawRect(ctx, shape.point1, shape.point2, sc, lw, fc, mousePos, withPoints);
				break;
			case 'circle':
				//optionally draw the center point
				//setPoint(ctx, shape['center'], M.radius, M.curColor, M.lineWidth, M.curColor);
				drawCircle(ctx, shape['center'], shape['radius'], sc, lw, fc, mousePos, withPoints);
				break;
			default: break;
		}
	}
	/**
	* determine the distance between 2 given points
	*
	* @param pt1	: the point 1
	* @param pt2	: the point 2
	*
	* @return		: a distance
	*/
	function pDistance(pt1, pt2){
		return Math.sqrt((pt1.x - pt2.x)*(pt1.x - pt2.x) + (pt1.y - pt2.y)*(pt1.y - pt2.y));
	}	
	/**
	* determine if the given point is in the given polygon
	*
	* @param poly	: the polygon
	* @param pt	 	: the point
	*
	* @return		: boolean: true if the pt is in the poly
	*/
	function isPointInPoly(poly, pt){
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
			((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
			&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
			&& (c = !c);
			
	return c;
	}
	
	/**
	* determine if the given point is in the given rectangle
	*
	* @param rect	: the rectangle
	* @param pt	 	: the point
	*
	* @return		: boolean: true if the pt is in the rectangle
	*/
	function isPointInRect(rect, pt){
		return (pt.x >= rect.x_min) && (pt.x <= rect.x_max) && (pt.y >= rect.y_min) && (pt.y <= rect.y_max);
	}
	
	/**
	* determine if the given point is in the given rectangle
	*
	* @param circle	: the circle
	* @param pt	 	: the point
	*
	* @return		: boolean: true if the pt is in the circle
	*/
	function isPointInCircle(circle, pt){
		return pDistance(circle.center, pt) <= circle.radius;
	}
	
	/**
	* determine if the given point is in the given shape
	*
	* @param shape	: the shape to check if the is in
	* @param pt	 	: the point
	*
	* @return		: boolean: true if the pt is in the shape
	*/
	function isPointInShape(shape, pt){
		shape.type = shape.type || '';
		switch(shape.type){
			case 'poly': 	return isPointInPoly(shape, pt);
			case 'rect': 	return isPointInRect(shape, pt);
			case 'circle': 	return isPointInCircle(shape, pt);
		}
		return false;
	}

	/**
	* clear the whole canvas
	*/	
	function clearCanvas(canvas, ctx){
		var canvas = canvas || M.theCanvas[0];
		var ctx = ctx || M.ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	/**
	* scan the whole M.shapes array and redraw all the shapes
	*/	
	function shapeRedraw(status){
		$.each(M.shapes, function(idx, shape){
			if(status){
				shape.fillColor = (status == 'edit') ? M.fillSelect : M.fillColor;
				shape.status    = status;
			}
			drawShape(M.ctx, shape, M.curColor, M.lineWidth, shape.fillColor, 0, M.current == (idx + 1));
		});
	}

	/**
	* remove the last element in the M.shapes array, if not a valid shape
	*
	* @return : M.shapes length
	*/	
	function removeLast(){
		if(M.shapes.length){
			var last = M.shapes.pop();
			//if the last element is not empty (or it is modifying, as a poly with less than 3 points) re-insert it in the M.shapes array
			if((last.length > 2) || last.modify) M.shapes.push(last);
			
			//we return the length, that could be useful
			return M.shapes.length;
		}
	}
	
	/**
	* the init function of the mapper object. This is the function to call to construct the mapper object.
	*
	* @param o	 : the configuration object. It can contain a subset of the mapper parameters.
	*/	
	M.init = function(o){
		//for each property passed in the "o" parameter, we set the corresponding property in the mapper.
		//All the properties not passed in the "o" parameter will have the default value
		for(prop in o){
			M[prop] = o[prop];
		}
		
		M.width = M.theCanvas[0].width;
		M.height = M.theCanvas[0].height;
		//we get the canvas context and set it as a mapper parameter, to use everywhere we need it
		M.ctx = M.theCanvas[0].getContext('2d');
		
		//empty the shapes array
		M.shapes = [];
		M.points = [];

		if(!M.initialized){
			M.drawRect = drawRect;
			M.drawCircle = drawCircle;
			M.drawPoly = drawPoly;
			M.drawLine = drawLine;
			M.clearCanvas = clearCanvas;
            M.update_map = doUpdate_map;

			//we set the event handlers, that are the "core" of the mapper functionalities
			M.setEvents();
		
			M.initialized = true;
		}
	};

	/**
	* This function set a given parameter to the current shape, is exists
	*
	* @param param	 : the parameter name. One of: areaurl, alttext, idname, classname and areatarget
	* @param val	 : the value of the parameter.
	*/	
	M.setParam = function(param, val){
		if( (param == 'mapname') || (param == 'defaulturl') || (param == 'defaulttarget')){
			M[param] = val;
			return;
		}
		if( (!M.current) || (!param) || (!val)) return;
		if( (param != 'areaurl') && (param != 'alttext') && (param != 'idname') && (param != 'classname') && (param != 'areatarget')) return;
		M.shapes[M.current - 1][param] = val;
	}

	/**
	* This function adjust all the shapes when the user zooms the image
	*/	
	M.scaleShapes = function(){
		var ratio = M.ratio;
		$.each(M.shapes, function(idx, shape){
			if(shape.length){
				switch(shape.type){
					case 'poly':
						$.each(shape, function(i, point){
							shape[i]['x'] *= ratio;
							shape[i]['y'] *= ratio;
						});
						break;
					case 'rect':
						shape['point1']['x'] *= ratio;
						shape['point1']['y'] *= ratio;
						shape['point2']['x'] *= ratio;
						shape['point2']['y'] *= ratio;
						shape['x_min'] *= ratio;
						shape['x_max'] *= ratio;
						shape['y_min'] *= ratio;
						shape['y_max'] *= ratio;
						break;
					case 'circle':
						shape['center']['x'] *= ratio;
						shape['center']['y'] *= ratio;
						shape['radius'] *= ratio;
						break;
					default: brteak;
				}
			}
		});
		clearCanvas();
		shapeRedraw();
	}
	
	/**
	* select one of the 5 colors for the pencil
	*/
	M.selectColor = function(canvas, evt){
		var mousePos = getMousePos(canvas, evt);
		var w = canvas.width, h = canvas.height;
		var path = [{'x':w/6, 'y':h/6}, {'x':5*w/6, 'y':h/6}, {'x':w/6, 'y':5*h/6}, {'x':5*w/6, 'y':5*h/6}];
		$.each(path, function(idx, point){
			if(isPointInCircle({'center':point, radius:w/4}, mousePos)) {
				M.curColor = M.colors[idx + 1];
				var temp = M.colors[0];
				M.colors[0] = M.colors[idx + 1];
				M.colors[idx + 1] = temp;
				
				clearCanvas();
				shapeRedraw();
			}
		});
	}
	
	/**
	* handle the map, hide, load button and the textarea visibility 
	*/	
	M.hideShowMap = function(hs){
		if(hs == 'hide'){
			M.map.addClass('hidden');
			M.load.addClass('hidden');
			M.hide.addClass('hidden');
			M.result.addClass('hidden');
		}
		else{
			M.map.removeClass('hidden');
			M.load.addClass('hidden');
			M.hide.addClass('hidden');
			M.result.addClass('hidden');		
		}
	};
	M.windowResizeHandler = function() {
		try {
			M.result.css("width", "-moz-available")
		} catch (b) {
		}
		var c = M.result[0];
		var d = c.style.width.indexOf("-moz-available") > -1;
		if (!d) {
			var e = $("#body").width();
			M.result.css({width: e - 217 + "px"}).find("textarea").css({width: e - 231 + "px"})
		}
	};
	/**
	* handle the click event when the mapper is in the "drawing" status
	*
	* @param canvas	: the canvas object
	* @param evt	: the event object
	*/
	function handleDrawing(canvas, evt){
		//get the mouse position
		var mousePos = getMousePos(canvas, evt);
				
		//we get the last shape from the shapes array
		var shape = M.shapes.pop();
		shape.fillColor = M.fillColor;
				
		//depending on the shape type, we do different actions
		switch(shape.type){
			case 'poly':
				//we add a new point, based on the mouse position
				shape.push({'x':mousePos.x, 'y':mousePos.y});
						
				//we draw the new point
				setPoint(M.ctx, mousePos, M.radius, M.curColor, M.lineWidth, M.curColor);
						
				//finally, we re-insert the shape in the M.shapes array
				M.shapes.push(shape);
						
				break;
						
			case 'circle':
				//if we still don't have the center point: it's an empty shape.
				if(!shape['center']){
					//we insert the center point in the circle, based on the mouse position
					shape['center'] = {'x':mousePos.x, 'y':mousePos.y};
							
					//we draw the center point
					setPoint(M.ctx, mousePos, M.radius, M.curColor, M.lineWidth, M.curColor);
							
					//finally, we re-insert the shape in the M.shapes array
					M.shapes.push(shape);
					
					//if we are resizing an existent circle
					if(evt.fdi){
						var len = M.shapes.length - 1;
						M.shapes[len]['areaurl'] 	= M.shapes[evt.current - 1]['areaurl'];
						M.shapes[len]['alttext'] 	= M.shapes[evt.current - 1]['alttext'];
						M.shapes[len]['idname'] 	= M.shapes[evt.current - 1]['idname'];
						M.shapes[len]['classname'] 	= M.shapes[evt.current - 1]['classname'];
						M.shapes[len]['areatarget'] = M.shapes[evt.current - 1]['areatarget'];
						M.shapes.splice(evt.current - 1, 1);
						moveMouse(M.theCanvas[0], {'x':evt.pageX2, 'y':evt.pageY2})
						M.shapes[M.shapes.length - 1]['modify'] = true;
					}
							
					break;
				}
						
				//we already have the center point, so we calculate the radius, as the distance between the center and the current mouse position
				var radius = Math.round(pDistance(mousePos, shape['center']));
						
				//we insert the radius in the circle array
				shape['radius'] = radius;
						
				//set the length for check purposes:since for poly the valid lenght is 3 (3 points), we set 3 as a check also for circle (see removeLast())
				shape.length = 3;
				
				shape.status = 'edit';
				
				//release the mouse, to avoid to redraw the canvas continuously
				M.mouse_clicked = false;
						
				//finally, we re-insert the shape in the M.shapes array
				M.shapes.push(shape);
				
				//if we are drawing a new circle
				if(!shape.modify){
					//we insert a new empty circle element in the M.shapes array
					var circle = new Array();
					circle.type = 'circle';
					circle.status = 'drawing';
					M.shapes.push(circle);
				}
				else M.stop.click();//if we are modifying an existent circle
				
				break;
						
			case 'rect':
				//if we still don't have the first point, we just insert it
				if(!shape['point1']){
					//we insert the first point in the rect, based on the mouse position
					shape['point1'] = {'x':mousePos.x, 'y':mousePos.y};
							
					//we draw the center point
					setPoint(M.ctx, mousePos, M.radius, M.curColor, M.lineWidth, M.curColor);
							
					//finally, we re-insert the shape in the M.shapes array
					M.shapes.push(shape);
					
					//if we are resizing an existent rect
					if(evt.fdi){
						var len = M.shapes.length - 1;
						M.shapes[len]['areaurl'] 	= M.shapes[evt.current - 1]['areaurl'];
						M.shapes[len]['alttext'] 	= M.shapes[evt.current - 1]['alttext'];
						M.shapes[len]['idname'] 	= M.shapes[evt.current - 1]['idname'];
						M.shapes[len]['classname'] 	= M.shapes[evt.current - 1]['classname'];
						M.shapes[len]['areatarget'] = M.shapes[evt.current - 1]['areatarget'];
						M.shapes.splice(evt.current - 1, 1);
						moveMouse(M.theCanvas[0], {'x':evt.pageX2, 'y':evt.pageY2})
						M.shapes[M.shapes.length - 1]['modify'] = true;
					}
							
					break;
				}
						 
				shape['point2'] = {'x':mousePos.x, 'y':mousePos.y};
						
				//calculate the x_max, x_min, y_max and y_min: they are used by the isPointInRect function
				shape.x_min = Math.min(shape.point1.x, shape.point2.x);
				shape.x_max = (shape.point1.x == shape.x_min) ? shape.point2.x : shape.point1.x;
				shape.y_min = Math.min(shape.point1.y, shape.point2.y);
				shape.y_max = (shape.point1.y == shape.y_min) ? shape.point2.y : shape.point1.y;
						
				//finally, we re-insert the shape in the M.shapes array
				M.shapes.push(shape);
						
				//set the length for check purposes:since for poly the valid lenght is 3 (3 points), we set 3 as a check also for rect (see removeLast())
				shape.length = 3;
				
				shape.status = 'edit';
				
				//release the mouse, to avoid to redraw the canvas continuously
				M.mouse_clicked = false;
				
				//if we are drawing a new rect
				if(!shape.modify){
					//we insert a new empty rect element in the M.shapes array
					var rect = new Array();
					rect.type = 'rect';
					rect.status = 'drawing';
					M.shapes.push(rect);
				}
				else M.stop.click();//if we are modifying an existent rect
				
				break;
						
			default: break;
		}
				
		/*if(M.shapes.length > 1)
			M.map.removeClass('hidden');*/
		
		evt.stopPropagation();
		evt.preventDefault();
	}
	
	/**
	* handle the click event when the mapper is in the "edit" status
	*
	* @param canvas	: the canvas object
	* @param evt	: the event object
	*/
	function handleEdit(canvas, evt){
		//get the mouse position
		var mousePos = getMousePos(canvas, evt), current;
		
		//first, we check if the user has clicked on a point to resize a shape
		$.each(M.points, function(idx, point){
			//we check if the mouse event occurred on one of the point registered in the M.points array
			if(isPointInCircle({'center':point, radius:4}, mousePos)) {
				//we get the current index of the selected shape to which the clicked point belongs to (saved in the M.point array)
				current = M.points.current;
				
				//we get the selected shape from the shapes array 
				var curr_shape = M.shapes[current - 1];
				
				//we get the shape's type, saved in the M.point array
				var type = M.points.type;
				
				//we put the mapper in the drawing status, because we want to resize the selected shape
				M.status = 'drawing';
				
				//we deselect the selected shape, because now we are in 'drawing' status
				M.current = 0;
				
				//we also hide the area-setting area
				M.area.addClass('hidden');
				
				//we need to fire some mouse event, to "emulate" the user action, as he/she would draw a shape
				var rect = M.theCanvas[0].getBoundingClientRect(), root = document.documentElement;
				evt.type = 'mousedown';
				var e = new jQuery.Event(evt.type);
				
				//the following action depends on the shape type
				switch(type){
					case 'poly':
						//we iterate on the poly points to find what is the point clicked
						var found = false;
						$.each(curr_shape, function(idx, p){
							if( (p.x == point.x) && (p.y == point.y) && !found){
								//we found the point clicked: we don't need to continue to iterate
								found = true;
								
								//we need to re-order the points in the poly, to make the 2 points adiacent to the clicked one the first and the last points in the poly
								//suppose to have 4 point, numbered from 0 to 3: 0 is the first and 3 is the last. The user click on the point number 2: we want to make the point 3 the first and the point 1 the last and the point 2 is removed
								var s;
								for(i = curr_shape.length - 1; i > idx; i--){
									//we pop the last point
									s = curr_shape.pop();
									
									//we make it the first one
									curr_shape.unshift(s);
								}
								//we remove the clicked point and use their coordinates as mouse position in the moveMouse function
								curr_shape.pop();
								
								//we set the 'modify' attribute, used in the dblclick event (see it)
								M.shapes[current - 1]['modify'] = true;
								
								//we remove the poly from the shapes array, to push it at the last position:it is needed to continue to add points (see dblclick event handler: it is based on the assumption that the poly it is drawing is the last shape in the array)
								M.shapes.splice(current - 1, 1);
								
								//we set the M.fillColor: currently it is set on M.fillSelect
								curr_shape.fillColor = M.fillColor;
								
								//we push the modifyied poly in the M.shapes array
								M.shapes.push(curr_shape);
								
								//we send a click event on the poly, to select it on the dashboard
								M.poly.click();
								
								//we remove the last shape: it is an empty poly, introduced as a consequence of click
								removeLast();
								
								//we emulate a mousemove event, where the mouse position is the clicked point
								moveMouse(M.theCanvas[0], {'x':p.x, 'y':p.y});
							}
						});
						break;
					case 'rect':
						//we get the selected rect points (2 points)
						var a = curr_shape.point1.x, b = curr_shape.point2.x, c = curr_shape.point1.y, d = curr_shape.point2.y, x1, y1, x2, y2;
						
						//we determine what is the clicked point, to use it and its opposite as new point to re-draw the rect
						if(point.x == a) {x1 = b; y1 = (point.y == c) ? d : c; x2 = a; y2 = (point.y == c) ? c : d; }
						else {x1 = a; y1 = (point.y == d) ? c : d; x2 = b; y2 = (point.y == d) ? d : c;}
						
						//we set the event attribute needed to emulate an appropriate mousedown event: x1 and y1 are the coordinates of the point opposite to the clicked one 
						e.pageX = x1 + rect.left + root.scrollLeft;
						e.pageY = y1 + rect.top + root.scrollTop;
						
						//these are the coordinates of the clicked point
						e.pageX2 = x2;
						e.pageY2 = y2;
						
						//this is needed in the mousedown event handler, to know that we are re-sizing an existent rect (fdi:forward data indication)
						e.fdi = true;
						
						//we also need to save the current index, to use in the mousedown event handler
						e.current = current;
						
						//we emulate a click on the dashboard's rect, to re-drawing the existent rect
						M.rect.click();
						
						//we fire a mousedown event, to emulate a user click on the point opposite to the clicked one
						M.theCanvas.trigger(e);
						
						break;
					case 'circle':
						//we set the event attribute needed to emulate an appropriate mousedown event;
						var x1 = curr_shape.center.x, y1 = curr_shape.center.y;
						
						//we set the event attribute needed to emulate an appropriate mousedown event: x1 and y1 are the center coordinates
						e.pageX = x1 + rect.left + root.scrollLeft;
						e.pageY = y1 + rect.top + root.scrollTop;
						
						//these are the coordinates of the clicked point
						e.pageX2 = point.x;
						e.pageY2 = point.y;
						
						//this is needed in the mousedown event handler, to know that we are re-sizing an existent circle (fdi:forward data indication)
						e.fdi = true;
						
						//we also need to save the current index, to use in the mousedown event handler
						e.current = current;
						
						//we emulate a click on the dashboard's circle, to re-drawing the existent circle
						M.circle.click();
						
						//we fire a mousedown event, to emulate a user click on one of the 4 points of the selected circle
						M.theCanvas.trigger(e);
						
						break;
					default: break;
				}
			}
			
		});
		if(current) return;
		
		//iterate on the shapes to determine if the mouse position is in a shape and set the current index
		$.each(M.shapes, function(idx, shape){
			if(isPointInShape(shape, mousePos)) {
				current = idx + 1;//idx + 1: because the 0 value of the current is useful to indicate "no shape" selected
				M.area.removeClass('hidden');
				M.remove.removeClass('hidden');
				M.pencil.addClass('hidden');
				$('#shape').val(shape.type);
				$('#areaurl').val(shape.areaurl);
				$('#alttext').val(shape.alttext);
				$('#idname').val(shape.idname);
				$('#classname').val(shape.classname);
				$('#areatarget').val(shape.areatarget);
				$('#shape').val(shape.type);
			}
			else {
				M.shapes[idx]['fillColor'] 	= M.fillColor;
				M.shapes[idx]['status'] 	= 'idle';
			}
		});
		
		if(current && (current == M.current)){
			M.mouse_down = true;
			M.shapes[current - 1]['mousePos'] = mousePos;
			
			return;
		}
		
		//set the M.current to 0: no shape selected
		M.current = 0;
		
		//we also hide the area-setting area
		M.area.addClass('hidden');
		M.pencil.removeClass('hidden');
		M.remove.addClass('hidden');
		M.hideShowMap('show');
		
		//if the mouse position is in a shape select it and set the M.current to the index of the shape in the M.shapes array.
		if(current) {
			var status = M.shapes[current - 1]['status'];
			
			//if the shape is selected, we deselect it
			if(status == 'selected'){
				M.shapes[current - 1]['fillColor'] 	= M.fillColor;
				M.shapes[current - 1]['status'] = 'idle';
				M.current = 0;
				M.hideShowMap('show');
			}
			//else we select it
			else{
				M.shapes[current - 1]['fillColor'] 	= M.fillSelect;
				M.shapes[current - 1]['status'] = 'selected';
				M.current = current;
				M.area.removeClass('hidden');
				M.remove.removeClass('hidden');
				M.pencil.addClass('hidden');
				
				
				var curr_shape = M.shapes[current - 1];
				//we save the relevant points in the M.points array, to use them to modify the shape
				switch(curr_shape.type){
					case 'poly':
						$.each(curr_shape, function(idx, point){
							M.points[idx] = {'x':point.x, 'y':point.y};
						});
						break;
					case 'rect':
						M.points[0] = {'x':curr_shape['point1']['x'], 'y':curr_shape['point1']['y']};
						M.points[1] = {'x':curr_shape['point2']['x'], 'y':curr_shape['point1']['y']};
						M.points[2] = {'x':curr_shape['point1']['x'], 'y':curr_shape['point2']['y']};
						M.points[3] = {'x':curr_shape['point2']['x'], 'y':curr_shape['point2']['y']};
						break;
					case 'circle':
						M.points[0] = {'x':curr_shape['center']['x'] + curr_shape['radius'], 'y':curr_shape['center']['y']};
						M.points[1] = {'x':curr_shape['center']['x'] - curr_shape['radius'], 'y':curr_shape['center']['y']};
						M.points[2] = {'x':curr_shape['center']['x'], 'y':curr_shape['center']['y'] - curr_shape['radius']};
						M.points[3] = {'x':curr_shape['center']['x'], 'y':curr_shape['center']['y'] + curr_shape['radius']};
						break;
					default:break;
				}
				M.points.current = current;
				M.points.type = curr_shape.type;
				//M.hideShowMap('hide');
			}
		}
		
		//finally, we redraw the whole canvas
		clearCanvas();
		shapeRedraw();
	}
	
	
	/**
	* set the event handlers: the core of the mapper functionalities.
	*/	
	M.setEvents = function(){
	
		//put the mapper in drawing mode and insert in the M.shapes array a new empty shape, that can be a circle, a polygon or a rectangle, based on the "id" of the start element 
		if(M.start){
			M.start.on('click', function(){
				M.status = 'drawing';
				
				//remove the last shapes, if empty
				removeLast();
				
				var shape = new Array();
				shape.type = $(this).attr('id');
				shape.status = 'drawing';
				M.shapes.push(shape);
				
				$.each(M.shapes, function(idx, shape){
					shape['fillColor'] 	= M.fillColor;
					shape['status'] 	= 'idle';
				});
				M.current = 0;
				M.area.addClass('hidden');
				M.pencil.removeClass('hidden');
				M.remove.addClass('hidden');
				clearCanvas();
				shapeRedraw();
				var tappo = 0;
			});
		}
		
		//leaves the mapper from the drawing mode
		if(M.stop){
			M.stop.on('click', function(){
				M.status = 'edit';
				var len = removeLast();
				M.current = 0;
				M.area.addClass('hidden');
				M.pencil.removeClass('hidden');
				M.remove.addClass('hidden');
				clearCanvas();
				shapeRedraw('idle');
				M.mouse_clicked = false;
			});
		}
		
		//put the canvas in the edit mode, to allow to modify it
		if(M.edit){
			M.edit.on('click', function(){
				M.stop.trigger('click');
				M.status = 'edit';
			});
		}
		
		if(M.remove){
			M.remove.on('click', function(){
				var current = M.current - 1;
				M.shapes.splice(current, 1);
				M.current = 0;
				M.area.addClass('hidden');
				M.pencil.removeClass('hidden');
				M.remove.addClass('hidden');
				M.hideShowMap('show');
				clearCanvas();
				shapeRedraw();
			});
		}
		//generate the image map, based on the shapes drawn
		if(M.map){
			M.map.on('click', function(){
				var ratiow = M.targetw/M.theCanvas[0].width;
				var ratioh = M.targeth/M.theCanvas[0].height;
				var medium = (ratiow + ratioh)/2;
				if(!drawing())
					//remove the last shapes, if empty
					removeLast();
				
				var w = $('#body').width();//, pl = parseInt($('#body').css('padding-left')), pr = parseInt($('#body').css('padding-right'));
				
				//var textarea = M.result.removeClass('hidden').find('textarea').css({width:w - 85 - 140 + 'px', height:'100px'}).removeClass('hidden');
				var textarea = M.result.removeClass('hidden').find('textarea').removeClass('hidden');
				var mapname = M['mapname'] ?  M['mapname'] : '';
				var text = "<map name='" + mapname + "'>\n";

				$.each(M.shapes, function(idx, shape){
					if(shape.length){
						var coords = "";
						var href = shape['areaurl'];if(!href) href = "#";
						var attrs = "'" + href + "'";
						if(shape['idname']) attrs += " name = '" + shape['idname'] + "'";
						if(shape['classname']) attrs += " class = '" + shape['classname'] + "'";
						if(shape['alttext']) attrs += " alt = '" + shape['alttext'] + "' title = '" + shape['alttext'] + "'";
						if(shape['areatarget'] && (shape['areatarget'] != "none")) attrs += " target = '" + shape['areatarget'] + "'";
						
						switch(shape.type){
							case 'poly':
								$.each(shape, function(idx, point){
									if(idx == 0) coords = "'" + Math.floor(ratiow * point['x']) + ", " + Math.floor(ratioh * point['y']);
									else coords = coords + ", " + Math.floor(ratiow * point['x']) + ", " + Math.floor(ratioh * point['y']);
									
								});
								text = text + "<area shape='poly' coords=" + coords + "' href=" + attrs + " />\n";
								break;
							case 'rect':
								coords = "'" + Math.floor(ratiow * shape.point1['x']) + ", " + Math.floor(ratioh * shape.point1['y']) + ", " + Math.floor(ratiow * shape.point2['x']) + ", " + Math.floor(ratioh * shape.point2['y']);
								text = text + "<area shape='rect' coords=" + coords + "' href="  + attrs + " />\n";
								break;
							case 'circle':
								coords = "'" + Math.floor(ratiow * shape.center['x']) + ", " + Math.floor(ratioh * shape.center['y']) + ", " + Math.floor(medium * shape.radius);
								text = text + "<area shape='circle' coords=" + coords + "' href="  + attrs + " />\n";
								break;
								
							default: break;
						};
					}
				}); 
				if(M['defaulturl']) {
					text += "<area shape='default' href='" + M['defaulturl'] + "'";
					if(M['defaulttarget'] && (M['defaulttarget'] != 'none')) text += " target='" + M['defaulttarget'] + "'";
					text += " />\n";
				}
				text += "</map>";
				textarea.val(text);
			});
		}
		
		if(M.load){
			M.load.on('click', function(){
				var textarea = M.result.find('textarea').val();
				var rows = textarea.split("\n");
				M.shapes = [];
				var ratiow = M.theCanvas[0].width/M.targetw;
				var ratioh = M.theCanvas[0].height/M.targeth;
				var medium = (ratiow + ratioh)/2;
				$.each(rows, function(idx, row){
                    if (/\<map name/ig.test(row)) {
                        if (/name\s*=\s*/ig.test(row)) {
                            var x = /name\s*=\s*\'([^\']+)/ig.exec(row);
                            x = x[1];
                            $('#mapname').val(x);
                            M.setParam("mapname", x);
                        }

                    }
                    if(/area/ig.test(row)){
						var pattern=/shape\s*=\s*\'([^\']+)\'\s*coords\s*=\s*\'([^\']+)\'\s*href\s*=\s*\'([^\']+)/ig;
						result=pattern.exec(row);
						var shape = result[1];
						var coords = result[2];
						var href = result[3];
                        if (/name\s*=\s*/ig.test(row)) {
                            var id = /name\s*=\s*\'([^\']+)/ig.exec(row);
                            id = id[1];
                        }
                        if(/class\s*=\s*/ig.test(row)){
							var classname = /class\s*=\s*\'([^\']+)/ig.exec(row);
							classname = classname[1];
						}
						if(/alt\s*=\s*/ig.test(row)){
							var alt = /alt\s*=\s*\'([^\']+)/ig.exec(row);
							alt = alt[1];
						}
						if(/target\s*=\s*/ig.test(row)){
							var target = /target\s*=\s*\'([^\']+)/ig.exec(row);
							target = target[1];
						}
						var points = coords.split(", ");
						switch(shape){
							case 'poly':
								var poly = [];
								poly.type = 'poly';
								for(i=0;i<points.length;i+=2){
									poly.push({'x':ratiow * points[i], 'y':ratioh * points[i + 1]});
								};
								poly.areaurl = href;
								if(id) poly.idname = id;
								if(classname) poly.classname = classname;
								if(alt) poly.alttext = alt;
								if(target) poly.areatarget = target;
								poly.fillColor = M.fillColor;
								M.shapes.push(poly);
								break;
							case 'rect':
								var rect = new Array();
								rect.type = 'rect';
								rect.point1 = {'x':ratiow * points[0], 'y':ratioh * points[1]};
								rect.point2 = {'x':ratiow * points[2], 'y':ratioh * points[3]};
							
								rect.x_min = Math.min(rect.point1.x, rect.point2.x);
								rect.x_max = (rect.point1.x == rect.x_min) ? rect.point2.x : rect.point1.x;
								rect.y_min = Math.min(rect.point1.y, rect.point2.y);
								rect.y_max = (rect.point1.y == rect.y_min) ? rect.point2.y : rect.point1.y;
								
								rect.areaurl = href;
								if(id) rect.idname = id;
								if(classname) rect.classname = classname;
								if(alt) rect.alttext = alt;
								if(target) rect.areatarget = target;
								
								rect.length = 3;
								rect.fillColor = M.fillColor;
								
								M.shapes.push(rect);
								break;
							case 'circle':
								var circle = [];
								circle.type = 'circle';
								circle.center = {'x':ratiow * points[0], 'y':ratioh * points[1]};
								
								circle.radius = medium * points[2];
								circle.areaurl = href;
								if(id) circle.idname = id;
								if(classname) circle.classname = classname;
								if(alt) circle.alttext = alt;
								if(target) circle.areatarget = target;
								
								circle.length = 3;
								circle.fillColor = M.fillColor;
								
								M.shapes.push(circle);
								break;
							default: break;
						}
					}
				});
				clearCanvas();
				shapeRedraw();
			});
		}
		if(M.theCanvas){
			//we get the mouse events on the border, to trigger the mouseenter event to the canvas with edge coordinates
			M.theCanvas.parent().on('click dblclick mousedown mousemove', function(evt){
				var mousePos = getMousePos(this, evt);
				var x = mousePos.x, y = mousePos.y, b = M.border, w = M.theCanvas[0].width, h = M.theCanvas[0].height;
				
				//we determine if the mouse event occurred on the border
				while(true){
					//if the event occurred on the canvas we just return
					if(isPointInRect({x_min:b, x_max:w+b, y_min:b, y_max:h+b}, mousePos)) return false;
					
					if( (x < b) && (y < b) )				{x = 0; y = 0; break;}	//top-left border corner
					if( (x > (w + b)) && (y < b) )			{x = w; y = 0; break;}	//top-right border corner
					if( (x > (w + b)) && (y > (h + b)) )	{x = w; y = h; break;}	//bottom-right border corner
					if( (x < b) && (y > (h + b))) 			{x = 0; y = h; break;}	//bottom-left border corner
					if(x < b) 								{x = 0; y -= b; break;}	//left border
					if(y < b) 								{x -= b; y = 0; break;}	//top border
					if(x > (w + b)) 						{x = w; y -= b; break;}	//right border
					if(y > (h + b)) 						{x -= b; y = h; break;}	//bottom border
					
				}
				if(evt.type == 'mousedown'){
					var tappo = 0;
				}
				//if we are here, it means that the mouse event occurred on the border: we trigger the event to the canvas, on the edge limit
				var rect = M.theCanvas[0].getBoundingClientRect(), root = document.documentElement;
				if(evt.type == 'mousemove') evt.type = 'mouseenter';
				var e = new jQuery.Event(evt.type);
				e.pageX = x + rect.left + root.scrollLeft;
				e.pageY = y + rect.top + root.scrollTop;
				M.theCanvas.trigger(e);
				
				return false;
			});
			
			M.theCanvas.parent().on('mouseleave', function(evt){
				var mousePos = getMousePos(this, evt);
				var x = mousePos.x, y = mousePos.y, b = M.border, w = M.theCanvas[0].width, h = M.theCanvas[0].height;
				if( (x <= 0) || (y <= 0) || (x >= (w + 2*b)) || (y >= (h + 2*b)) ){
					M.theCanvas.trigger('canvas_leave');
				}
			});
			
			//handle the mousemove event:shows the mouse coordinates and call the moveMouse function
			//The mouseenter event is useful to manage the mousemove event on the border: see the above mousemove event
			M.theCanvas.on('mousemove mouseenter', function(evt) {
				M.xyInfo.removeClass('hidden');
				var mousePos = getMousePos(this, evt);
				M.xyInfo.html("Mouse position: " + mousePos.x + "," + mousePos.y);
				moveMouse(this, mousePos);
				M.theCanvas.removeClass('cursor_move').removeClass('cursor_pointer');
				if( M.current ){
					var shape = M.shapes[M.current - 1];
					if(isPointInShape(shape, mousePos))
						M.theCanvas.addClass('cursor_move');
					$.each(M.points, function(idx, point){
						if(isPointInCircle({'center':point, 'radius':4}, mousePos))
							M.theCanvas.removeClass('cursor_move').addClass('cursor_pointer');
					});
				}
			});
			
			//handle the mouse out event:hides the mouse coordinates and re-draws the canvas taking into account that the mouse is out
			M.theCanvas.on('canvas_leave', function(evt) {
				//hides the mouse coordinates info
				M.xyInfo.addClass('hidden');
				
				//clear the canvas			
				var ctx = M.ctx;
				ctx.clearRect(0, 0, this.width, this.height);
				
				//finally, we re-draw all the shapes, taking into account that the mouse is out (mousePos = 0)
				shapeRedraw();
				
			});
			
			//its behaviour depends on the mapper status
			M.theCanvas.on('mousedown', function(evt) {
				
				M.mouse_clicked = true;
				
				if(drawing()) return handleDrawing(this, evt);
				
				if(edit()) return handleEdit(this, evt);
			});
			
			//this event is useful only when we are drawing a poly, to set the last point
			M.theCanvas.on('dblclick', function(evt) {
				if(!drawing()) return false;
				
				//we get the last shape from the shapes array
				var shape = M.shapes.pop();
				if(shape.type != 'poly') return false;
				
				if(shape.length < 4){
					var poly = new Array();
					poly.type = 'poly';
					poly.status = 'drawing';
					M.shapes.push(poly);
					
					//release the mouse, to avoid to redraw the canvas continuously
					M.mouse_clicked = false;
					
					return false;
				}
				
				//we remove the last 2 points, because I have noticed 2 more points
				shape.pop();shape.pop();
				
				var mousePos = getMousePos(this, evt);
				
				shape.push({'x':mousePos.x, 'y':mousePos.y});
						
				//we draw the new point
				setPoint(M.ctx, mousePos, M.radius, M.curColor, M.lineWidth, M.curColor);
						
				//we set the 'edit' status for this poly, because this is the last point for it
				shape.status = 'edit';
				
				//release the mouse, to avoid to redraw the canvas continuously
				M.mouse_clicked = false;
				
				//finally, we re-insert the shape in the M.shapes array
				M.shapes.push(shape);
				
				if(!shape['modify']){
					//we insert a new empty poly element in the M.shapes array
					var poly = new Array();
					poly.type = 'poly';
					poly.status = 'drawing';
					M.shapes.push(poly);
				}
				else M.stop.click();
					
				return false;
			});
			M.theCanvas.on('mouseup', function(evt) {
				M.mouse_down = false;
			});
		}
	};
return M;
})(jQuery);
