//------------------------------------------------------------------------------
// Time selector code

function dateSelector(){
    var radius = Math.min(width, height) / 3.5,
        thickness = radius * 0.4;

    var color_scale = d3.scale.linear()
        .domain([0, 6])
        .range(['lightsteelblue', 'green']);

    var startArc = d3.svg.arc()
        .outerRadius(radius + thickness)
        .innerRadius(radius + thickness - 0.001)

    var arc = d3.svg.arc()
        .outerRadius(radius + thickness)
        .innerRadius(radius )

    var time = d3.svg.arc()
        .outerRadius(radius + thickness)
        .innerRadius(radius )

    var pie = d3.layout.pie()
        .startAngle(-90 * Math.PI/180)
        .endAngle(-90 * Math.PI/180 + 2*Math.PI)
        .padAngle(0.01)
        .sort(null)
        .value(function(d) { return 1; });

    //draw background rectangle to display viz on.
    svg.append("rect")
        .attr("id", "background_rectangle")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "lightgrey")
        .attr("fill-opacity", 0.5)
        .on("click", cancel)

    var month_arcs = svg.append("g")
        .attr("class", "dateChooser")
        .attr("id", "month_arcs")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var time_arcs = svg.append("g")
        .attr("class", "dateChooser")
        .attr("id", "time_arcs")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    function drawDates(times, months){

        //first we draw arcs for the months.
        var monthArc = month_arcs.selectAll(".months")
              .data(pie(months))
            .enter().append("g")
              .attr("class", "months")

        //Create the donut slices and also the invisible arcs for the text
        monthArc.append("path")
        	.attr("class", "monthArcs")
        	.attr("d", startArc)
            .style("fill",  function(d,i){return i < 6 ? color_scale(i) : color_scale(6 - (i - 6))})
            .style("fill-opacity", 0.8)
            .attr("id", function(d,i) { return "arc_"+i; }) //Give each slice a unique ID
            .transition().duration(700)
            .attr("d", arc)
        	.each(function(d,i) {
        		var firstArcSection = /(^.+?)L/;

        		var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
        		newArc     = newArc.replace(/,/g , " ");

                //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
                //flip the end and start position
                if (d.endAngle >= 100 * Math.PI/180) {
                    var startLoc 	= /M(.*?)A/,		//Everything between the capital M and first capital A
                        middleLoc 	= /A(.*?)0 0 1/,	//Everything between the capital A and 0 0 1
                        endLoc 		= /0 0 1 (.*?)$/;	//Everything between the 0 0 1 and the end of the string (denoted by $)
                    //Flip the direction of the arc by switching the start and end point (and sweep flag)
                    var newStart  = endLoc.exec( newArc )[1];
                    var newEnd    = startLoc.exec( newArc )[1];
                    var middleSec = middleLoc.exec( newArc )[1];
                    //Build up the new arc notation, set the sweep-flag to 0
                    newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
                }

        		//Create a new invisible arc that the text can flow along
        		monthArc.append("path")
        			.attr("class", "monthArcs")
        			.attr("id", "donutArc"+i)
        			.attr("d", newArc)
        			.style("fill", "none")
                    .style("pointer-events", "none !imporatant;")
        	});

        //Append the label names on the outside
        monthArc.append("text")
            .attr("class", "donutText")
            .attr("dy", function(d,i) { return (d.endAngle > 100 * Math.PI/180 ? 12 : -2); })
            .append("textPath")
            .attr("startOffset","50%")
            .style("text-anchor","middle")
            .attr("font-size", 20)
            .attr("xlink:href",function(d,i){return "#donutArc"+i;})
            .text(function(d){return d.data;})
            .attr("fill-opacity", 0)
            .transition().duration(700)
            .attr("fill-opacity", 1)

        //draw the part that shows early and late.
        var timeArc = time_arcs.selectAll(".times")
              .data(pie(times))
            .enter().append("g")
              .attr("class", "time_arcs")
              .on("mouseover", moused)
              .on("mouseout", unmoused)
              .on("click", clicked);

        timeArc.append("path")
          .attr("d", time)
         .style("fill", "steelblue")
         .style("fill-opacity", 0)

        timeArc.append("text")
          .attr("transform", function(d) { return "translate(" + time.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d,i) {return i%2 == 0 ? "early" : "late";})
          .attr("fill-opacity", 0)
          .transition().duration(700)
          .attr("fill-opacity", 1)
    }

    function moused(d){
        d3.select(this).select("path")
            .attr("stroke-width", "4")
            .attr("stroke", "black")
    }

    function unmoused(d){
        d3.select(this).select("path")
            .attr("stroke-width", "0")
    }

    function clicked(d){
        d3.json("data/seasonalData.json", function(data){
            //grab the data we need.
            console.log(data[currentState][d.data])
            drawInSeason(data[currentState][d.data])
        })
    }

    function cancel(d){
        d3.selectAll(".dateChooser").remove()
        d3.select("#background_rectangle").remove()
        d3.selectAll(".results").remove()
        d3.select("#results").classed("hidden", "true")
        reset()
    }

    d3.json("data/seasonData_d3.json", function(data){
        var times = data.children[1].children.map(function(d){return d.name})
        //loop every other value to skip repeates
        var months = []
        for (var i = 0; i < 12; i++){
            months.push(data.children[1].children[i*2].name.split(' ')[1])
        }
        drawDates(times, months)
    })
}
