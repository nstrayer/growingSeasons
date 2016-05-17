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

        for (var row = 1; row <= rows; row++){
            for (var col = 1; col <= cols; col++){
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

    //seperate data into fruits, veggies, herbs.
    var fruits  = [],
        veggies = [],
        herbs   = [];

    data.forEach(function(d){
        if(d.type == "Fruit"){
            fruits.push(d)
        } else if (d.type == "Vegetable"){
            veggies.push(d)
        } else if (d.name != "Herbs"){
            herbs.push(d)
        } else {}//do nothing, this gets rid of the dumb herb listing of "Herbs"
    });

    console.log(herbs)
    d3.select("#results").classed("hidden", false)

    function drawVeggies(){
        if(veggies.length == 0){
            d3.select("#veggie_res")
                .append("p")
                .attr("class", "results")
                .text("No veggies in season.")
            drawFruits()
        }
        d3.select("#veggie_res").selectAll(".results")
            .data(veggies).enter()
            .append("p")
            .attr("class", "results")
            .text("")
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
            // .each("end", function(d,i){if (i == veggies.length - 1){drawFruits()}}) //wait till veggies are done to draw fruits
    }

    function drawFruits(){
        if(fruits.length == 0){
            d3.select("#fruit_res")
                .append("p")
                .attr("class", "results")
                .text("No fruits in season.")
            drawHerbs()
        }

        d3.select("#fruit_res").selectAll(".results")
            .data(fruits).enter()
            .append("p")
            .attr("class", "results")
            .text("")
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
            // .each("end", function(d,i){if (i == fruits.length - 1){drawHerbs()}})
    }

    function drawHerbs(){
        if(herbs.length == 0){
            d3.select("#herb_res")
                .append("p")
                .attr("class", "results")
                .text("No herbs in season.")

        }
        d3.select("#herb_res").selectAll(".results")
            .data(herbs).enter()
            .append("p")
            .attr("class", "results")
            .text("")
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
    }

    drawVeggies() //kick it off.
    drawFruits()
    drawHerbs()
    d3.selectAll(".dateChooser").remove()
}
