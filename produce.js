//function to grab the current svg and append a viz of the currently in season stuff on it.
//data is a vector of objects in the form {"name": <veggie/fruit name>, "type": <fruit, veggie, etc>}
function drawInSeason(data){

    var selected = [];
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
            .on("click", clicked)
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
            .on("click", clicked)
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
            .on("click", clicked)
            .transition().delay(function(d,i){return i*50}).duration(250)
            .text(function(d){return d.name})
    }

    drawVeggies() //kick it off.
    drawFruits()
    drawHerbs()

    function clicked(d){
        console.log(d.name)
        var alreadySelected = selected.indexOf(d.name)
        console.log(alreadySelected)
        if(alreadySelected == -1){ //if not in selected list
            selected.push(d.name) //put it in selected array.
            d3.select(this).style("font-weight", "bold") //bold it
        } else {
            selected.splice(alreadySelected, 1); //remove from selected
            d3.select(this).style("font-weight", "normal") //reset style
        }
    }

    //code for recipe button
    d3.select("#recipeButton")
        .on("click", function(){
            var url = "http://allrecipes.com/search/results/?wt="
            selected.forEach(function(ingredient, i){
                ingredient = ingredient.replace(/[/(,.\))]/g, ""); //gets rid of parenthesis and commas
                ingredient = ingredient.replace(/ /g, "%20");
                url = url.concat(i == 0? ingredient: ",%20" + ingredient)
            })
            function OpenInNewTab(url) {
              var win = window.open(url, '_blank');
              win.focus();
            }
            OpenInNewTab(url)
            d3.select(this).classed("hovered", false)
        })

    //clear selections on click
    d3.select("#clearButton")
        .on("click", function(){
            selected = [] //clear selected list
            d3.selectAll(".results").style("font-weight", "normal")
            d3.select(this).classed("hovered", false)
        })

    //back button
    d3.select("#backButton")
        .on("click", function(){
            selected = [] //reset selected ingredients
            d3.select("#results").classed("hidden", true) //hide results again
            d3.selectAll(".results").remove() //delete all written values.
            dateSelector() //open date selector.
            svg.select("#background_text") //switch back to just the state text
                .transition().duration(900)
                .attr("font-size", "4em")
                .text(currentState)
            svg.select("#background_rectangle").remove() //remove hidden background rectangle
            d3.select(this).classed("hovered", false)
        })
        .on("mouseover", buttonHover)
        .on("mouseout", buttonUnHover)

    d3.selectAll(".buttons")
        .on("mouseover", buttonHover)
        .on("mouseout", buttonUnHover)

    function buttonHover(d){
        d3.select(this).classed("hovered", true)
    }

    function buttonUnHover(d){
        d3.select(this).classed("hovered", false)
    }
    //update header text
    d3.select("#background_text")
        .transition().duration(500)
        .attr("font-size", isMobile? "1.8em": "4em")
        .text(currentState + " in " + currentTime)

    d3.selectAll(".dateChooser").remove()
}
