
// Load map data
d3.json('./columbia.json', function (error, mapData) {
    displayBaseMap(mapData);
});

var displayBaseMap = function (mapData) {
    var features = mapData.features;
    console.log("loaded map data");

    console.log("drawing provinces");

    var width = 960 * 2;
    var height = 500 * 2;

    var projection = d3.geo.mercator()
        .scale(3000)
        // Center the Map in Colombia
        .center([-74, 4.5])
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    // Set svg width & height
    var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    var mapLayer = svg.append('g')
        .classed('map-layer', true);

    // title
    mapLayer.append("text")
        .attr("x", (width / 2))             
        .attr("y", 60)
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .text("Move the slider to switch between days");


    mapLayer.selectAll('path')
        .data(features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke');

    console.log("done rendering base map!");

    // can draw lines
    // d3.csv('dataViz/movement.csv', function (error, moveData) {
    //     console.log('read movement data...');
    //     renderLines(mapLayer, moveData, projection);
    // });

    // monitors slider
    document.getElementById('myRange').oninput = function() {

        const day = document.getElementById('myRange').value;
        mapLayer.selectAll('circle').remove();
        var dayString = day.toString();
        if (dayString.length == 1) {
            dayString = '0' + dayString;
        }
        
        const link = 'dataViz/[Day ' + dayString + ']-tweets.csv';
        console.log('fetching:', link);
        d3.csv(link, function(error, day1Data) {
            visualizeDay(mapLayer, day1Data, projection);
        });

        // title
        mapLayer.selectAll('text').remove();
        const displayTitle = 'Current Date: April ' + day + ', 2015'
        mapLayer.append("text")
            .attr("x", (width / 2))             
            .attr("y", 60)
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .text(displayTitle);
    }
}

var visualizeDay = function (mapLayer, dayData, projection) {

    var regionCount = {};
    var regionCoords = {};

    for (row in dayData) {
        var regionNum = dayData[row]['Old Region'];
        if (regionNum in regionCount) {
            regionCount[regionNum] += 1;
        } else {
            regionCount[regionNum] = 1;
        }

        regionCoords[regionNum] = [parseFloat(dayData[row]['Old_Region_Long']), parseFloat(dayData[row]['Old_Region_Lat'])];
    }

    var dataPoints = [];
    var maxNumber = 0;
    var minNumber = 0;
    var first = true;
    for (var key in regionCount) {
        if (first) {
            first = false;
            maxNumber = regionCount[key];
            minNumber = maxNumber;
        } else {
            if (regionCount[key] > maxNumber) {
                maxNumber = regionCount[key];
            } else if (regionCount[key] < maxNumber) {
                minNumber = regionCount[key];
            }
        }
        dataPoints.push([key, regionCount[key], regionCoords[key][0], regionCoords[key][1]]);
    }

    var globalMin = 1;
    var thresholdMin = 100;
    var globalMax = 3102;

    var radiusScale = d3.scale.linear()
        .domain([thresholdMin, globalMax])
        .range([2, 25]);

    var luminanceScale = d3.scale.linear()
        .domain([thresholdMin, globalMax])
        .range([0.5, 1]);

    console.log('about to map points...')
    // add lines to svg
    mapLayer.selectAll('circle')
        .data(dataPoints).enter()
        .append('circle')
        .attr('cx', function (d) {
            var toProject = [d[2], d[3]];
            return projection(toProject)[0];
        })
        .attr('cy', function (d) {
            var toProject = [d[2], d[3]];
            return projection(toProject)[1];
        })
        .attr('r', function (d) {
            return radiusScale(d[1]);
        })
        .attr('fill', function (d) {
            return d3.hsl(0, 1, 0.5);
        });

}

var renderLines = function (mapLayer, moveData, projection) {

    var dataPoints = []
    var maxNumber = 0;
    var minNumber = 0;
    var first = true;

    for (row in moveData) {
        var oldLong = parseFloat(moveData[row]['Old Longitude']);
        var oldLat = parseFloat(moveData[row]['Old Latitude']);

        var newLong = parseFloat(moveData[row]['New Longitude']);
        var newLat = parseFloat(moveData[row]['New Latitude']);

        if (oldLong == newLong && oldLat == newLat) {
            newLong += 0.05;
            newLat += 0.05;
        }

        var number = parseInt(moveData[row]['Number']);
        dataPoints.push([oldLong, oldLat, newLong, newLat, number]);

        if (first) {
            first = false;
            maxNumber = number;
            minNumber = maxNumber;
        }
        if (number > maxNumber) {
            maxNumber = number;
        } else if (number < minNumber) {
            minNumber = number;
        }
    }

    var colorScale = d3.scale.linear()
        .domain([minNumber, maxNumber])
        .range([220, 360]);

    // aa = [-70.46295796, 1.012898806];
    console.log('about to map lines...')
    // add lines to svg
    mapLayer.selectAll('line')
        .data(dataPoints).enter()
        .append('line')
        .attr('x1', function (d) {
            var toProject = [d[0], d[1]];
            return projection(toProject)[0];
        })
        .attr('y1', function (d) {
            var toProject = [d[0], d[1]];
            return projection(toProject)[1];
        })
        .attr('x2', function (d) {
            var toProject = [d[2], d[3]];
            return projection(toProject)[0];
        })
        .attr('y2', function (d) {
            var toProject = [d[2], d[3]];
            return projection(toProject)[1];
        })
        .attr('stroke-width', 2)
        .attr('stroke', function (d) {
            return d3.hsl(colorScale(d[4]), 1, 0.5);
        });
}
