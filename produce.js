//adopted from Elija Meeks D3 book
d3.layout.grid = function(){
    var gridSize  = [0,10],
        gridXScale = d3.scale.linear(),
        gridYScale = d3.scale.linear();

    function processGrid(data){

        var rows = Math.ceil(Math.sqrt(data.length)),
            cols = rows,
            cell = 0;

        gridXScale.domain([1,cols]).range([0, gridSize[0]]); //update domain and range of scales.
        gridYScale.domain([1,rows]).range([0, gridSize[1]]);

        for (var row = 0; row < rows; row++){
            for (var col = 0; col < cols; col++){
                if (data[cell]){
                    data[cell].x = gridXScale(col); //output already scalled values.
                    data[cell].y = gridYScale(row);
                    cell++;
                } else{
                    break;
                }
            }//col loop
        }//row loop
        return data;
    }//processGrid function

    processGrid.size = function(newSize){
        if(!arguments.length) return gridSize;
        gridSize = newSize;
        return this;
    } //processGrid.size function.

    return processGrid;
}//layout.grid function.

//function to grab the current svg and append a viz of the currently in season stuff on it.
//data is a vector of objects in the form {"name": <veggie/fruit name>, "type": <fruit, veggie, etc>}
function drawInSeason(data){
    var grid = d3.layout.grid();
    grid.size([height, width]);
    var griddedData = grid(data.tweets);

    //append a g element for the grid.
    var inSeason = svg.append("g")
        .attr("class", "inSeasonViz")

    inSeason.selectAll(".items")
        .data(griddedData)
        .enter().append("text")
        .attr("class", "items")
        .attr("x", function(d){return d.x })
        .attr("y", function(d){return d.y })
        .text(function(d){return d.name;})
        .style("text-anchor","middle")
        .attr("font-size", 20)
        .attr("fill", function(d){ d.type == "fruit" ? "blue": "green"})
        .attr("fill-opacity", 0)
        .transition().duration(700)
        .attr("fill-opacity", 1)
}
