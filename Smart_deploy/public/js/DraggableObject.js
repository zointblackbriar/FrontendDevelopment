/**
 * Created by projecttest on 12/12/16.
 */

//Draggable objects
//var widthOfMap = document.getElementById("map").width.animVal.value;
//var heightOfMap = document.getElementById("map").height.animVal.value;

var rectWidth = 100;
var rectHeight = 50;
var spaceHeight = 700;
var spaceWidth = 1340;

//definiton of JSON location
var jsonObjectLocation = {
    "locations": {
        "source" : ["source"],
        "target" : ["target"]
    }
};

var image1PosX = 0;
var image1PosY = 0;
var holder = 0;
var keep = false,
    mouseStart = null, path = null;
var whichObject = null;


//initalization of JSON location
var dataObj = {};
var locationsObj = "locations";
dataObj[locationsObj] = {};
dataObj[locationsObj].source = [];
dataObj[locationsObj].target = [];
var flagPath = false;

var nodeCircles = [
    {id: 0, "class": "portServ1", "x_axis":180, "y_axis": 185, "radius": 10, "color": "gray"},
    {id: 1, "class": "portServ2", "x_axis": 180, "y_axis":275, "radius":10, "color": "gray"},
    {id: 2, "class": "portImage1", "x_axis": 80, "y_axis":365, "radius": 10, "color": "gray"},
    {id: 3, "class": "portImage2", "x_axis": 80, "y_axis":455, "radius": 10, "color": "gray"}
];

var nodeRectangles = [
    {id:4, "class":"service1", "x_axis":80, "y_axis": 160,"color": "#DAF7A6", reflexive:false },
    {id:5, "class":"service2", "x_axis": 80, "y_axis":250, "color": "#73C6B6"},
    {id:6, "class":"image1","x_axis": 80, "y_axis":340,  "color": "#ffff66"},
    {id:7, "class":"image2", "x_axis": 80, "y_axis":430,  "color": "#BB8FCE"}
];

var nodeText = [
    {"x_axis":80 , "y_axis":150, "text": "Service1", "strokeColor" : "orange", "strokeWidth":1, "fontSize":"150%", "fillText":"black"},
    {"x_axis":80 , "y_axis":240, "text": "Service2", "strokeColor" : "orange", "strokeWidth":1, "fontSize":"150%", "fillText":"black"},
    {"x_axis":80 , "y_axis":330, "text": "Image1", "strokeColor" : "orange", "strokeWidth":1, "fontSize":"150%", "fillText":"black"},
    {"x_axis":80 , "y_axis":420, "text": "Image2", "strokeColor" : "orange", "strokeWidth":1, "fontSize":"150%", "fillText":"black"}
];


var links = [
    {source: nodeCircles[0], source:nodeCircles[1], target: nodeCircles[1], target: nodeCircles[2] }
];


var force = d3.layout.force()
    .nodes(nodeCircles)
    .links(links)
    .size([spaceWidth, spaceHeight])
    .linkDistance(150)
    .charge(-500)
    .on('tick', tick);

//id map assigned to d3.select to scale GUI layout
//changed to outer because we don't want to confuse
var outer = d3.select("#chart")
    .attr("cx", 0)
    .attr("cy", 200)
    .attr("width",spaceWidth)
    .attr("height", spaceHeight)
    .attr("pointer-events", "all")
    .style("cursor", "crosshair")
    //.style("border", "1px solid black")
    .call(focusView)
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);
    //.on("mouseover", function() {
    //    console.log("svg mouseover");
    //})
    //.on("mouseout", function() {
    //    console.log("svg mouseout");
    //});


//Workaround fro browser unexpectedly scrolling iframe into full
//view - record the parent scroll position and restore it after setting the focus
function focusView()
{
    try
    {
        var scrollX = window.parent.window.scrollX;
        var scrollY = window.parent.window.scrollY;
        $("#chart").focus();
        window.parent.window.scrollTo(scrollX, scrollY);
    } catch(err)
    {
        //the view following the inevitable DOMException
        $("#chart").focus();
    }
}

var dragGroup = d3.behavior.drag()
    .on("dragstart", function() {
        d3.event.sourceEvent.stopPropagation();
        d3.event.sourceEvent.preventDefault();
        console.log("Start Dragging Group");
    })
    .on("drag", dragmove);

