/**
 * Created by projecttest on 12/12/16.
 */
//Buttons code(Deploy and Save File) are here
function button() {


    var width = 300,
        height = 100,
        radius = 10,
        padding = 10,
        count = 0,
        container = null,
        text = null;

    var defs = null,
        gradient = null,
        shadow = null,
        cb = null,
        rect = null;

    function my() {

        // set defaults
        g = container || d3.select('svg').append('g')
                .attr('class', 'button')
                .attr('transform', 'translate(' + [width / 2, height / 2] + ")");
        text = text || g.append('text').text('Hello, world!');

        defs = g.append('defs');

        var bbox = text.node().getBBox();
        rect = g.append('rect')
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .style("cursor", "pointer")
            .attr("width", bbox.width + 2 * padding)
            .attr("height", bbox.height + 2 * padding)
            .attr('rx', radius)
            .attr('ry', radius);

        addGradient(count);
        addShadow(count);

        rect.attr('fill', function () { return gradient ? 'url(#gradient' + count + ')' : 'steelblue'; })
            .attr('filter', function() { return shadow ? 'url(#dropShadow' + count + ')' : null; })
            .on('mouseover', brighten)
            .on('mouseout', darken)
            .on('mousedown', press)
            .on('mouseup', letGo);

        // put text on top
        g.append(function() { return text.remove().node(); });

        // TESTING -- SVG "use" element for testing dimensions of drop-shadow filter
//    g.append('use').attr('xlink:href', '#shadowrect' + count)

        return my;
    }

    function addGradient(k) {
        gradient = defs.append('linearGradient')
            .attr('id', 'gradient' + k)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('id', 'gradient-start')
            .attr('offset', '0%');

        gradient.append('stop')
            .attr('id', 'gradient-stop')
            .attr('offset', '100%');
    }

    function addShadow(k) {
        shadow = defs.append('filter')
            .attr('id', 'dropShadow' + k)
            .attr('x', rect.attr('x'))
            .attr('y', rect.attr('y'))
            .attr('width', rect.attr('width'))
            .attr('height', rect.attr('height'));

        // TESTING size of drop-shadow filter
        defs.append('rect')
            .attr('id', 'shadowrect' + k)
            .attr('x', rect.attr('x'))
            .attr('y', rect.attr('y'))
            .attr('width', rect.attr('width'))
            .attr('height', rect.attr('height'));

        shadow.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', '3');

        shadow.append('feOffset')
            .attr('dx', '2')
            .attr('dy', '4');

        var merge = shadow.append('feMerge')

        merge.append('feMergeNode')
        merge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    function brighten() {
        flag = true;
        gradient.select('#gradient-start').classed('active', true)
        gradient.select('#gradient-stop').classed('active', true)
    }

    function darken() {
        flag = false;
        gradient.select('#gradient-start').classed('active', false);
        gradient.select('#gradient-stop').classed('active', false);
    }

    function press() {
        if (typeof cb === 'function') cb();
        if (shadow) shadow.select('feOffset')
            .attr('dx', '0.5')
            .attr('dy', '1')
    }

    function letGo() {
        if (shadow) shadow.select('feOffset')
            .attr('dx', '2')
            .attr('dy', '4')
    }

    my.container = function(_) {
        if (!arguments.length) return container;
        container = _;
        return my;
    };

    my.text = function(_) {
        if (!arguments.length) return text;
        text = _;
        return my;
    };

    my.count = function(_) {
        if (!arguments.length) return count;
        count = _;
        return my;
    };

    my.cb = function(_) {
        if (!arguments.length) return cb;
        cb = _;
        return my;
    };

    return my;
}

var buttonWidth = 500 ,buttonHeight = 500;

var svg = outer.append('svg')
    .attr('width', buttonWidth)
    .attr('height', buttonHeight);

var g = svg.append('g')
    .attr('class', 'button')
    .attr('transform', 'translate(' + [buttonWidth / 4, buttonHeight / 8] +')');

var g2 = svg.append('g')
    .attr('class', 'button')
    .attr('transform', 'translate(' + [buttonWidth / 4, buttonHeight / 4] +')');

var g3 = svg.append('g')
    .attr('class', 'button')
    .attr('transform', 'translate(' + [buttonWidth / 4,  190] + ')');

var g4 = svg.append('g')
    .attr('class', 'button')
    .attr('transform', 'translate(' + [buttonWidth / 4,  255] + ')');




var text = g.append('text')
    .text('Deploy');

var text2 = g2.append('text')
    .text('Save File');

var text3 = g3.append('text')
    .text('Load File');

var text4 = g4.append('text')
    .text('ClearDesigner');


button()
    .container(g)
    .text(text)
    .count(0)
    .cb(function()
    {
        var JSONlinks = JSON.stringify(links);
        var obj = JSON.parse(JSONlinks);
        //console.log("Deploy");
        //console.log("JSONLinks", JSONlinks);
        console.clear();
        for(var i = 0; i < obj.length; i++)
        {
            console.log("Source: Service",obj[i].source.id);
            console.log("Target: Service",obj[i].target.id);
            console.log("-----------------");
        }

    })();

// Button "count" keeps things unique
button()
    .container(g2)
    .text(text2)
    .count(1)
    .cb(function()
    {
        try {
            sendNodes();
            console.log("SaveFile");
        } catch (err)
        {
            console.log(err.message);
        }
    })();

button()
    .container(g3)
    .text(text3)
    .count(2)
    .cb(function() {
        //$(document).ready(function() {
            console.log("Load File");
            console.log("nodes", nodes);
            console.log("Reading JSON File");
            loadFlag = true;
            clearFlag = false;
            update();
        //});
    })();

button()
    .container(g4)
    .text(text4)
    .count(3)
    .cb(function() {
        //$(document).ready(function() {
            console.log("Clear Designer");
            console.log("nodes", nodes);
            clearFlag = true;
            update();
        //});
    })();


