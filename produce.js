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
        }

        d3.select("#veggie_res").selectAll(".results")
            .data(veggies).enter()
            .append("p")
            .attr("class", "results")
            .text("")
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
    }

    function drawFruits(){
        if(fruits.length == 0){
            d3.select("#fruit_res")
                .append("p")
                .attr("class", "results")
                .text("No fruits in season.")
        }

        d3.select("#fruit_res").selectAll(".results")
            .data(fruits).enter()
            .append("p")
            .attr("class", "results")
            .text("")
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
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

    //update header text
    d3.select("#background_text")
        .transition().duration(500)
        .attr("font-size", isMobile? "1.8em": "4em")
        .text(currentState + " in " + currentTime)

    d3.selectAll(".dateChooser").remove()
}