var dragCircle = d3.behavior.drag()
    .on('dragstart', function() {
        console.log("dragstart in dragCircle");
        d3.event.sourceEvent.stopPropagation();
        //d3.event.sourceEvent.preventDefault();

    })
    .on('drag', dragmove);

var container = outer.append("g")

// define arrow markers for graph links
container.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

container.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
var drag_line = container.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}



// handles to link and node element groups
var path = container.append('svg:g').selectAll('path');




// //Get the background image of Smart Car
var mapImage = container.append("image")
    .attr("x", 0)
    .attr("y", 0)
    .attr("xlink:href",  "../images/vehicle_logo.jpg")
    .attr("width", 100)
    .attr("height", 100);

var texts = container.selectAll("text")
            .data(nodeText)
            .enter()
            .append("text");

var textAttributes = texts
    .attr("transform", function(d) {return "translate(" + d.x_axis + "," + d.y_axis +")";})
    .text( function(d) {return d.text;})
    .style(function(d) {return d.strokeColor;})
    .style(function(d) {return d.strokeWidth;})
    .style(function(d) {return d.fontSize;})
    .style(function(d) {return d.fillText;});


var rectangles = container.selectAll("rect")
    .data(nodeRectangles)
    .enter()
    .append("rect");

console.log("rectangles");

var rectangleAttributes = rectangles
    .attr("transform", function(d) {return "translate(" + d.x_axis + "," + d.y_axis +")";})
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("class", function(d) {return d.class})
    .attr("id", function(d) {return d.id})
    .attr("stroke", "#F08080")
    .attr("stroke-width",  5)
    .style("cursor", "move")
    .attr("fill", function(d) {return d.color;})
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .call(dragGroup)
    .on("mouseover", function(d)
    {
        d3.select(this).style("stroke", "#E6D614");
    })
    .on("mouseout", function(d)
    {
        d3.select(this).style("stroke", "#F08080");
    });
    //.on("click", function() {
    //    console.log("clicked rectangleSecond");
    //    dataObj[locationsObj].source.push(function(d)
    //    {
    //        return d.class;
    //    });
    //    flagPath = true;
    //});


console.log("rectangleAttributes");

var circles = container.selectAll("circle")
    .data(nodeCircles)
    .enter()
    .append("circle");

var circleAttributes = circles
    .attr("transform", function(d) {return "translate(" + d.x_axis + "," + d.y_axis +")";})
    //.attr("cx", function(d) {return d.x_axis;})
    //.attr("cy", function(d) {return d.y_axis;})
    .attr("class", function(d) {return d.class})
    .attr("id", function(d) {return d.id})
    .attr("r", function(d) {return d.radius;})
    .attr("fill", function(d) {return d.color;})
    .on("mouseover", function(d)
    {
        d3.select(this).style("fill", "orange");
    })
    .on("mouseout", function(d)
    {
        d3.select(this).style("fill", "gray");
    });


// update force layout (called automatically each iteration)
function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', function(d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    texts.attr('transform', function(d) {
        return 'translate(' + d.x_axis + ',' + d.y_axis + ')';
    });


    rectangles.attr('transform', function(d) {
        return 'translate(' + d.x_axis + ',' + d.y_axis + ')';
    });


    circles.attr('transform', function(d) {
        return 'translate(' + d.x_axis + ',' + d.y_axis + ')';
    });

}


function restart()
{
    path = path.data(links);

    // update existing links
    path.classed('selected', function(d) { return d === selected_link; })
        .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
        .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });

    // add new links
    path.enter().append('svg:path')
        .attr('class', 'link')
        .classed('selected', function(d) { return d === selected_link; })
        .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
        .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
        .on('mousedown', function(d) {
            if(d3.event.ctrlKey) return;

            // select link
            mousedown_link = d;
            if(mousedown_link === selected_link) selected_link = null;
            else selected_link = mousedown_link;
            selected_node = null;
            restart();
        });
    // remove old links
    path.exit().remove();

    circle = circles.data(nodeCircles, function(d) { return d.id; });

    // update existing nodes (reflexive & selected visual states)
    circle.selectAll('circle')
        .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
        .classed('reflexive', function(d) { return d.reflexive; });

    force.start();
}

//Drag handler
function dragmove()
{
    //boundary of svg area
    var coordinates = [0, 0];
    var x = Math.max(0, Math.min(spaceWidth - 100, d3.event.x));
    var y = Math.max(0, Math.min(spaceHeight - 50, d3.event.y));
    coordinates = d3.mouse(this);
    //console.log("x", x);
    //console.log("y", y);
    //console.log("mouseX", coordinates[0]);
    //console.log("mouseY", coordinates[1]);
    if(d3.select(this).attr("class") == "image1" || d3.select(this).attr("class") == "image2")
    {
        d3.select(this.previousSibling.previousSibling.previousSibling.previousSibling).attr("transform", "translate(" + x  + "," + (y-5) + ")"); //texts
        d3.select(this).attr("transform", "translate(" + x + "," + y + ")"); //main objects
        d3.select(this.nextSibling.nextSibling.nextSibling.nextSibling).attr("transform", "translate(" + (x) + "," + (y+25)+ ")"); //circles
    }else
    {
        d3.select(this.previousSibling.previousSibling.previousSibling.previousSibling).attr("transform", "translate(" + x  + "," + (y-5) + ")"); //texts
        d3.select(this.nextSibling.nextSibling.nextSibling.nextSibling).attr("transform", "translate(" + (x+100) + "," + (y+25)+ ")"); //circles
        d3.select(this).attr("transform", "translate(" + x + "," + y  + ")"); //main objects
    }
    // set the graph in motion

    //console.log("id", d3.select(this.nextSibling.nextSibling.nextSibling.nextSibling));
    //console.log("result", d3.select("rect#5"));
//    console.log("imagePosX:", image1PosX);
//console.log("image1PosY:", image1PosY);

    //console.log(d3.select(this.nextSibling).classed("portServ1"));
    //    d3.select(this.nextSibling).classed("portServ2") ||
    //    d3.select(this.nextSibling).classed("portImage1") ||
    //    d3.select(this.nextSibling).classed("portImage2"))
    //{
    //    //console.log("draw a line");
    //    line = d3.svg.line()
    //        .x(function(d) {return d[0];})
    //        .y(function(d) {return d[1];});
    //}
}


function send()
{
    jQuery(document).ready(function($)
    {
        $.ajax({
            type:'POST',
            url: 'http://192.168.80.142:3000/',
            data: JSON.stringify(dataObj),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            processData: false,
            error: function(data)
            {
                console.log("error", data);
            },
            success: function(data)
            {
                console.log("success", data);
            }
        });
    });
}


var t = d3.transform(d3.select('circle').attr("transform")),
    x = t.translate[0],
    y = t.translate[1];

console.log("transform function x:", x);
console.log("transform function y:", y);

function mousemove()
{
    if(!mousedown_node) return;

    //update drag line
    drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L'
        + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

    restart();
}

function mouseup() {
    if (mousedown_node) {
        // hide drag line
        drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
}

function mousedown() {
    // prevent I-bar on drag
    //d3.event.preventDefault();

    // because :active only works in WebKit?
    svg.classed('active', true);

    if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

    restart();
}


//function mousedown()
//{
//    path = outer.append("path")
//        .style("stroke", "gray")
//        .style("stroke-width", "2px")
//        .style("fill", "none");
//    keep = true;
//    mouseStart = d3.mouse(this);
//}
//
//function mouseup()
//{
//    keep= false;
//}
//
//function mousemove()
//{
//    if(keep)
//    {
//        var mouseEnd = d3.mouse(this);
//        var dx = mouseStart[0] - mouseEnd[0],
//            dy = mouseStart[1] - mouseEnd[1],
//            dr = Math.sqrt(dx * dx + dy*dy);
//        //console.log("mousEnd");
//        path.attr("d", "M" +
//            mouseStart[0] + "," +
//            mouseStart[1] + "C" +
//            dr + "," + dr + "116 182, 98 " +
//            mouseEnd[0] + "," +
//            mouseEnd[1]);
//        //216 282, 198
//        //console.log("flagPath:", flagPath);
//        //if(flagPath == false)
//        //{
//        //    path.remove();
//        //}
//    }
//}


